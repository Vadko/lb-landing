import { createServerClient } from "@/lib/supabase/server";
import type { Game } from "@/lib/types";
import { teamToSlug } from "@/lib/transliterate";

// Get all translations for a specific game slug
export async function getGamesBySlug(slug: string): Promise<Game[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("approved", true)
    .order("translation_progress", { ascending: false });

  if (error) {
    return [];
  }

  return data;
}

// Get a specific translation by slug and team slug (transliterated)
export async function getGameBySlugAndTeamSlug(
  slug: string,
  teamSlug: string
): Promise<Game | null> {
  const supabase = createServerClient();

  // Get all games with this slug and find matching team by transliterated slug
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("approved", true);

  if (error || !data) {
    return null;
  }

  // Find the game where team slug matches
  const game = data.find((g) => teamToSlug(g.team) === teamSlug);
  return game || null;
}

// Get unique game slugs (for generating static paths)
export async function getAllGameSlugs(): Promise<string[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select("slug")
    .eq("approved", true);

  if (error) {
    return [];
  }

  // Return unique slugs
  const uniqueSlugs = [...new Set(data.map((g) => g.slug))];
  return uniqueSlugs;
}

// Get all slug+teamSlug combinations (for static paths)
export async function getAllGameSlugsWithTeams(): Promise<
  { slug: string; teamSlug: string }[]
> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select("slug, team")
    .eq("approved", true);

  if (error) {
    return [];
  }

  return data.map((g) => ({
    slug: g.slug,
    teamSlug: teamToSlug(g.team),
  }));
}
