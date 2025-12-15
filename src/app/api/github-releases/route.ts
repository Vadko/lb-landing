import { NextResponse } from "next/server";
import type { GitHubRelease } from "@/lib/types";

const GITHUB_REPO = "Vadko/littlebit-launcher";
const CACHE_TTL_SECONDS = 3600; // 1 година

async function fetchFromGitHub() {
  const [latestResponse, allReleasesResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: CACHE_TTL_SECONDS },
    }),
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: CACHE_TTL_SECONDS },
    }),
  ]);

  if (!latestResponse.ok) {
    throw new Error("Failed to fetch latest release");
  }

  const latest: GitHubRelease = await latestResponse.json();

  let totalDownloads = 0;
  if (allReleasesResponse.ok) {
    const releases: GitHubRelease[] = await allReleasesResponse.json();
    for (const release of releases) {
      for (const asset of release.assets) {
        totalDownloads += asset.download_count;
      }
    }
  }

  return { latest, totalDownloads };
}

export async function GET() {
  try {
    const data = await fetchFromGitHub();

    return NextResponse.json(
      {
        latest: data.latest,
        totalDownloads: data.totalDownloads,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
        },
      }
    );
  } catch (error) {
    console.error("GitHub releases API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch releases",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
