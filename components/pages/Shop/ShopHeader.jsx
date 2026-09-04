"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShopHeader() {
  return (
    <div className="bg-cream-200 py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-2 font-sans text-xs text-cream-700 mb-4">
          <Link href="/" className="hover:text-forest-700">
            HOME
          </Link>
          <ChevronRight size={12} />
          <span className="text-forest-700">COLLECTIONS</span>
        </div>

        <h1 className="font-luxury text-4xl md:text-5xl text-forest-800 mb-3">
          The Signature Artifacts
        </h1>

        <p className="font-sans text-sm text-cream-700 max-w-xl">
          Hand-crafted masterworks where heritage meets contemporary precision.
          Explore our curated selection of fine jewelry.
        </p>
      </div>
    </div>
  );
}