"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { GitHubRelease } from "@/lib/types";

const GITHUB_REPO = "Vadko/littlebit-launcher";

interface AllReleasesData {
  latest: GitHubRelease;
  totalDownloads: number;
}

async function fetchAllReleases(): Promise<AllReleasesData> {
  // Fetch only latest release for version info (швидше)
  const latestResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!latestResponse.ok) {
    throw new Error("Failed to fetch latest release");
  }

  const latest: GitHubRelease = await latestResponse.json();

  // Fetch all releases тільки для підрахунку downloads
  // Використовуємо per_page=100 і рахуємо тільки перші 20 релізів для швидкості
  const allReleasesResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    }
  );

  let totalDownloads = 0;
  if (allReleasesResponse.ok) {
    const releases: GitHubRelease[] = await allReleasesResponse.json();
    // Оптимізований підрахунок - один прохід
    for (const release of releases) {
      for (const asset of release.assets) {
        totalDownloads += asset.download_count;
      }
    }
  }

  return {
    latest,
    totalDownloads,
  };
}

export function useGitHubRelease() {
  return useQuery({
    queryKey: queryKeys.github.release,
    queryFn: fetchAllReleases,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function getDownloadLinks(data: AllReleasesData | undefined) {
  if (!data) {
    return {
      windows: null,
      macos: null,
      linux: null,
      version: null,
      publishedAt: null,
      totalDownloads: 0,
    };
  }

  const { latest: release, totalDownloads } = data;
  const assets = release.assets;

  const windows = assets.find((a) => a.name.endsWith("Setup.exe"));
  const macos = assets.find((a) => a.name.endsWith(".dmg"));
  const linux = assets.find((a) => a.name.endsWith(".AppImage"));

  return {
    windows: windows?.browser_download_url ?? null,
    macos: macos?.browser_download_url ?? null,
    linux: linux?.browser_download_url ?? null,
    version: release.tag_name.replace("v", ""),
    publishedAt: release.published_at,
    totalDownloads,
  };
}

export function detectOS(): "windows" | "macos" | "linux" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";

  return "unknown";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
