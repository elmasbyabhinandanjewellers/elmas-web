"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { customer, addToCart, addToWishlist, removeFromWishlist } =
    useCustomer();

  const router = useRouter();

  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images.slice(0, 3);
    }

    if (product?.image) return [product.image];

    return ["/logo.png"];
  }, [product]);

  useEffect(() => {
    if (!hovered || images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 900);

    return () => clearInterval(timer);
  }, [hovered, images.length]);

  useEffect(() => {
    const wishlist = customer?.wishlist || [];

    const exists = wishlist.some((item) => {
      const id = item?._id || item?.product || item;
      return id?.toString() === product?._id?.toString();
    });

    setWishlisted(exists);
  }, [customer, product?._id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const getSlug = () => product?.checkName || product?.slug || product?._id;

  const redirectToLogin = () => {
    toast.error("Please login first");
    router.push("/auth/login");
  };

  const handleAuthError = (error, fallbackMessage) => {
    const message =
      error?.message ||
      error?.response?.data?.message ||
      fallbackMessage ||
      "Something went wrong";

    if (
      message === "Please login first" ||
      error?.response?.status === 401 ||
      message.toLowerCase().includes("unauthorized")
    ) {
      redirectToLogin();
      return;
    }

    toast.error(message);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!customer?._id) {
      redirectToLogin();
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
      handleAuthError(error, "Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingToCart(true);

      await addToCart({
        productId: product._id,
        quantity: 1,
        productSnapshot: product,
      });

      toast.success("Added to cart");
    } catch (error) {
      handleAuthError(error, "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Link href={`/products/${getSlug()}`} className="group block">
      <div
        className="relative overflow-hidden bg-cream-200 aspect-square"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setActiveImage(0);
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={product?.name || "Product"}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-in-out group-hover:scale-[1.03] ${
              activeImage === index
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  activeImage === index
                    ? "w-5 h-1.5 bg-forest-700"
                    : "w-1.5 h-1.5 bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            type="button"
            onClick={handleWishlist}
            className={`w-9 h-9 flex items-center justify-center bg-white shadow-md hover:bg-forest-700 hover:text-white transition-colors ${
              wishlisted ? "bg-forest-700 text-white" : "text-forest-700"
            }`}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-9 h-9 flex items-center justify-center bg-white shadow-md hover:bg-forest-700 hover:text-white transition-colors text-forest-700 disabled:opacity-60"
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        {product?.originalPrice > product?.price && (
          <div className="absolute top-3 left-3 bg-forest-700 text-cream-100 text-[9px] font-sans tracking-widest px-2 py-1 z-20">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%
            OFF
          </div>
        )}

        {product?.isNewArrival && (
          <div className="absolute top-3 left-3 bg-gold-500 text-white text-[9px] font-sans tracking-widest px-2 py-1 z-20">
            NEW
          </div>
        )}
      </div>

      <div className="pt-3 pb-1">
        <p className="font-sans text-[9px] tracking-widest uppercase text-forest-600 mb-1">
          {product?.collections?.[0]?.name ||
            product?.categories?.[0]?.name ||
            "ELMAS"}
        </p>

        <h3 className="font-luxury text-base text-forest-800 group-hover:text-forest-600 transition-colors leading-tight line-clamp-1">
          {product?.name}
        </h3>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-sans text-xs text-forest-600 line-through">
            {formatPrice(product?.price)}
          </span>

          <span className="font-sans text-sm font-medium text-forest-800">
            {formatPrice(product?.selling_price)}
          </span>
        </div>
      </div>
    </Link>
  );
}