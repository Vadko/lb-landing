"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type { GameListItem, GamesResponse, GameStatus } from "@/lib/types";

const GAMES_PER_PAGE = 12;

interface FetchGamesParams {
  offset: number;
  limit: number;
  search?: string;
  status?: string;
}

async function fetchGames({
  offset,
  limit,
  search,
  status,
}: FetchGamesParams): Promise<GamesResponse> {
  let query = supabase
    .from("games")
    .select(
      "id, name, slug, status, thumbnail_path, translation_progress, team, banner_path",
      { count: "exact" }
    )
    .eq("approved", true)
    .order("name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status as GameStatus);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;

  return {
    games: (data as GameListItem[]) ?? [],
    total,
    hasMore: offset + limit < total,
    nextOffset: offset + limit,
  };
}

export function useGamesInfinite(search?: string, status?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.games.list({ search, status }),
    queryFn: ({ pageParam = 0 }) =>
      fetchGames({
        offset: pageParam,
        limit: GAMES_PER_PAGE,
        search,
        status,
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
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("approved", true);

      if (error) {
        throw new Error(error.message);
      }

      return count ?? 0;
    },
  });
}
