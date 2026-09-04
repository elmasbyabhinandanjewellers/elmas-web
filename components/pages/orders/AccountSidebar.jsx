"use client";

import Link from "next/link";
import { Package, Heart, MapPin, User, LogOut } from "lucide-react";

export default function AccountSidebar({ active, onLogout }) {
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