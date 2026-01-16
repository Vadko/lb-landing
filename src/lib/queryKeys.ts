export const queryKeys = {
  games: {
    all: ["games"] as const,
    list: (filters: {
      search?: string;
      statuses?: string[];
      authors?: string[];
    }) => [...queryKeys.games.all, "list", filters] as const,
    detail: (slug: string) => [...queryKeys.games.all, "detail", slug] as const,
    count: () => [...queryKeys.games.all, "count"] as const,
    authors: () => [...queryKeys.games.all, "authors"] as const,
  },
  github: {
    release: ["github", "release"] as const,
  },
} as const;
