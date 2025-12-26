import { NextResponse } from "next/server";
import type { GitHubRelease } from "@/lib/types";
import { getFromCache, setCache } from "@/lib/redis";

const GITHUB_REPO = "Vadko/littlebit-launcher";
const CACHE_KEY = "github:releases";
const CACHE_TTL_SECONDS = 3600;

interface CachedData {
  latest: GitHubRelease;
  totalDownloads: number;
}

async function fetchFromGitHub(): Promise<CachedData> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "lb-landing/1.0",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [latestResponse, allReleasesResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers,
    }),
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100`, {
      headers,
    }),
  ]);

  if (!latestResponse.ok) {
    throw new Error(`GitHub API error: ${latestResponse.status}`);
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
  const cached = await getFromCache<CachedData>(CACHE_KEY);

  if (cached) {
    return NextResponse.json(
      { latest: cached.latest, totalDownloads: cached.totalDownloads },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
          "X-Cache": "HIT",
        },
      }
    );
  }

  try {
    const data = await fetchFromGitHub();

    await setCache(CACHE_KEY, data, CACHE_TTL_SECONDS);

    return NextResponse.json(
      { latest: data.latest, totalDownloads: data.totalDownloads },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("GitHub releases API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch releases", message: String(error) },
      { status: 500 }
    );
  }
}
