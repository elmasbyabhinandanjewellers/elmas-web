"use client";

import Link from "next/link";
import { useCollections } from "@/context/CollectionsContext";

const getSlug = (item) => item?.checkName || item?.slug || item?._id;

const getCollectionImage = (collection) => {
  const productImage = collection?.products?.[0]?.images?.[0];

  if (productImage) return productImage;
  if (collection?.bannerImage) return collection.bannerImage;
  if (collection?.image) return collection.image;

  return "/logo.png";
};

export default function FeaturedCollections() {
  const { collections = [], collectionLoading } = useCollections();

  const visibleCollections = collections
    .filter((collection) => collection?.isActive !== false)
    .slice(0, 4);

  if (collectionLoading) {
    return (
      <section className="py-16 bg-cream-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-[320px] bg-cream-300 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-cream-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            CURATED EDITS
          </p>
          <h2 className="section-heading">Shop by Collection</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleCollections.map((collection) => (
            <Link
              key={collection._id}
              href={`/shop?collection=${getSlug(collection)}`}
              className="group relative overflow-hidden h-[320px]"
            >
              <img
                src={getCollectionImage(collection)}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="font-luxury text-xl text-white">
                  {collection.name}
                </p>
                <p className="font-sans text-[10px] tracking-widest text-cream-200 uppercase mt-1">
                  View Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}