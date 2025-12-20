"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type {
  GamesGroupedResponse,
  GameGroup,
  TranslationItem,
} from "@/lib/types";
import type { Database } from "@/lib/database.types";

type GamesGroupedRow = Database["public"]["Views"]["games_grouped"]["Row"];

const GAMES_PER_PAGE = 12;

interface FetchGamesParams {
  offset: number;
  limit: number;
  search?: string;
  statuses?: string[];
  authors?: string[];
}

// Type guard to check if row has required non-null fields
function isValidGameRow(
  row: GamesGroupedRow
): row is GamesGroupedRow & { slug: string; name: string } {
  return row.slug !== null && row.name !== null;
}

// Parse translations from JSON to typed array
function parseTranslations(translations: unknown): TranslationItem[] {
  if (!translations || !Array.isArray(translations)) return [];
  return translations as TranslationItem[];
}

// Get the most recent updated_at from translations
function getLatestUpdatedAt(translations: TranslationItem[]): string {
  if (translations.length === 0) return new Date().toISOString();
  return translations.reduce((latest, t) =>
    t.updated_at > latest ? t.updated_at : latest
  , translations[0].updated_at);
}

// Map database row to GameGroup
function mapRowToGameGroup(row: GamesGroupedRow & { slug: string; name: string }): GameGroup {
  const translations = parseTranslations(row.translations);
  return {
    slug: row.slug,
    name: row.name,
    banner_path: row.banner_path,
    thumbnail_path: row.thumbnail_path,
    is_adult: row.is_adult ?? false,
    updated_at: getLatestUpdatedAt(translations),
    translations,
  };
}

// Check if we have active filters
function hasActiveFilters(statuses?: string[], authors?: string[]): boolean {
  const hasStatuses = statuses && statuses.length > 0;
  const hasAuthors = authors && authors.length > 0;
  return Boolean(hasStatuses || hasAuthors);
}

// Paginated fetch using games_grouped view
async function fetchGamesGrouped({
  offset,
  limit,
  search,
  statuses,
  authors,
}: FetchGamesParams): Promise<GamesGroupedResponse> {
  // If filtering by statuses or authors, we need to filter by checking translations JSON
  if (hasActiveFilters(statuses, authors)) {
    return fetchGamesGroupedWithFilter({ offset, limit, search, statuses, authors });
  }

  let query = supabase
    .from("games_grouped")
    .select("*", { count: "exact" })
    .order("name")
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const games = (data ?? []).filter(isValidGameRow).map(mapRowToGameGroup);

  const total = count ?? 0;

  return {
    games,
    total,
    hasMore: offset + limit < total,
    nextOffset: offset + limit,
  };
}

// Filter in memory since view doesn't support JSON field filtering
async function fetchGamesGroupedWithFilter({
  offset,
  limit,
  search,
  statuses,
  authors,
}: FetchGamesParams): Promise<GamesGroupedResponse> {
  let query = supabase
    .from("games_grouped")
    .select("*")
    .order("name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Filter groups based on translations
  const filteredGroups = (data ?? []).filter(isValidGameRow).filter((row) => {
    const translations = parseTranslations(row.translations);

    // Filter by statuses - game matches if ANY translation has one of selected statuses
    if (statuses && statuses.length > 0) {
      if (!translations.some((t) => statuses.includes(t.status))) {
        return false;
      }
    }

    // Filter by authors - game matches if ANY translation has one of selected authors
    // Uses partial match to handle comma-separated team field (e.g., "Author A, Author B")
    if (authors && authors.length > 0) {
      const matchesAuthor = translations.some((t) =>
        authors.some((author) => t.team?.includes(author))
      );
      if (!matchesAuthor) {
        return false;
      }
    }

    return true;
  });

  const games = filteredGroups.map(mapRowToGameGroup);

  const total = games.length;
  const paginatedGames = games.slice(offset, offset + limit);

  return {
    games: paginatedGames,
    total,
    hasMore: offset + limit < total,
    nextOffset: offset + limit,
  };
}

export function useGamesInfinite(
  search?: string,
  statuses?: string[],
  authors?: string[]
) {
  return useInfiniteQuery({
    queryKey: queryKeys.games.list({ search, statuses, authors }),
    queryFn: ({ pageParam = 0 }) =>
      fetchGamesGrouped({
        offset: pageParam,
        limit: GAMES_PER_PAGE,
        search,
        statuses,
        authors,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
  });
}

export function useGamesCount() {
  return useQuery({
    queryKey: queryKeys.games.count(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("games_grouped")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw new Error(error.message);
      }

      return count ?? 0;
    },
  });
}

// Fetch unique authors from games' team field
// Parses comma-separated teams into individual authors
export function useTeams() {
  return useQuery({
    queryKey: queryKeys.games.authors(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("team")
        .eq("approved", true);

      if (error) {
        throw new Error(error.message);
      }

      // Parse comma-separated team field into individual authors
      const allAuthors = data
        .flatMap((row) => {
          if (!row.team) return [];
          return row.team.split(",").map((author) => author.trim());
        })
        .filter((author) => author.length > 0);

      // Get unique authors and sort alphabetically
      const uniqueAuthors = [...new Set(allAuthors)].sort((a, b) =>
        a.localeCompare(b, "uk")
      );

      return uniqueAuthors;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}
