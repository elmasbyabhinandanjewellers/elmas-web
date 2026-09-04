"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { useCollections } from "@/context/CollectionsContext";

import ShopHeader from "@/components/pages/Shop/ShopHeader";
import ShopToolbar from "@/components/pages/Shop/ShopToolbar";
import ShopFilters from "@/components/pages/Shop/ShopFilters";
import ProductGrid from "@/components/pages/Shop/ProductGrid";

const MAX_PRICE = 2000000;

function ShopPageContent() {
  const searchParams = useSearchParams();

  const { products, productLoading, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const { collections } = useCollections();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    category: "",
    collection: "",
    search: "",
    minPrice: 0,
    maxPrice: MAX_PRICE,
    limit: 100,
  });

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const collection = searchParams.get("collection") || "";
    const search = searchParams.get("search") || "";

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const limitParam = searchParams.get("limit");

    setFilters((prev) => ({
      ...prev,
      category,
      collection,
      search,
      minPrice: minPriceParam ? Number(minPriceParam) : 0,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : MAX_PRICE,
      limit: limitParam ? Number(limitParam) : 100,
    }));
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        isActive: true,
        limit: filters.limit || 100,
        sort,
      };

      if (filters.category) params.category = filters.category;
      if (filters.collection) params.collection = filters.collection;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice > 0) params.minPrice = filters.minPrice;
      if (filters.maxPrice < MAX_PRICE) params.maxPrice = filters.maxPrice;

      fetchProducts(params);
    }, 350);

    return () => clearTimeout(timer);
  }, [filters, sort]);

  const clearFilters = () => {
    setFilters({
      category: "",
      collection: "",
      search: "",
      minPrice: 0,
      maxPrice: MAX_PRICE,
      limit: 100,
    });

    setSort("newest");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.category) count += 1;
    if (filters.collection) count += 1;
    if (filters.search) count += 1;
    if (filters.minPrice > 0 || filters.maxPrice < MAX_PRICE) count += 1;

    return count;
  }, [filters]);

  return (
    <div className="bg-cream-100 min-h-screen">
      <ShopHeader />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        {filters.search && (
          <div className="mb-6 rounded-2xl border border-cream-300 bg-white px-5 py-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-forest-500">
              Search Results
            </p>
            <h2 className="mt-1 font-luxury text-2xl text-forest-800">
              Showing products for “{filters.search}”
            </h2>
          </div>
        )}

        <ShopToolbar
          total={products.length}
          sort={sort}
          setSort={setSort}
          activeFilterCount={activeFilterCount}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ShopFilters
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
              categories={categories}
              collections={collections}
            />
          </aside>

          <div className="flex-1 relative">
            {productLoading && products.length > 0 && (
              <div className="absolute inset-0 z-10 bg-cream-100/60 backdrop-blur-[1px] flex items-start justify-center pt-20">
                <div className="bg-white border border-cream-300 px-5 py-3 font-sans text-xs tracking-widest uppercase text-forest-700">
                  Updating pieces...
                </div>
              </div>
            )}

            <ProductGrid
              products={products}
              loading={productLoading && products.length === 0}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="bg-black/30 flex-1"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="bg-white w-80 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="font-luxury text-xl text-forest-800">Filters</p>
              <button type="button" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <ShopFilters
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
              categories={categories}
              collections={collections}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-100 flex items-center justify-center">
          <p className="font-sans text-xs tracking-widest uppercase text-forest-700">
            Loading collection...
          </p>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}