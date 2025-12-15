import { NextResponse } from "next/server";
import type { GitHubRelease } from "@/lib/types";

export const runtime = "edge";

const GITHUB_REPO = "Vadko/littlebit-launcher";
const CACHE_TTL_SECONDS = 3600; // 1 година

async function fetchFromGitHub() {
  const [latestResponse, allReleasesResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    }),
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100`, {
      headers: { Accept: "application/vnd.github.v3+json" },
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

export async function GET(request: Request) {
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString());
  const cache = caches.default;

  // Перевіряємо кеш
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const data = await fetchFromGitHub();

    const response = NextResponse.json({
      latest: data.latest,
      totalDownloads: data.totalDownloads,
    });

    // Кешуємо відповідь
    response.headers.set("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`);

    // Зберігаємо в Cloudflare Cache
    const responseToCache = response.clone();
    await cache.put(cacheKey, responseToCache);

    return response;
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
