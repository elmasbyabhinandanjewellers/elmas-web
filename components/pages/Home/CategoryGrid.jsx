"use client";

import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";

const getSlug = (item) => item?.checkName || item?.slug || item?._id;

const getCategoryImage = (category) => {
  const productImage = category?.products?.[0]?.images?.[0];

  if (productImage) return productImage;
  if (category?.bannerImage) return category.bannerImage;
  if (category?.image) return category.image;

  return "/logo.png";
};

export default function CategoryGrid() {
  const { categories = [], categoryLoading } = useCategories();

  const visibleCategories = categories
    .filter((cat) => cat?.isActive !== false)
    .slice(0, 4);

  if (categoryLoading) {
    return (
      <section className="py-16 bg-cream-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[320px] bg-cream-300 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleCategories.map((cat, i) => (
            <Link
              key={cat._id}
              href={`/shop?category=${getSlug(cat)}`}
              className="group relative overflow-hidden"
              style={{ aspectRatio: i === 0 ? "4/5" : "4/5" }}
            >
              <img
                src={getCategoryImage(cat)}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ height: "320px" }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="font-luxury text-xl text-white">{cat.name}</p>
                <p className="font-sans text-[10px] tracking-widest text-cream-200 uppercase mt-1">
                  Explore Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}