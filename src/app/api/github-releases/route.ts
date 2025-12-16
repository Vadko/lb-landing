import { NextResponse } from "next/server";
import type { GitHubRelease } from "@/lib/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const GITHUB_REPO = "Vadko/littlebit-launcher";
const CACHE_KEY = "github-releases";
const CACHE_TTL_SECONDS = 3600; // 1 година

interface CachedData {
  latest: GitHubRelease;
  totalDownloads: number;
  timestamp: number;
}

async function getKV(): Promise<KVNamespace | null> {
  try {
    const { env } = await getCloudflareContext();
    return (env as { GITHUB_CACHE_KV?: KVNamespace }).GITHUB_CACHE_KV ?? null;
  } catch {
    return null;
  }
}

async function getCachedData(): Promise<CachedData | null> {
  const kv = await getKV();
  if (!kv) return null;

  try {
    return await kv.get<CachedData>(CACHE_KEY, "json");
  } catch {
    return null;
  }
}

async function setCachedData(data: CachedData): Promise<void> {
  const kv = await getKV();
  if (!kv) return;

  try {
    await kv.put(CACHE_KEY, JSON.stringify(data), {
      expirationTtl: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Failed to cache data in KV:", error);
  }
}

async function fetchFromGitHub() {
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
  const cached = await getCachedData();

  // Є кеш - одразу повертаємо
  if (cached) {
    return NextResponse.json(
      { latest: cached.latest, totalDownloads: cached.totalDownloads },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
        },
      }
    );
  }

  // Кешу немає - отримуємо з GitHub
  try {
    const data = await fetchFromGitHub();
    await setCachedData({ ...data, timestamp: Date.now() });

    return NextResponse.json(
      { latest: data.latest, totalDownloads: data.totalDownloads },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
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
