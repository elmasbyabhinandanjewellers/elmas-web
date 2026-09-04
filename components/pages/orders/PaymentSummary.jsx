"use client";

import { fmt } from "@/components/pages/orders/pdfHelpers";

export default function PaymentSummary({ totals }) {
  if (!totals?.length) return null;

  return (
    <section className="border border-cream-300 p-5">
      <h2 className="font-luxury text-3xl text-forest-800 mb-5">
        Payment Summary
      </h2>
      <div className="space-y-3">
        {totals.map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-4 ${
              index === totals.length - 1
                ? "pt-3 border-t border-cream-200"
                : ""
            }`}
          >
            <span
              className={`font-sans ${
                index === totals.length - 1
                  ? "text-sm font-medium text-forest-800"
                  : "text-sm text-cream-700"
              }`}
            >
              {label}
            </span>
            <span
              className={`font-sans ${
                index === totals.length - 1
                  ? "text-base font-semibold text-forest-800"
                  : "text-sm text-forest-700"
              }`}
            >
              {fmt(value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}