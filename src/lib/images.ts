const STORAGE_IMAGES_URL = process.env.NEXT_PUBLIC_STORAGE_IMAGES_URL!;

export function getImageUrl(
  path: string | null,
  updatedAt?: string | null
): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (updatedAt) {
      const separator = path.includes("?") ? "&" : "?";
      return `${path}${separator}v=${new Date(updatedAt).getTime()}`;
    }
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = `${STORAGE_IMAGES_URL}/${cleanPath}`;

  if (updatedAt) {
    return `${baseUrl}?v=${new Date(updatedAt).getTime()}`;
  }

  return baseUrl;
}
