/**
 * Injects automatic format (f_auto) and quality (q_auto) into Cloudinary image URLs.
 * Optionally allows passing a max width with crop limit (c_limit) for responsive cards/thumbnails.
 *
 * @param {string | null | undefined} url
 * @param {{ width?: number; quality?: string }} [options]
 * @returns {string}
 */
export function getOptimizedImageUrl(url, options) {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url; // Non-Cloudinary or local static images pass through untouched
  }

  // Avoid duplicate injection if already transformed
  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }

  const { width, quality = "auto" } = options || {};
  const transforms = ["f_auto", `q_${quality}`];
  if (width) {
    transforms.push(`w_${width}`, "c_limit");
  }

  const transformString = transforms.join(",");
  return url.replace("/image/upload/", `/image/upload/${transformString}/`);
}

/**
 * Optimizes Cloudinary video URLs (e.g., reels, product showcases)
 *
 * @param {string | null | undefined} url
 * @returns {string}
 */
export function getOptimizedVideoUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) {
    return url;
  }
  if (url.includes("/q_auto")) return url;

  return url.replace("/video/upload/", "/video/upload/q_auto:good/");
}
