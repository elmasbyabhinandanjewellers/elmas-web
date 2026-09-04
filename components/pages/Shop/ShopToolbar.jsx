"use client";

import { SlidersHorizontal } from "lucide-react";

export default function ShopToolbar({
  total,
  sort,
  setSort,
  activeFilterCount,
  setSidebarOpen,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <p className="font-sans text-xs text-cream-600">{total} pieces</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-forest-700"
        >
          <SlidersHorizontal size={14} /> FILTERS{" "}
          {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-cream-700 hidden sm:block">
            SORT BY:
          </span>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="font-sans text-xs bg-transparent border border-cream-300 px-3 py-2 text-forest-800 focus:outline-none focus:border-forest-600"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}