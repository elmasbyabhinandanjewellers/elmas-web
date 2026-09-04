"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="text-center py-16">
      <Package size={64} className="mx-auto text-cream-300 mb-4" />
      <p className="font-luxury text-2xl text-forest-800 mb-2">
        Order Not Found
      </p>
      <Link href="/account/orders" className="btn-primary">
        BACK TO ORDERS
      </Link>
    </div>
  );
}