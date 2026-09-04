"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";

export default function BestSellers() {
  const { fetchBestSellers } = useProducts();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        setLoading(true);

        const res = await fetchBestSellers({ limit: 20 });
        const items = res?.data || []; 
        const validProducts = Array.isArray(items)
          ? items.filter((product) => Number(product.price) > 0)
          : [];

        setProducts(validProducts);
      } catch (error) {
        console.error("Best sellers fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);



  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-subheading text-forest-500 mb-3">
              CURATED FOR YOU
            </p>
            <h2 className="section-heading">The Best Sellers</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 border border-forest-700 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={scrollNext}
              className="w-10 h-10 border border-forest-700 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-cream-300 h-72 mb-3" />
                <div className="bg-cream-300 h-3 w-3/4 mb-2" />
                <div className="bg-cream-300 h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-none w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
                >
                  <div className="scale-[0.92] origin-top">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-forest-600">
            No best seller products found.
          </p>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="btn-outline inline-flex items-center gap-2"
          >
            VIEW ALL COLLECTIONS <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}