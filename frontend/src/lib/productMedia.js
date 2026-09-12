/**
 * Change summary
 * What: Shared helpers for product image lists and video links.
 * Why: Admin can now save many image/video URLs; the shop must show them safely.
 * Related: Admin.js, ProductMediaGallery.js, ProductDetail.js, firestoreApi.js
 *
 * NOTE: URL parsing stays conservative — only http(s) links are kept, and only
 * YouTube, Vimeo, or direct video files are embedded on the page.
 */

// --- URL cleanup ---

export const parseHttpUrl = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (!/^https?:$/.test(url.protocol)) return null;
    return trimmed;
  } catch {
    return null;
  }
};

export const cleanUrlList = (values) =>
  (Array.isArray(values) ? values : [values])
    .map((value) => parseHttpUrl(value))
    .filter(Boolean);

export const getProductImages = (product) => cleanUrlList(product?.images);
export const getProductVideos = (product) => cleanUrlList(product?.videos);

// --- Video source detection ---

const youtubeIdFromUrl = (url) => {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] || "";
  }
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
  if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] || "";
  return url.searchParams.get("v") || "";
};

const vimeoIdFromUrl = (url) => {
  const parts = url.pathname.split("/").filter(Boolean);
  if (url.hostname.includes("player.vimeo.com") && parts[0] === "video") {
    return parts[1] || "";
  }
  return parts.find((part) => /^\d+$/.test(part)) || "";
};

export const parseVideoSource = (rawUrl) => {
  const href = parseHttpUrl(rawUrl);
  if (!href) return null;

  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com")) {
    const id = youtubeIdFromUrl(url);
    if (id) {
      return {
        type: "youtube",
        href,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
        thumbUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }

  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    const id = vimeoIdFromUrl(url);
    if (id) {
      return {
        type: "vimeo",
        href,
        embedUrl: `https://player.vimeo.com/video/${id}`,
        thumbUrl: "",
      };
    }
  }

  // Direct file links can play in a normal HTML video tag.
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url.pathname)) {
    return { type: "file", href, embedUrl: href, thumbUrl: "" };
  }

  // Unknown https links are stored, but opened in a new tab instead of an iframe.
  return { type: "link", href, embedUrl: "", thumbUrl: "" };
};

// --- Gallery model used by the product page ---

export const buildProductGallery = (product) => {
  const images = getProductImages(product).map((href, index) => ({
    kind: "image",
    key: `image-${index}`,
    href,
    thumbUrl: href,
  }));

  const videos = getProductVideos(product)
    .map((href, index) => {
      const source = parseVideoSource(href);
      if (!source) return null;
      return {
        kind: "video",
        key: `video-${index}`,
        href: source.href,
        embedUrl: source.embedUrl,
        thumbUrl: source.thumbUrl,
        videoType: source.type,
      };
    })
    .filter(Boolean);

  return [...images, ...videos];
};
