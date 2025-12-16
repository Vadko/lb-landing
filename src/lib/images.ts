/**
 * R2 public URL for images (via custom domain)
 */
const R2_IMAGES_URL =
  process.env.NEXT_PUBLIC_R2_IMAGES_URL || "https://images.lblauncher.com";

/**
 * Converts a storage path to a full R2 storage URL.
 * Handles both relative paths and full URLs.
 * @param path - шлях до зображення
 * @param updatedAt - timestamp останнього оновлення для cache-busting
 */
export function getImageUrl(
  path: string | null,
  updatedAt?: string | null
): string | null {
  if (!path) return null;

  // Already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (updatedAt) {
      const separator = path.includes("?") ? "&" : "?";
      return `${path}${separator}v=${new Date(updatedAt).getTime()}`;
    }
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  const baseUrl = `${R2_IMAGES_URL}/${cleanPath}`;

  // Cache-busting: додати timestamp щоб браузер завантажив нову версію при оновленні
  if (updatedAt) {
    return `${baseUrl}?v=${new Date(updatedAt).getTime()}`;
  }

  return baseUrl;
}
