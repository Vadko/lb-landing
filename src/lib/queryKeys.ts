export const queryKeys = {
  games: {
    all: ["games"] as const,
    list: (filters: { search?: string; status?: string; team?: string }) =>
      [...queryKeys.games.all, "list", filters] as const,
    detail: (slug: string) => [...queryKeys.games.all, "detail", slug] as const,
    count: () => [...queryKeys.games.all, "count"] as const,
    teams: () => [...queryKeys.games.all, "teams"] as const,
  },
  github: {
    release: ["github", "release"] as const,
  },
} as const;
