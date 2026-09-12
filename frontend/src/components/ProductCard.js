import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/api";
import { getProductImages, getProductVideos } from "../lib/productMedia";
import { EASE } from "./Reveal";

const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect fill='%23EFECE5' width='400' height='500'/%3E%3C/svg%3E";

export const ProductCard = ({ product, index = 0, tall = false }) => {
  const { toggle, has } = useWishlist();
  const saved = has(product.slug);
  const images = getProductImages(product);
  const videos = getProductVideos(product);
  const primaryImg = images[0] || placeholderImg;
  const hoverImg = images[1] || images[0] || placeholderImg;
  const extraMedia = Math.max(0, images.length + videos.length - 1);

  return (
    <motion.article
      data-testid="product-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.1, ease: EASE }}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        data-testid={`product-card-link-${product.slug}`}
        className="block"
      >
        <div className={`relative overflow-hidden bg-[#EFECE5] ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
          <img
            src={primaryImg}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
          />
          {images[1] && (
            <img
              src={hoverImg}
              alt={`${product.name} lifestyle`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 scale-105 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}
          {product.badge && (
            <span className="absolute left-4 top-4 bg-[#F8F6F2] px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] font-semibold text-[#121212]">
              {product.badge}
            </span>
          )}
          {extraMedia > 0 && (
            <span className="absolute bottom-4 right-4 bg-[#121212] px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-[#F8F6F2]">
              +{extraMedia} media
            </span>
          )}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 translate-y-3 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-y-0" style={{ transitionProperty: "opacity, transform" }}>
            <span className="bg-[#121212] px-6 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-[#F8F6F2]">
              View product
            </span>
          </span>
        </div>
      </Link>

      <button
        data-testid={`wishlist-toggle-${product.slug}`}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggle(product.slug)}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F6F2]/90 backdrop-blur transition-transform duration-300 hover:scale-110"
      >
        <Heart
          size={15}
          strokeWidth={1.5}
          className={saved ? "fill-[#C9A66B] text-[#C9A66B]" : "text-[#1C1C1C]"}
        />
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.26em] text-[#7A8164] font-semibold">
            {product.collection} · {product.category}
          </p>
          <h3 className="font-serif-display mt-1.5 text-xl font-medium leading-snug text-[#121212]">
            {product.name}
          </h3>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium text-[#121212]" data-testid={`product-price-${product.slug}`}>
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 text-[0.65rem] text-[#7A8164]">View details</p>
        </div>
      </div>
    </motion.article>
  );
};
