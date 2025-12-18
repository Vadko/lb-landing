import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { teamToSlug } from "@/lib/transliterate";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  const { data: games } = await supabase
    .from("games")
    .select("slug, team, updated_at")
    .eq("approved", true);

  const allGames = games ?? [];

  // Group games by slug to determine which have multiple translations
  const slugGroups = new Map<string, typeof allGames>();
  for (const game of allGames) {
    const existing = slugGroups.get(game.slug) ?? [];
    existing.push(game);
    slugGroups.set(game.slug, existing);
  }

  const gameUrls: MetadataRoute.Sitemap = [];

  for (const [slug, translations] of slugGroups) {
    // Get the most recent update date for the slug page
    const latestUpdate = translations.reduce(
      (latest, t) =>
        new Date(t.updated_at) > latest ? new Date(t.updated_at) : latest,
      new Date(0)
    );

    // Add slug page (shows all translations or redirects if single)
    gameUrls.push({
      url: `https://lblauncher.com/games/${slug}`,
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    // Add individual translation pages
    for (const translation of translations) {
      gameUrls.push({
        url: `https://lblauncher.com/games/${slug}/${teamToSlug(translation.team)}`,
        lastModified: new Date(translation.updated_at),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return [
    {
      url: "https://lblauncher.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://lblauncher.com/games",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...gameUrls,
  ];
}
