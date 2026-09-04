"use client";

import Link from "next/link";
import { Heart, ShoppingBag, User, ChevronDown } from "lucide-react";

export default function MobileMenu({
  mobileOpen,
  mobileExpanded,
  setMobileExpanded,
  menuItems,
  user,
  cartCount,
  wishlistCount,
  setMobileOpen,
}) {
  const closeMenu = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <div
        className={`lg:hidden fixed top-[132px] left-0 bottom-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-cream-200 bg-cream-100 px-6 py-5">
          <p className="font-luxury text-xl text-forest-800">Elmas Menu</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-forest-500">
            Silver idols, purses & gifts
          </p>
        </div>

        <Link
          href="/"
          onClick={closeMenu}
          className="block border-b border-cream-200 px-6 py-4 font-sans text-[11px] uppercase tracking-widest text-forest-800 hover:bg-cream-100"
        >
          Home
        </Link>
        <Link
          href="/shop"
          onClick={closeMenu}
          className="block border-b border-cream-200 px-6 py-4 font-sans text-[11px] uppercase tracking-widest text-forest-800 hover:bg-cream-100"
        >
          All Products
        </Link>

        {menuItems.map((item) => (
          <div key={item.title} className="border-b border-cream-200">
            {item.dropdown ? (
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 font-sans text-[11px] uppercase tracking-widest text-forest-800 hover:bg-cream-100"
                onClick={() =>
                  setMobileExpanded(
                    mobileExpanded === item.title ? null : item.title,
                  )
                }
              >
                {item.title}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    mobileExpanded === item.title ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                onClick={closeMenu}
                className="block px-6 py-4 font-sans text-[11px] uppercase tracking-widest text-forest-800 hover:bg-cream-100"
              >
                {item.title}
              </Link>
            )}

            {item.dropdown && mobileExpanded === item.title && (
              <div className="space-y-4 bg-cream-100 px-6 pb-5 pt-1">
                {item.type === "shop"
                  ? item.dropdown.map((section) => (
                      <div key={section.heading}>
                        <p className="pb-2 pt-4 font-sans text-[9px] uppercase tracking-[0.22em] text-forest-500">
                          {section.heading}
                        </p>

                        <div className="space-y-1">
                          {section.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={closeMenu}
                              className="block rounded-xl px-3 py-2 font-luxury text-base text-forest-700 hover:bg-white hover:text-forest-500"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))
                  : item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2 font-luxury text-base text-forest-700 hover:bg-white hover:text-forest-500"
                      >
                        {sub.title}
                      </Link>
                    ))}
              </div>
            )}
          </div>
        ))}

        <div className="space-y-3 p-6">
          <Link
            href="/wishlist"
            onClick={closeMenu}
            className="flex items-center justify-between rounded-2xl border border-cream-200 bg-cream-100 px-4 py-3 font-sans text-xs uppercase tracking-widest text-forest-800"
          >
            <span className="flex items-center gap-2">
              <Heart size={16} /> Wishlist
            </span>

            {wishlistCount > 0 && (
              <span className="rounded-full bg-forest-700 px-2 py-1 text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href={"/cart"}
            onClick={closeMenu}
            className="flex items-center justify-between rounded-2xl border border-cream-200 bg-cream-100 px-4 py-3 font-sans text-xs uppercase tracking-widest text-forest-800"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={16} /> Cart
            </span>

            {cartCount > 0 && (
              <span className="rounded-full bg-forest-700 px-2 py-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href={user ? "/account/orders" : "/auth/login"}
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-forest-700 px-4 py-3 font-sans text-xs uppercase tracking-widest text-cream-100"
          >
            <User size={16} />
            {user ? "My Account" : "Sign In"}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 top-[132px] z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
