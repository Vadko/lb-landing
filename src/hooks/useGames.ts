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
  status?: string;
  team?: string;
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

// Map database row to GameGroup
function mapRowToGameGroup(row: GamesGroupedRow & { slug: string; name: string }): GameGroup {
  return {
    slug: row.slug,
    name: row.name,
    banner_path: row.banner_path,
    thumbnail_path: row.thumbnail_path,
    is_adult: row.is_adult ?? false,
    translations: parseTranslations(row.translations),
  };
}

// Paginated fetch using games_grouped view
async function fetchGamesGrouped({
  offset,
  limit,
  search,
  status,
  team,
}: FetchGamesParams): Promise<GamesGroupedResponse> {
  // If filtering by status or team, we need to filter by checking translations JSON
  if ((status && status !== "all") || team) {
    return fetchGamesGroupedWithFilter({ offset, limit, search, status, team });
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
  status,
  team,
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

    // Filter by status if specified
    if (status && status !== "all") {
      if (!translations.some((t) => t.status === status)) {
        return false;
      }
    }

    // Filter by team if specified (partial match - "Team A" matches "Team A & Team B")
    if (team) {
      if (!translations.some((t) => t.team?.includes(team))) {
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

export function useGamesInfinite(search?: string, status?: string, team?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.games.list({ search, status, team }),
    queryFn: ({ pageParam = 0 }) =>
      fetchGamesGrouped({
        offset: pageParam,
        limit: GAMES_PER_PAGE,
        search,
        status,
        team,
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

export function useTeams() {
  return useQuery({
    queryKey: queryKeys.games.teams(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("team")
        .eq("approved", true);

      if (error) {
        throw new Error(error.message);
      }

      // Get unique teams and sort alphabetically
      const uniqueTeams = [...new Set(data.map((row) => row.team))].sort(
        (a, b) => a.localeCompare(b, "uk")
      );

      return uniqueTeams;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}
