"use client";

import { fmt } from "@/components/pages/orders/pdfHelpers";

export default function OrderItems({ items }) {
  if (!items?.length) return null;

  return (
    <section>
      <h2 className="font-luxury text-3xl text-forest-800 mb-5">Items</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-cream-200 p-4 flex gap-4"
          >
            <div className="w-20 h-20 bg-cream-100 border border-cream-200 flex-shrink-0 overflow-hidden">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-forest-800 line-clamp-2">
                {item.productName || item.title}
              </p>
              <p className="font-sans text-xs text-cream-600 mt-1">
                Qty: {item.quantity}
              </p>
              <p className="font-sans text-xs text-cream-600">
                Unit: {fmt(item.unitPrice)}
              </p>
            </div>
            <p className="font-sans text-sm font-medium text-forest-800">
              {fmt(item.finalLineTotal || item.subtotal)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}