import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { teamToSlug } from "@/lib/transliterate";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const { slug, team } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    // Revalidate game pages
    const teamSlug = team ? teamToSlug(team) : null;
    if (teamSlug) {
      // Specific team page
      revalidatePath(`/games/${slug}/${teamSlug}`);
    }
    // Game overview page (all teams)
    revalidatePath(`/games/${slug}`);
    // Games list page
    revalidatePath("/games");

    return NextResponse.json({
      revalidated: true,
      paths: teamSlug
        ? [`/games/${slug}/${teamSlug}`, `/games/${slug}`, "/games"]
        : [`/games/${slug}`, "/games"],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", message: (error as Error).message },
      { status: 500 }
    );
  }
}
