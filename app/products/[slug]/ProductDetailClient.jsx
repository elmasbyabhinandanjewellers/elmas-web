"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Star,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/context/CustomerContext";
import { useProducts } from "@/context/ProductsContext";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ProductCard";
import ImageMagnifier from "@/components/ImageMagnifier";
import LuxuryLoader from "@/components/LuxuryLoader";

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

const getImageUrl = (image) => {
  if (!image) return "/logo.png";
  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  if (image?.secure_url) return image.secure_url;
  if (image?.src) return image.src;
  return "/logo.png";
};

const getVideoUrl = (video) => {
  if (!video) return null;
  if (typeof video === "string") return video;
  if (video?.url) return video.url;
  if (video?.secure_url) return video.secure_url;
  if (video?.src) return video.src;
  return null;
};

const getProductImages = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.map(getImageUrl);
  }

  if (product?.image) return [getImageUrl(product.image)];
  if (product?.bannerImage) return [getImageUrl(product.bannerImage)];

  return ["/logo.png"];
};

const getProductVideos = (product) => {
  if (Array.isArray(product?.videos) && product.videos.length > 0) {
    return product.videos.map(getVideoUrl).filter(Boolean);
  }

  return [];
};

const getPrimaryLabel = (product) => {
  const collection =
    product?.collections?.[0]?.name ||
    product?.collection?.name ||
    product?.collection;

  const category =
    product?.categories?.[0]?.name ||
    product?.category?.name ||
    product?.category;

  return collection || category || "Elmas";
};

const getDimensionText = (dimensions) => {
  const length = dimensions?.length;
  const breadth = dimensions?.breadth;
  const height = dimensions?.height;

  const values = [
    length ? `${length} in` : null,
    breadth ? `${breadth} in` : null,
    height ? `${height} in` : null,
  ].filter(Boolean);

  return values.length ? values.join(" × ") : "Dimensions not available";
};

// Muted, controls-less video with a simple play/pause toggle.
// Letterbox background is #FAF7F2 to match the site's cream palette instead of black.
function MediaVideo({ src, className = "", onClick, containerClassName = "" }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = (e) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleWrapperClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    togglePlay(e);
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center bg-[#FAF7F2] ${containerClassName}`}
      onClick={handleWrapperClick}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        className={`w-full h-full object-contain ${className}`}
      />

      <button
        type="button"
        onClick={togglePlay}
        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white z-10"
      >
        {playing ? (
          <Pause size={16} className="text-white" fill="white" />
        ) : (
          <Play size={16} className="text-white ml-0.5" fill="white" />
        )}
      </button>
    </div>
  );
}

export default function ProductDetailClient({ slug }) {
  const {
    products,
    productLoading,
    fetchProducts,
    getProductBySlug,
    getProductsByCategory,
    getProductsByCollection,
  } = useProducts();

  useEffect(() => {
    if (!products.length) {
      fetchProducts({ limit: 100 });
    }
  }, [products.length]);

  const product = useMemo(() => getProductBySlug(slug), [products, slug]);

  const related = useMemo(() => {
    if (!product) return [];

    const firstCategory =
      product?.categories?.[0]?._id ||
      product?.categories?.[0]?.slug ||
      product?.categories?.[0]?.checkName ||
      product?.categories?.[0];

    const firstCollection =
      product?.collections?.[0]?._id ||
      product?.collections?.[0]?.slug ||
      product?.collections?.[0]?.checkName ||
      product?.collections?.[0];

    const items = firstCategory
      ? getProductsByCategory(firstCategory)
      : firstCollection
        ? getProductsByCollection(firstCollection)
        : [];

    return items.filter((item) => item._id !== product._id).slice(0, 4);
  }, [product, products]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerZoom, setViewerZoom] = useState(1);

  const { customer, addToCart, addToWishlist, removeFromWishlist } =
    useCustomer();

  const router = useRouter();

  const [relEmbla, relApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = useCallback(() => relApi?.scrollPrev(), [relApi]);
  const scrollNext = useCallback(() => relApi?.scrollNext(), [relApi]);

  const images = useMemo(() => getProductImages(product), [product]);
  const videos = useMemo(() => getProductVideos(product), [product]);

  // Images first, videos appended after — used for both thumbnails and the main viewer.
  const media = useMemo(
    () => [
      ...images.map((src) => ({ type: "image", src })),
      ...videos.map((src) => ({ type: "video", src })),
    ],
    [images, videos],
  );

  const inventory = Number(product?.inventory || 0);
  const isOutOfStock = inventory <= 0;

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(inventory > 0 ? 1 : 0);
    setViewerOpen(false);
    setViewerZoom(1);
  }, [product?._id, inventory]);

  useEffect(() => {
    const wishlist = customer?.wishlist || [];

    const exists = wishlist.some((item) => {
      const id = item?._id || item?.product || item;
      return id?.toString() === product?._id?.toString();
    });

    setWishlisted(exists);
  }, [customer, product?._id]);

  if (productLoading) {
    return <LuxuryLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 px-6">
        <div className="text-center max-w-md">
          <p className="font-luxury text-5xl text-forest-300 mb-4">✦</p>
          <h1 className="font-luxury text-3xl text-forest-800 mb-4">
            Piece Not Found
          </h1>
          <p className="font-sans text-sm text-cream-700 mb-8">
            This piece may have found its forever home. Explore our other
            treasures.
          </p>
          <Link href="/shop" className="btn-primary">
            EXPLORE COLLECTIONS
          </Link>
        </div>
      </div>
    );
  }

  const originalPrice = Number(product?.price || 0);
  const sellingPrice = Number(product?.selling_price || 0);

  const hasDiscount = sellingPrice > 0 && originalPrice > sellingPrice;

  const discount = hasDiscount
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const currentMedia = media[selectedImage] || media[0];
  const isCurrentVideo = currentMedia?.type === "video";

  const handleAuthRedirect = () => {
    toast.error("Please login first");
    router.push("/auth/login");
  };

  const openMobileViewer = () => {
    setViewerZoom(1);
    setViewerOpen(true);
  };

  const closeMobileViewer = () => {
    setViewerOpen(false);
    setViewerZoom(1);
  };

  const zoomIn = () => {
    setViewerZoom((z) => Math.min(z + 0.4, 3));
  };

  const zoomOut = () => {
    setViewerZoom((z) => Math.max(z - 0.4, 1));
  };

  const resetZoom = () => {
    setViewerZoom(1);
  };

  const nextViewerImage = () => {
    setSelectedImage((prev) => (prev + 1) % media.length);
    setViewerZoom(1);
  };

  const prevViewerImage = () => {
    setSelectedImage((prev) => (prev - 1 + media.length) % media.length);
    setViewerZoom(1);
  };

  const increaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((q) => {
      if (q >= inventory) {
        toast.error(
          `Only ${inventory} item${inventory > 1 ? "s" : ""} available`,
        );
        return q;
      }

      return q + 1;
    });
  };

  const decreaseQuantity = () => {
    if (isOutOfStock) return;
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (quantity > inventory) {
      toast.error(
        `Only ${inventory} item${inventory > 1 ? "s" : ""} available`,
      );
      setQuantity(inventory);
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart({
        productId: product._id,
        quantity,
        productSnapshot: product,
      });

      toast.success("Added to your cart");
    } catch (error) {
      if (error?.message === "Please login first") {
        handleAuthRedirect();
        return;
      }

      toast.error(error?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!customer?._id) {
      handleAuthRedirect();
      return;
    }

    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      if (error?.message === "Please login first") {
        handleAuthRedirect();
        return;
      }

      toast.error(error?.message || "Failed to update wishlist");
    }
  };

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-cream-200 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 font-sans text-xs text-cream-700 overflow-hidden">
          <Link href="/" className="hover:text-forest-700 shrink-0">
            HOME
          </Link>

          <ChevronRight size={10} className="shrink-0" />

          <Link href="/shop" className="hover:text-forest-700 shrink-0">
            COLLECTIONS
          </Link>

          <ChevronRight size={10} className="shrink-0" />

          <span className="text-forest-700 uppercase truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 sm:w-20 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
              {media.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 shrink-0 overflow-hidden border-2 bg-white transition-colors ${
                    selectedImage === i
                      ? "border-forest-700"
                      : "border-cream-300 hover:border-forest-400"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <div className="w-full h-full flex items-center justify-center bg-[#FAF7F2]">
                        <video
                          src={item.src}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <Play size={14} className="text-white ml-0.5" fill="white" />
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="w-full bg-white border border-cream-300 overflow-hidden">
              <div className="relative w-full aspect-square max-h-[620px] flex items-center justify-center bg-white">
                {isCurrentVideo ? (
                  <div className="hidden md:block w-full h-full">
                    <MediaVideo src={currentMedia.src} />
                  </div>
                ) : (
                  <div className="hidden md:block w-full h-full">
                    <ImageMagnifier
                      src={currentMedia?.src}
                      alt={product.name}
                      magnifierHeight={200}
                      magnifierWidth={200}
                      zoomLevel={2.2}
                      imageClassName="w-full h-full object-contain"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={openMobileViewer}
                  className="md:hidden w-full h-full flex items-center justify-center bg-white"
                >
                  {isCurrentVideo ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#FAF7F2]">
                      <video
                        src={currentMedia.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={currentMedia?.src}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </button>

                <p className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full">
                  {isCurrentVideo ? "Tap to play" : "Tap to zoom"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-forest-500 mb-2">
              {getPrimaryLabel(product)?.toString()?.toUpperCase()} COLLECTION
            </p>

            <h1 className="font-luxury text-4xl md:text-5xl text-forest-800 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="font-luxury text-4xl text-forest-800">
                {fmt(hasDiscount ? sellingPrice : originalPrice)}
              </span>

              {hasDiscount && (
                <span className="font-sans text-sm text-cream-600 line-through">
                  {fmt(originalPrice)}
                </span>
              )}

              {discount > 0 && (
                <span className="font-sans text-xs bg-forest-700 text-white px-2 py-0.5">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="mb-5 inline-flex w-fit items-center gap-2 border border-cream-300 bg-transparent px-4 py-2">
              <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-cream-700">
                Dimensions
              </span>
              <span className="font-sans text-sm font-medium text-forest-700">
                {getDimensionText(product?.dimensions)}
              </span>
            </div>

            {isOutOfStock && (
              <p className="font-sans text-xs tracking-widest uppercase text-red-600 mb-8">
                Out of stock
              </p>
            )}

            <div className="flex items-center gap-4 mb-3">
              <p className="font-sans text-xs tracking-widest uppercase text-forest-700">
                Quantity
              </p>

              <div
                className={`flex items-center border ${
                  isOutOfStock
                    ? "border-cream-300 opacity-50"
                    : "border-cream-400"
                }`}
              >
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={decreaseQuantity}
                  className="w-9 h-9 flex items-center justify-center text-forest-700 hover:bg-cream-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  -
                </button>

                <span className="w-10 text-center font-sans text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= inventory}
                  onClick={increaseQuantity}
                  className="w-9 h-9 flex items-center justify-center text-forest-700 hover:bg-cream-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <p className="font-sans text-sm text-forest-700 mb-6">
              Planning bulk gifting?{" "}
              <Link href="/contact" className="underline hover:text-forest-500">
                Contact Us
              </Link>{" "}
              and we'll craft a custom pricing plan just for you.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={14} className="mr-2" />
                {isOutOfStock
                  ? "OUT OF STOCK"
                  : addingToCart
                    ? "ADDING..."
                    : "ADD TO CART"}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`btn-outline w-full justify-center ${
                  wishlisted
                    ? "bg-forest-700 text-cream-100 border-forest-700"
                    : ""
                }`}
              >
                <Heart
                  size={14}
                  className={`mr-2 ${wishlisted ? "fill-current" : ""}`}
                />
                {wishlisted ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cream-300">
              {[
                { icon: Shield, label: "SSL Secure" },
                { icon: Award, label: "BIS Hallmarked" },
                { icon: Star, label: "Premium Craft" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} className="text-forest-600" />
                  <span className="font-sans text-[9px] tracking-widest uppercase text-cream-700 text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex border-b border-cream-300 overflow-x-auto">
            {[{ id: "specs", label: "Full Specifications" }].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-sans text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-forest-700 text-forest-700"
                    : "text-cream-700 hover:text-forest-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-luxury text-2xl text-forest-800 mb-6">
                    Masterpiece Details
                  </h3>

                  <table className="w-full">
                    <tbody>
                      {(product.attributes || []).map((attr) => (
                        <tr
                          key={attr._id || attr.key}
                          className="border-b border-cream-200"
                        >
                          <td className="py-3 font-sans text-[10px] tracking-widest uppercase text-cream-700 w-40">
                            {attr.key}
                          </td>
                          <td className="py-3 font-sans text-sm text-forest-700">
                            {attr.value}
                          </td>
                        </tr>
                      ))}

                      {(!product.attributes ||
                        product.attributes.length === 0) && (
                        <tr>
                          <td
                            colSpan={2}
                            className="py-3 font-sans text-sm text-cream-700"
                          >
                            No additional attributes available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-luxury text-2xl text-forest-800 mb-4">
                    The Craftsmanship
                  </h3>
                  <p className="font-sans text-sm text-cream-700 leading-7">
                    {product.description}
                  </p>

                  {product.exchangePolicy && (
                    <div className="mt-6 bg-cream-200 p-5 border-l-2 border-forest-600">
                      <p className="font-sans text-xs font-medium text-forest-700 mb-2">
                        Exchange Policy
                      </p>
                      <p className="font-sans text-sm text-cream-700 leading-6">
                        {product.exchangePolicy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-subheading text-forest-500 mb-2">
                  CURATED FOR YOU
                </p>
                <h2 className="font-luxury text-3xl text-forest-800">
                  Related Treasures
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="w-9 h-9 border border-forest-700 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={scrollNext}
                  className="w-9 h-9 border border-forest-700 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden" ref={relEmbla}>
              <div className="flex gap-6">
                {related.map((p) => (
                  <div
                    key={p._id}
                    className="flex-none w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {viewerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col md:hidden">
          <div className="h-14 px-4 flex items-center justify-between text-white border-b border-white/10">
            <button type="button" onClick={closeMobileViewer}>
              <X size={24} />
            </button>

            <p className="font-sans text-xs tracking-widest uppercase">
              {selectedImage + 1} / {media.length}
            </p>

            {!isCurrentVideo ? (
              <button type="button" onClick={resetZoom}>
                <RotateCcw size={20} />
              </button>
            ) : (
              <span className="w-5" />
            )}
          </div>

          <div className="relative flex-1 overflow-auto flex items-center justify-center bg-[#FAF7F2]">
            <button
              type="button"
              onClick={prevViewerImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center"
            >
              <ChevronLeft size={22} />
            </button>

            {isCurrentVideo ? (
              <MediaVideo src={currentMedia.src} containerClassName="w-full h-full" />
            ) : (
              <img
                src={currentMedia?.src}
                alt={product.name}
                className="max-w-none max-h-none object-contain transition-transform duration-300"
                style={{
                  transform: `scale(${viewerZoom})`,
                  width: "100%",
                  height: "auto",
                }}
              />
            )}

            <button
              type="button"
              onClick={nextViewerImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {!isCurrentVideo && (
            <div className="h-16 px-6 flex items-center justify-center gap-5 border-t border-white/10">
              <button
                type="button"
                onClick={zoomOut}
                className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <ZoomOut size={20} />
              </button>

              <span className="text-white font-sans text-xs">
                {Math.round(viewerZoom * 100)}%
              </span>

              <button
                type="button"
                onClick={zoomIn}
                className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <ZoomIn size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}