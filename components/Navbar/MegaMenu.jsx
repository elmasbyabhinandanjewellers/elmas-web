"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getItemImage } from "./navbarUtils";

export default function MegaMenu({
  activeMenuData,
  activeMenu,
  setActiveMenu,
  menuImages = [],
}) {
  if (!activeMenuData?.dropdown || !activeMenu) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-white border-t border-cream-300 shadow-2xl z-50"
      onMouseEnter={() => setActiveMenu(activeMenu)}
    >
      <div className="max-w-[1400px] mx-auto px-10 py-6">
        <div className="grid grid-cols-[1fr_1.6fr] gap-12 items-start">
          <div>
            <p className="font-sans text-[9px] tracking-[0.3em] text-forest-500 uppercase mb-1">
              {activeMenuData.badge}
            </p>

            <h2 className="font-luxury text-3xl text-forest-800 mb-2 leading-tight">
              {activeMenuData.title}
            </h2>

            <p className="font-sans text-xs text-cream-500 leading-relaxed mb-4 max-w-sm">
              {activeMenuData.description}
            </p>

            {activeMenuData.type === "shop" ? (
              <div className="grid grid-cols-2 gap-6">
                {activeMenuData.dropdown.map((section) => (
                  <div key={section.heading}>
                    <p className="font-sans text-[9px] tracking-[0.25em] text-forest-500 uppercase mb-2">
                      {section.heading}
                    </p>

                    <div className="space-y-0">
                      {section.items.slice(0, 6).map((sub) => (
                        <MenuLink
                          key={sub.href}
                          item={sub}
                          setActiveMenu={setActiveMenu}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-0">
                {activeMenuData.dropdown.map((sub) => (
                  <MenuLink
                    key={sub.href}
                    item={sub}
                    setActiveMenu={setActiveMenu}
                    showSubtitle
                  />
                ))}
              </div>
            )}

            <Link
              href={activeMenuData.href}
              onClick={() => setActiveMenu(null)}
              className="btn-primary inline-flex mt-4 text-[10px] py-2 px-4"
            >
              EXPLORE {activeMenuData.title.toUpperCase()}
            </Link>
          </div>

          {/* IMAGE GRID — 3 images, exact layout from old Navbar.jsx */}
          <div
            className="grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-2"
            style={{ height: "300px" }}
          >
            {[0, 1, 2].map((index) => {
              const item = menuImages[index];

              if (!item) {
                return (
                  <div
                    key={`empty-${index}`}
                    className={`bg-cream-100 ${index === 0 ? "row-span-2" : ""}`}
                  />
                );
              }

              const image = item.image || getItemImage(item);
              const label = item?.name || item?.title || "Elmas Collection";
              const href = item?.href || "#";

              return (
                <div
                  key={`${label}-${index}`}
                  className={`overflow-hidden group cursor-pointer relative ${
                    index === 0 ? "row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative w-full h-full overflow-hidden bg-cream-100 ${
                      index === 0 ? "translate-y-2" : ""
                    }`}
                  >
                    <Link href={href} className="block w-full h-full">
                      <Image
                        src={image}
                        alt={label}
                        fill
                        unoptimized
                        sizes="(max-width: 2400px) 100vw,"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "";
                        }}
                      />
                    </Link>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 z-10">
                      <p className="font-sans text-[9px] tracking-widest text-white uppercase">
                        {label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ item, setActiveMenu, showSubtitle = false }) {
  return (
    <Link
      href={item.href}
      onClick={() => setActiveMenu(null)}
      className="group flex items-center justify-between py-2 border-b border-cream-200 hover:border-forest-500 transition-colors"
    >
      <div>
        <span className="font-luxury text-[15px] text-forest-800 group-hover:text-forest-600 transition-colors block leading-tight">
          {item.title}
        </span>

        {showSubtitle && item.subtitle && (
          <span className="font-sans text-[10px] text-cream-400 group-hover:text-forest-400 transition-colors">
            {item.subtitle}
          </span>
        )}
      </div>

      <ArrowRight
        size={12}
        className="text-cream-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all duration-200"
      />
    </Link>
  );
}
