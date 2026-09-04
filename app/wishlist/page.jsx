"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useCustomer } from "@/context/CustomerContext";

export default function WishlistPage() {
  const router = useRouter();

  const {
    customer,
    customerToken,
    customerAuthReady,
    refreshCustomer,
    removeFromWishlist,
    addToCart,
  } = useCustomer();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerAuthReady) return;

    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }

    const loadWishlist = async () => {
      setLoading(true);

      const freshCustomer = await refreshCustomer();
      const list = freshCustomer?.wishlist || customer?.wishlist || [];

      setWishlist(list);
      setLoading(false);
    };

    loadWishlist();
  }, [customerAuthReady, customerToken]);

  const moveToCart = async (productId) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      });

      await removeFromWishlist(productId);

      setWishlist((prev) =>
        prev.filter((product) => product._id !== productId),
      );

      toast.success("Moved to cart");
    } catch (error) {
      toast.error(error?.message || "Failed to move to cart");
    }
  };

if (!customerAuthReady) {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <p className="font-sans text-sm tracking-widest text-forest-700 uppercase">
        Loading wishlist...
      </p>
    </div>
  );
}

if (!customerToken) return null;

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-cream-200 py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="section-subheading text-forest-500 mb-2">
            YOUR CURATED DESIRES
          </p>
          <h1 className="font-luxury text-5xl text-forest-800">
            Your Wishlist
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-cream-200 h-72" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-cream-600 mx-auto mb-4" />
            <h2 className="font-luxury text-3xl text-forest-700 mb-3">
              Your wishlist is empty
            </h2>
            <p className="font-sans text-sm text-cream-700 mb-8">
              Save pieces that speak to your soul.
            </p>
            <Link href="/shop" className="btn-primary">
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-sans text-xs text-cream-600 mb-8">
              {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}{" "}
              saved
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product._id} className="group relative">
                  <ProductCard product={product} />

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCart(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-forest-700 text-cream-100 font-sans text-[10px] tracking-widest uppercase hover:bg-forest-600 transition-colors"
                    >
                      <ShoppingBag size={12} /> MOVE TO CART
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="w-10 flex items-center justify-center border border-cream-400 text-cream-700 hover:border-red-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
