"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function AccountOrdersPage() {
  const router = useRouter();
  const {
    customer,
    customerToken,
    customerAuthReady,
    logoutCustomer,
    refreshCustomer,
  } = useCustomer();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerAuthReady) return;

    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      const freshCustomer = await refreshCustomer();
      const sortedOrders = (
        freshCustomer?.orders ||
        customer?.orders ||
        []
      ).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrders(sortedOrders);
      setLoading(false);
    };

    loadOrders();
  }, [customerAuthReady, customerToken]);

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const fmt = (p) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(p || 0);

  if (!customerAuthReady) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="font-sans text-sm tracking-widest text-forest-700 uppercase">
          Loading orders...
        </p>
      </div>
    );
  }

  if (!customerToken) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <p className="section-subheading text-forest-500 mb-3">
            WELCOME BACK
          </p>
          <h1 className="font-luxury text-4xl md:text-5xl text-forest-800 mb-2">
            My Account
          </h1>
          <p className="font-sans text-sm text-cream-700 break-all">
            {customer?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <AccountSidebar active="orders" onLogout={handleLogout} />

          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-300 p-4 sm:p-6 md:p-8">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-luxury text-3xl text-forest-800">
                    Order History
                  </h2>

                  <p className="font-sans text-sm text-cream-700 mt-1">
                    Track your Elmas purchases and order status.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-cream-600">
                    Total Orders
                  </p>

                  <p className="font-luxury text-3xl text-forest-800 font-bold">
                    {orders.length}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse border border-cream-200 p-5"
                    >
                      <div className="h-4 bg-cream-300 w-1/3 mb-4" />
                      <div className="h-3 bg-cream-300 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={64} className="mx-auto text-cream-300 mb-4" />
                  <p className="font-luxury text-2xl text-forest-800 mb-2">
                    No Orders Yet
                  </p>
                  <p className="font-sans text-sm text-cream-700 mb-6">
                    Start your journey with Elmas. Explore our curated
                    collections.
                  </p>
                  <Link
                    href="/shop"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    EXPLORE COLLECTIONS <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} fmt={fmt} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, fmt }) {
  const [open, setOpen] = useState(false);

  const status = order.orderStatus || order.status || "pending";

  return (
    <div className="border border-cream-300 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left"
      >
        <div>
          <p className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-cream-600 mb-1">
            Order #{order.orderId || order._id?.slice(-8)}
          </p>

          <p className="font-sans text-xs text-cream-600">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <p className="font-luxury text-xl text-forest-800">
            {fmt(order.finalPrice || order.totalAmount)}
          </p>

          <span className="px-3 py-1 font-sans text-[10px] tracking-widest uppercase bg-cream-200 text-cream-700">
            {status.replaceAll("_", " ")}
          </span>

          <ChevronRight
            size={16}
            className={`text-forest-700 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-6 border-t border-cream-200">
          <div className="space-y-3 pt-5">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cream-100 border border-cream-200 flex-shrink-0 overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName || item.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm text-forest-800 line-clamp-1">
                    {item.productName || item.title}
                  </p>
                  <p className="font-sans text-xs text-cream-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-sans text-sm text-forest-800">
                  {fmt(item.finalLineTotal || item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-cream-200 flex justify-end">
            <Link
              href={`/account/orders/${order._id}`}
              className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700 inline-flex items-center gap-1"
            >
              VIEW FULL DETAILS <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountSidebar({ active, onLogout }) {
  const itemClass = (key) =>
    `flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors ${
      active === key
        ? "text-white bg-forest-700"
        : "text-forest-800 hover:bg-cream-100"
    }`;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white border border-cream-300 p-4 sm:p-6 overflow-x-auto lg:overflow-visible">
        <nav className="flex lg:block gap-2 lg:space-y-2 min-w-max lg:min-w-0">
          <Link href="/account/orders" className={itemClass("orders")}>
            <Package size={18} /> <span>My Orders</span>
          </Link>

          <Link href="/wishlist" className={itemClass("wishlist")}>
            <Heart size={18} /> <span>Wishlist</span>
          </Link>

          <Link href="/account/addresses" className={itemClass("addresses")}>
            <MapPin size={18} /> <span>Addresses</span>
          </Link>

          <Link href="/account/profile" className={itemClass("profile")}>
            <User size={18} /> <span>Profile</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex lg:w-full items-center gap-3 px-4 py-3 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
