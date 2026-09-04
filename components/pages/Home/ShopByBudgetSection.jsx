"use client";

import Link from "next/link";
import Image from "next/image";

const priceCards = [
  {
    title: "Under ₹6K",
    image:
      "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413228/WhatsApp_Image_2026-09-03_at_10.54.22.jpg",
    href: "/shop?maxPrice=6000&limit=100",
  },
  {
    title: "Under ₹15K",
    image:
      "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413228/WhatsApp_Image_2026-09-03_at_10.54.16.jpg",
    href: "/shop?maxPrice=15000&limit=100",
  },
  {
    title: "Under ₹25K",
    image:
      "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413228/WhatsApp_Image_2026-09-03_at_10.54.09.jpg",
    href: "/shop?maxPrice=25000&limit=100",
  },
  {
    title: "Under ₹30K",
    image:
      "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413227/WhatsApp_Image_2026-09-03_at_10.54.05.jpg",
    href: "/shop?minPrice=30000&limit=100",
  },
];

export default function ShopByBudgetSection() {
  return (
    <section className="py-12 md:py-16 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            SHOP BY BUDGET
          </p>

          <h2 className="font-luxury text-3xl md:text-5xl text-forest-800">
            Find Pieces Within Your Budget
          </h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {priceCards.map((item) => (
            <BudgetCard key={item.title} item={item} />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden -mx-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {priceCards.map((item) => (
              <div key={item.title} className="w-[220px] flex-shrink-0">
                <BudgetCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetCard({ item }) {
  return (
    <Link href={item.href} className="group block">
      <div className="relative aspect-square">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}