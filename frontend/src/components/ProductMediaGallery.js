/**
 * Change summary
 * What: Product gallery that shows every saved image plus optional videos.
 * Why: Admin now stores multiple media links; images stay portrait, videos use 16:9.
 * Related: ProductDetail.js, productMedia.js
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { EASE } from "./Reveal";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect fill='%23EFECE5' width='400' height='500'/%3E%3C/svg%3E";

export const ProductMediaGallery = ({ product, gallery }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const active = gallery[activeIndex] || { kind: "image", key: "empty", href: placeholderImg };
  const isImage = active.kind === "image";

  // Zoom only makes sense on still photos, not on an embedded player.
  const onZoomMove = (event) => {
    if (!isImage) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const selectItem = (index) => {
    setActiveIndex(index);
    setZoom({ active: false, x: 50, y: 50 });
  };

  return (
    <div className="lg:col-span-7">
      {/* --- Main viewer: portrait for photos, widescreen for video --- */}
      <div
        className={`relative overflow-hidden bg-[#121212] ${
          isImage ? "aspect-[4/5] cursor-zoom-in bg-[#EFECE5]" : "aspect-video bg-[#121212]"
        }`}
        onMouseMove={onZoomMove}
        onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
        data-testid="product-main-image"
      >
        <AnimatePresence mode="wait">
          {isImage ? (
            <motion.img
              key={active.key}
              src={active.href || placeholderImg}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: zoom.active ? 1.6 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : {}}
              className="h-full w-full object-cover"
            />
          ) : (
            <motion.div
              key={active?.key || "empty"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="h-full w-full"
            >
              <VideoPlayer item={active} productName={product.name} />
            </motion.div>
          )}
        </AnimatePresence>
        {product.badge && (
          <span className="absolute left-5 top-5 bg-[#F8F6F2] px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] font-semibold">
            {product.badge}
          </span>
        )}
      </div>

      {/* --- Thumbnails stay in one scrolling row so many links still fit --- */}
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {gallery.map((item, index) => (
            <button
              key={item.key}
              type="button"
              data-testid={`gallery-thumb-${index}`}
              onClick={() => selectItem(index)}
              aria-label={item.kind === "video" ? `Play video ${index + 1}` : `View image ${index + 1}`}
              className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-[#EFECE5] transition-opacity duration-300 ${
                activeIndex === index
                  ? "ring-1 ring-[#121212] ring-offset-2 ring-offset-[#F8F6F2]"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {item.thumbUrl ? (
                <img src={item.thumbUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#121212] text-[#F8F6F2]">
                  <Play size={16} fill="currentColor" />
                </span>
              )}
              {item.kind === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-[#121212]/35">
                  <Play size={14} fill="#F8F6F2" className="text-[#F8F6F2]" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const VideoPlayer = ({ item, productName }) => {
  if (!item) return null;

  if (item.videoType === "youtube" || item.videoType === "vimeo") {
    return (
      <iframe
        src={item.embedUrl}
        title={`${productName} video`}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (item.videoType === "file") {
    return (
      <video
        src={item.href}
        controls
        playsInline
        className="h-full w-full bg-[#121212] object-contain"
      >
        <track kind="captions" />
      </video>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center text-[#F8F6F2]">
      <Play size={28} strokeWidth={1.25} />
      <p className="font-serif-display text-2xl font-light">Watch this product video</p>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-light"
      >
        Open video
      </a>
    </div>
  );
};
