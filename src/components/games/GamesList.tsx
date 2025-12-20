"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGamesInfinite, useTeams } from "@/hooks/useGames";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GameCard } from "./GameCard";
import { GamesSearch } from "./GamesSearch";

export function GamesList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");

  // Fetch authors list (renamed from teams for clarity)
  const { data: authors = [], isLoading: authorsLoading } = useTeams();

  // Read selected statuses from URL params (comma-separated)
  const selectedStatuses = useMemo(() => {
    const statusesParam = searchParams.get("statuses");
    if (!statusesParam) return [];
    return statusesParam.split(",").filter(Boolean);
  }, [searchParams]);

  // Read selected authors from URL params (comma-separated)
  const selectedAuthors = useMemo(() => {
    const authorsParam = searchParams.get("authors");
    // Support old 'team' param for backward compatibility
    const teamParam = searchParams.get("team");
    if (authorsParam) {
      return authorsParam.split(",").filter(Boolean);
    }
    if (teamParam) {
      return [teamParam];
    }
    return [];
  }, [searchParams]);

  // Update URL with new filter values
  const updateFilters = useCallback(
    (newStatuses: string[], newAuthors: string[]) => {
      const params = new URLSearchParams();
      if (newStatuses.length > 0) {
        params.set("statuses", newStatuses.join(","));
      }
      if (newAuthors.length > 0) {
        params.set("authors", newAuthors.join(","));
      }
      const queryString = params.toString();
      router.push(queryString ? `/games?${queryString}` : "/games");
    },
    [router]
  );

  const handleStatusesChange = useCallback(
    (newStatuses: string[]) => {
      updateFilters(newStatuses, selectedAuthors);
    },
    [updateFilters, selectedAuthors]
  );

  const handleAuthorsChange = useCallback(
    (newAuthors: string[]) => {
      updateFilters(selectedStatuses, newAuthors);
    },
    [updateFilters, selectedStatuses]
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGamesInfinite(search, selectedStatuses, selectedAuthors);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const observerTarget = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const allGames = data?.pages.flatMap((page) => page.games) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div>
      <GamesSearch
        value={search}
        onChange={setSearch}
        selectedStatuses={selectedStatuses}
        onStatusesChange={handleStatusesChange}
        selectedAuthors={selectedAuthors}
        onAuthorsChange={handleAuthorsChange}
        authors={authors}
        authorsLoading={authorsLoading}
      />

      {!isLoading && (
        <p className="games-count">
          Знайдено ігор: <strong>{total}</strong>
        </p>
      )}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="games-empty">
          <i className="fa-solid fa-exclamation-triangle" />
          <h3>Помилка</h3>
          <p>Помилка завантаження ігор</p>
        </div>
      ) : allGames.length === 0 ? (
        <div className="games-empty">
          <i className="fa-solid fa-gamepad" />
          <h3>Ігор не знайдено</h3>
          <p>Спробуйте змінити параметри пошуку</p>
        </div>
      ) : (
        <>
          <div className="games-grid">
            {allGames.map((game) => (
              <div key={game.slug} className="game-card-wrapper">
                <GameCard game={game} />
              </div>
            ))}
          </div>

          {/* Observer for infinite scroll - always at the end */}
          {hasNextPage && (
            <div ref={observerTarget} style={{ height: 1 }} />
          )}

          {isFetchingNextPage && (
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
