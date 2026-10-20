// // "use client";

// // import Link from "next/link";
// // import { X } from "lucide-react";

// // const MAX_PRICE = 2000000;

// // const getSlug = (item) => item?.checkName || item?.slug || item?._id;

// // const formatPriceLabel = (value) => {
// //   if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
// //   return `₹${value.toLocaleString("en-IN")}`;
// // };

// // export default function ShopFilters({
// //   filters,
// //   setFilters,
// //   clearFilters,
// //   activeFilterCount,
// //   categories = [],
// //   collections = [],
// // }) {
// //   const selectedCategory = filters.category;
// //   const selectedCollection = filters.collection;

// //   return (
// //     <div className="w-full">
// //       <div className="flex items-center justify-between mb-8">
// //         <h3 className="font-sans text-xs tracking-widest uppercase text-forest-800">
// //           Filters
// //         </h3>

// //         {activeFilterCount > 0 && (
// //           <button
// //             onClick={clearFilters}
// //             className="font-sans text-xs text-forest-600 underline"
// //           >
// //             Clear All ({activeFilterCount})
// //           </button>
// //         )}
// //       </div>

// //       <div className="mb-8">
// //         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
// //           Collection
// //         </p>

// //         {collections.map((collection) => {
// //           const slug = getSlug(collection);

// //           return (
// //             <button
// //               key={collection._id || slug}
// //               onClick={() =>
// //                 setFilters((prev) => ({
// //                   ...prev,
// //                   collection: selectedCollection === slug ? "" : slug,
// //                 }))
// //               }
// //               className={`block w-full text-left font-sans text-sm py-2 border-b border-cream-200 transition-colors ${
// //                 selectedCollection === slug
// //                   ? "text-forest-700 font-medium"
// //                   : "text-cream-700 hover:text-forest-700"
// //               }`}
// //             >
// //               {collection.name}
// //             </button>
// //           );
// //         })}
// //       </div>

// //       <div className="mb-8">
// //         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
// //           Category
// //         </p>

// //         {categories.map((category) => {
// //           const slug = getSlug(category);
// //           const active = selectedCategory === slug;

// //           return (
// //             <label
// //               key={category._id || slug}
// //               onClick={() =>
// //                 setFilters((prev) => ({
// //                   ...prev,
// //                   category: active ? "" : slug,
// //                 }))
// //               }
// //               className="flex items-center gap-3 py-2 cursor-pointer group"
// //             >
// //               <div
// //                 className={`w-4 h-4 border flex items-center justify-center transition-colors ${
// //                   active
// //                     ? "bg-forest-700 border-forest-700"
// //                     : "border-cream-400 group-hover:border-forest-500"
// //                 }`}
// //               >
// //                 {active && <X size={10} className="text-white" />}
// //               </div>

// //               <span className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors">
// //                 {category.name}
// //               </span>
// //             </label>
// //           );
// //         })}
// //       </div>

// //       <div className="mb-8">
// //         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
// //           Price Range
// //         </p>

// //         <div className="space-y-4">
// //           <div className="relative pt-1">
// //             <input
// //               type="range"
// //               min={0}
// //               max={MAX_PRICE}
// //               step={25000}
// //               value={filters.maxPrice}
// //               onChange={(e) =>
// //                 setFilters((prev) => ({
// //                   ...prev,
// //                   maxPrice: Number(e.target.value),
// //                 }))
// //               }
// //               className="w-full h-px bg-forest-700 appearance-none cursor-pointer accent-forest-700"
// //             />
// //           </div>

// //           <div className="flex items-center justify-between font-sans text-xs text-cream-700">
// //             <span>₹0</span>
// //             <span className="text-forest-700 font-medium">
// //               {formatPriceLabel(filters.maxPrice)}
// //               {filters.maxPrice >= MAX_PRICE ? "+" : ""}
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="bg-cream-200 p-5">
// //         <p className="font-luxury text-base text-forest-800 mb-2">
// //           Bespoke Offer
// //         </p>
// //         <p className="font-sans text-xs text-cream-700 mb-4">
// //           Enjoy a complimentary private viewing for premium handcrafted orders.
// //         </p>
// //         <Link
// //           href="/contact"
// //           className="font-sans text-[10px] tracking-widest uppercase text-forest-700 underline"
// //         >
// //           ENQUIRE NOW
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import { X } from "lucide-react";

// const MAX_PRICE = 2000000;

// const getSlug = (item) => item?.checkName || item?.slug || item?._id;

// const formatPriceLabel = (value) => {
//   if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
//   return `₹${value.toLocaleString("en-IN")}`;
// };

// export default function ShopFilters({
//   filters,
//   setFilters,
//   clearFilters,
//   activeFilterCount,
//   categories = [],
//   collections = [],
// }) {
//   const selectedCategory = filters.category;
//   const selectedCollection = filters.collection;

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-8">
//         <h3 className="font-sans text-xs tracking-widest uppercase text-forest-800">
//           Filters
//         </h3>

//         {activeFilterCount > 0 && (
//           <button
//             onClick={clearFilters}
//             className="font-sans text-xs text-forest-600 underline"
//           >
//             Clear All ({activeFilterCount})
//           </button>
//         )}
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Collection
//         </p>

//         <div className="max-h-60 overflow-y-auto pr-2 custom-thin-scroll">
//         {collections.map((collection) => {
//           const slug = getSlug(collection);

//           return (
//             <button
//               key={collection._id || slug}
//               onClick={() =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   collection: selectedCollection === slug ? "" : slug,
//                 }))
//               }
//               className={`block w-full text-left font-sans text-sm py-2 border-b border-cream-200 transition-colors ${
//                 selectedCollection === slug
//                   ? "text-forest-700 font-medium"
//                   : "text-cream-700 hover:text-forest-700"
//               }`}
//             >
//               {collection.name}
//             </button>
//           );
//         })}
//         </div>
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Category
//         </p>

//         <div className="max-h-60 overflow-y-auto pr-2 custom-thin-scroll">
//         {categories.map((category) => {
//           const slug = getSlug(category);
//           const active = selectedCategory === slug;

//           return (
//             <label
//               key={category._id || slug}
//               onClick={() =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   category: active ? "" : slug,
//                 }))
//               }
//               className="flex items-center gap-3 py-2 cursor-pointer group"
//             >
//               <div
//                 className={`w-4 h-4 border flex items-center justify-center transition-colors ${
//                   active
//                     ? "bg-forest-700 border-forest-700"
//                     : "border-cream-400 group-hover:border-forest-500"
//                 }`}
//               >
//                 {active && <X size={10} className="text-white" />}
//               </div>

//               <span className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors">
//                 {category.name}
//               </span>
//             </label>
//           );
//         })}
//         </div>
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Price Range
//         </p>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="font-sans text-[9px] tracking-widest uppercase text-cream-600 block mb-2">
//                 Min
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 max={MAX_PRICE}
//                 value={filters.minPrice}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     minPrice: Math.max(0, Number(e.target.value || 0)),
//                   }))
//                 }
//                 className="w-full border border-cream-300 bg-white px-3 py-2 font-sans text-xs text-forest-800 focus:outline-none focus:border-forest-600"
//               />
//             </div>

//             <div>
//               <label className="font-sans text-[9px] tracking-widest uppercase text-cream-600 block mb-2">
//                 Max
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 max={MAX_PRICE}
//                 value={filters.maxPrice}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     maxPrice: Math.min(
//                       MAX_PRICE,
//                       Number(e.target.value || MAX_PRICE),
//                     ),
//                   }))
//                 }
//                 className="w-full border border-cream-300 bg-white px-3 py-2 font-sans text-xs text-forest-800 focus:outline-none focus:border-forest-600"
//               />
//             </div>
//           </div>

//           <div className="relative pt-1">
//             <input
//               type="range"
//               min={0}
//               max={MAX_PRICE}
//               step={25000}
//               value={filters.maxPrice}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   maxPrice: Number(e.target.value),
//                 }))
//               }
//               className="w-full h-px bg-forest-700 appearance-none cursor-pointer accent-forest-700"
//             />
//           </div>

//           <div className="flex items-center justify-between font-sans text-xs text-cream-700">
//             <span>{formatPriceLabel(filters.minPrice)}</span>
//             <span className="text-forest-700 font-medium">
//               {formatPriceLabel(filters.maxPrice)}
//               {filters.maxPrice >= MAX_PRICE ? "+" : ""}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-cream-200 p-5">
//         <p className="font-luxury text-base text-forest-800 mb-2">
//           Bespoke Offer
//         </p>
//         <p className="font-sans text-xs text-cream-700 mb-4">
//           Enjoy a complimentary private viewing for premium handcrafted orders.
//         </p>
//         <Link
//           href="/contact"
//           className="font-sans text-[10px] tracking-widest uppercase text-forest-700 underline"
//         >
//           ENQUIRE NOW
//         </Link>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { X } from "lucide-react";

// const MAX_PRICE = 2000000;

// const getSlug = (item) => item?.checkName || item?.slug || item?._id;

// const formatPriceLabel = (value) => {
//   if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
//   return `₹${value.toLocaleString("en-IN")}`;
// };

// export default function ShopFilters({
//   filters,
//   setFilters,
//   clearFilters,
//   activeFilterCount,
//   categories = [],
//   collections = [],
// }) {
//   const selectedCategory = filters.category;
//   const selectedCollection = filters.collection;

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-8">
//         <h3 className="font-sans text-xs tracking-widest uppercase text-forest-800">
//           Filters
//         </h3>

//         {activeFilterCount > 0 && (
//           <button
//             onClick={clearFilters}
//             className="font-sans text-xs text-forest-600 underline"
//           >
//             Clear All ({activeFilterCount})
//           </button>
//         )}
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Collection
//         </p>

//         {collections.map((collection) => {
//           const slug = getSlug(collection);

//           return (
//             <button
//               key={collection._id || slug}
//               onClick={() =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   collection: selectedCollection === slug ? "" : slug,
//                 }))
//               }
//               className={`block w-full text-left font-sans text-sm py-2 border-b border-cream-200 transition-colors ${
//                 selectedCollection === slug
//                   ? "text-forest-700 font-medium"
//                   : "text-cream-700 hover:text-forest-700"
//               }`}
//             >
//               {collection.name}
//             </button>
//           );
//         })}
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Category
//         </p>

//         {categories.map((category) => {
//           const slug = getSlug(category);
//           const active = selectedCategory === slug;

//           return (
//             <label
//               key={category._id || slug}
//               onClick={() =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   category: active ? "" : slug,
//                 }))
//               }
//               className="flex items-center gap-3 py-2 cursor-pointer group"
//             >
//               <div
//                 className={`w-4 h-4 border flex items-center justify-center transition-colors ${
//                   active
//                     ? "bg-forest-700 border-forest-700"
//                     : "border-cream-400 group-hover:border-forest-500"
//                 }`}
//               >
//                 {active && <X size={10} className="text-white" />}
//               </div>

//               <span className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors">
//                 {category.name}
//               </span>
//             </label>
//           );
//         })}
//       </div>

//       <div className="mb-8">
//         <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
//           Price Range
//         </p>

//         <div className="space-y-4">
//           <div className="relative pt-1">
//             <input
//               type="range"
//               min={0}
//               max={MAX_PRICE}
//               step={25000}
//               value={filters.maxPrice}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   maxPrice: Number(e.target.value),
//                 }))
//               }
//               className="w-full h-px bg-forest-700 appearance-none cursor-pointer accent-forest-700"
//             />
//           </div>

//           <div className="flex items-center justify-between font-sans text-xs text-cream-700">
//             <span>₹0</span>
//             <span className="text-forest-700 font-medium">
//               {formatPriceLabel(filters.maxPrice)}
//               {filters.maxPrice >= MAX_PRICE ? "+" : ""}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-cream-200 p-5">
//         <p className="font-luxury text-base text-forest-800 mb-2">
//           Bespoke Offer
//         </p>
//         <p className="font-sans text-xs text-cream-700 mb-4">
//           Enjoy a complimentary private viewing for premium handcrafted orders.
//         </p>
//         <Link
//           href="/contact"
//           className="font-sans text-[10px] tracking-widest uppercase text-forest-700 underline"
//         >
//           ENQUIRE NOW
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { X } from "lucide-react";

const MAX_PRICE = 2000000;

const getSlug = (item) => item?.checkName || item?.slug || item?._id;

const formatPriceLabel = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
};

export default function ShopFilters({
  filters,
  setFilters,
  applyFilters,
  clearFilters,
  activeFilterCount,
  categories = [],
  collections = [],
}) {
  const selectedCategory = filters.category;
  const selectedCollection = filters.collection;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-sans text-xs tracking-widest uppercase text-forest-800">
          Filters
        </h3>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="font-sans text-xs text-forest-600 underline"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
          Category
        </p>

        {/* <div className="max-h-60 overflow-y-auto pr-2 custom-thin-scroll"> */}
        {categories.map((category) => {
          const slug = getSlug(category);
          const active = selectedCategory === slug;

          return (
            <label
              key={category._id || slug}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: active ? "" : slug,
                }))
              }
              className="flex items-center gap-3 py-2 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                  active
                    ? "bg-forest-700 border-forest-700"
                    : "border-cream-400 group-hover:border-forest-500"
                }`}
              >
                {active && <X size={10} className="text-white" />}
              </div>

              <span className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors">
                {category.name}
              </span>
            </label>
          );
        })}
        {/* </di    v>   */}
      </div>

      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
          Collection
        </p>

        {/* <div className="max-h-60 overflow-y-auto pr-2 custom-thin-scroll"> */}
        {collections.map((collection) => {
          const slug = getSlug(collection);

          return (
            <button
              key={collection._id || slug}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  collection: selectedCollection === slug ? "" : slug,
                }))
              }
              className={`block w-full text-left font-sans text-sm py-2 border-b border-cream-200 transition-colors ${
                selectedCollection === slug
                  ? "text-forest-700 font-medium"
                  : "text-cream-700 hover:text-forest-700"
              }`}
            >
              {collection.name}
            </button>
          );
        })}
        {/* </div> */}
      </div>

      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-4">
          Price Range
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-[9px] tracking-widest uppercase text-cream-600 block mb-2">
                Min
              </label>
              <input
                type="number"
                min={0}
                max={MAX_PRICE}
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: Math.max(0, Number(e.target.value || 0)),
                  }))
                }
                className="w-full border border-cream-300 bg-white px-3 py-2 font-sans text-xs text-forest-800 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="font-sans text-[9px] tracking-widest uppercase text-cream-600 block mb-2">
                Max
              </label>
              <input
                type="number"
                min={0}
                max={MAX_PRICE}
                value={filters.maxPrice ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setFilters((prev) => ({
                    ...prev,
                    maxPrice:
                      value === "" ? "" : Math.min(MAX_PRICE, Number(value)),
                  }));
                }}
                onBlur={() => {
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice:
                      prev.maxPrice === "" ? MAX_PRICE : Number(prev.maxPrice),
                  }));
                }}
                className="w-full border border-cream-300 bg-white px-3 py-2 font-sans text-xs text-forest-800 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={25000}
              value={filters.maxPrice || MAX_PRICE}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              className="w-full h-px bg-forest-700 appearance-none cursor-pointer accent-forest-700"
            />
          </div>

          <div className="flex items-center justify-between font-sans text-xs text-cream-700">
            <span>{formatPriceLabel(Number(filters.minPrice || 0))}</span>
            <span className="text-forest-700 font-medium">
              {formatPriceLabel(Number(filters.maxPrice || 0))}
              {Number(filters.maxPrice || 0) >= MAX_PRICE ? "+" : ""}
            </span>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="btn-primary w-full mt-2"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="bg-cream-200 p-5">
        <p className="font-luxury text-base text-forest-800 mb-2">
          Bespoke Offer
        </p>
        <p className="font-sans text-xs text-cream-700 mb-4">
          Enjoy a complimentary private viewing for premium handcrafted orders.
        </p>
        <Link
          href="/contact"
          className="font-sans text-[10px] tracking-widest uppercase text-forest-700 underline"
        >
          ENQUIRE NOW
        </Link>
      </div>
    </div>
  );
}
