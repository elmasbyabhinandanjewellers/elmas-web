"use client";

import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products = [], loading, clearFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-cream-300 h-72 mb-3" />
            <div className="bg-cream-300 h-3 w-3/4 mb-2" />
            <div className="bg-cream-300 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-luxury text-2xl text-forest-700 mb-3">
          No pieces found
        </p>
        <p className="font-sans text-sm text-cream-700 mb-6">
          Try adjusting your filters to discover more treasures.
        </p>
        <button onClick={clearFilters} className="btn-primary">
          CLEAR FILTERS
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}