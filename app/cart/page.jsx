"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCustomer } from "@/context/CustomerContext";

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

const GUEST_CART_KEY = "elmas_guest_cart";

const getGuestCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const normalizeCartItems = (items = []) => {
  return items.map((item) => ({
    ...item,
    product: item.productSnapshot || item.product || {},
  }));
};

const getProductId = (item) => {
  return item?.product?._id || item?.productId || item?.product;
};

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const {
    customer,
    customerToken,
    customerAuthReady,
    refreshCustomer,
    updateCartItem,
    removeFromCart,
  } = useCustomer();

  useEffect(() => {
    if (!customerAuthReady) return;
    fetchCart();
  }, [customerAuthReady, customerToken, customer?.cart?.length]);

  const fetchCart = async () => {
    setLoading(true);

    try {
      let items = [];

      if (customerToken) {
        const freshCustomer = await refreshCustomer();
        items = freshCustomer?.cart || customer?.cart || [];
      } else {
        items = getGuestCart();
      }

      const normalizedItems = normalizeCartItems(items);

      const total = normalizedItems.reduce((sum, item) => {
        return (
          sum +
          Number(item.product?.selling_price || item.product?.price || 0) *
            Number(item.quantity || 1)
        );
      }, 0);

      setCart({ items: normalizedItems, total });
    } catch (error) {
      toast.error(error?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;
    if (quantity < 1) return;

    try {
      await updateCartItem(productId, { quantity });
      await fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      toast.error(error?.message || "Failed to update cart");
    }
  };

  const removeItem = async (productId) => {
    if (!productId) return;

    try {
      await removeFromCart(productId);
      await fetchCart();
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error?.message || "Failed to remove");
    }
  };

  if (!customerAuthReady) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="font-sans text-sm tracking-widest text-forest-700 uppercase">
          Loading cart...
        </p>
      </div>
    );
  }

  const originalTotal = cart.items.reduce((sum, item) => {
    return (
      sum +
      Number(item.product?.price || item.product?.originalPrice || 0) *
        Number(item.quantity || 1)
    );
  }, 0);

  const savings = originalTotal - cart.total;

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-cream-200 py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="section-subheading text-forest-500 mb-2">
            REVIEWING YOUR CURATED TREASURES
          </p>

          <h1 className="font-luxury text-5xl text-forest-800">
            Your Selection
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-cream-200 h-32" />
            ))}
          </div>
        ) : cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-cream-600 mx-auto mb-4" />

            <h2 className="font-luxury text-3xl text-forest-700 mb-3">
              Your cart is empty
            </h2>

            <p className="font-sans text-sm text-cream-700 mb-8">
              Begin your journey through our curated collections.
            </p>

            <Link href="/shop" className="btn-primary">
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div>
              <h2 className="font-luxury text-2xl text-forest-800 mb-6">
                Atelier Pieces ({cart.items.length})
              </h2>

              <div className="space-y-6">
                {cart.items.map((item) => {
                  const productId = getProductId(item);
                  const product = item.product || {};
                  const productSlug =
                    product?.checkName || product?.slug || productId;

                  const productImage = product?.images?.[0] || "/logo.png";

                  return (
                    <div
                      key={productId}
                      className="flex gap-5 pb-6 border-b border-cream-300"
                    >
                      <Link
                        href={`/products/${productSlug}`}
                        className="flex-shrink-0 w-28 h-28 bg-cream-200 overflow-hidden"
                      >
                        <img
                          src={productImage}
                          alt={product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              href={`/products/${productSlug}`}
                              className="font-luxury text-lg text-forest-800 hover:text-forest-600 transition-colors"
                            >
                              {product?.name || "Product"}
                            </Link>

                            {(product?.metalType || product?.primaryStone) && (
                              <p className="font-sans text-xs text-cream-600 mt-1">
                                {product?.metalType
                                  ?.replace("-", " ")
                                  .toUpperCase()}
                                {product?.metalType && product?.primaryStone
                                  ? ", "
                                  : ""}
                                {product?.primaryStone}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {Number(product?.price || 0) >
                                Number(product?.selling_price || 0) && (
                                <span className="font-sans text-xs text-cream-600 line-through">
                                  {fmt(product?.price)}
                                </span>
                              )}

                              <span className="font-sans text-sm font-medium text-forest-800">
                                {fmt(
                                  product?.selling_price || product?.price || 0,
                                )}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(productId)}
                            className="text-cream-600 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-cream-300">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(productId, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream-200 transition-colors"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="w-8 text-center font-sans text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(productId, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream-200 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-luxury text-xl text-forest-800">
                            {fmt(
                              Number(
                                product?.selling_price || product?.price || 0,
                              ) * Number(item.quantity || 1),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="bg-cream-200 p-6 sticky top-32">
                <h2 className="font-luxury text-2xl text-forest-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 pb-6 border-b border-cream-300">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-cream-700">Original Value</span>
                    <span className="text-forest-800">
                      {fmt(originalTotal)}
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-forest-600">You Save</span>
                      <span className="text-forest-600">- {fmt(savings)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-cream-700">Shipping Charges</span>
                    <span className="text-forest-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline py-4">
                  <span className="font-luxury text-xl text-forest-800">
                    Final Investment
                  </span>

                  <div className="text-right">
                    <span className="font-luxury text-3xl text-forest-800">
                      {fmt(cart.total)}
                    </span>

                    <p className="font-sans text-[10px] text-cream-600 uppercase">
                      Inclusive of all taxes
                    </p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full justify-center text-center block"
                >
                  PROCEED TO CHECKOUT
                </Link>

                {!customerToken && (
                  <p className="font-sans text-xs text-cream-700 mt-4 leading-5">
                    You can checkout as guest. Your order updates and invoice
                    will be sent on WhatsApp.
                  </p>
                )}

                <Link
                  href="/shop"
                  className="block text-center font-sans text-xs text-cream-700 hover:text-forest-700 mt-4 tracking-widest"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}