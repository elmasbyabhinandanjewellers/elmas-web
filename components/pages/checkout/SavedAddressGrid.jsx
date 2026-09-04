"use client";

import Link from "next/link";
import { CheckCircle, Pencil } from "lucide-react";

export default function SavedAddressGrid({
  addresses = [],
  selectedId,
  onSelect,
  type = "shipping",
}) {
  if (!addresses.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {addresses.map((address) => {
        const active = selectedId === address._id;

        return (
          <button
            key={address._id}
            type="button"
            onClick={() => onSelect(address)}
            className={`relative text-left border p-5 transition-all duration-300 ${
              active
                ? "border-forest-700 bg-cream-200"
                : "border-cream-300 hover:border-forest-400 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-forest-500">
                  {type} address
                </span>

                {address.isDefault && (
                  <span className="bg-forest-700 text-white text-[9px] px-2 py-1 tracking-[0.15em] uppercase">
                    Default
                  </span>
                )}
              </div>

              {active && (
                <CheckCircle
                  size={20}
                  className="text-forest-700 shrink-0"
                />
              )}
            </div>

            <div>
              <p className="font-sans text-sm font-medium text-forest-800">
                {address.fullName}
              </p>

              <p className="font-sans text-xs text-cream-700 mt-2 leading-6">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} {address.postalCode}
              </p>

              <p className="font-sans text-xs text-cream-700 mt-2">
                {address.mobile}
              </p>
            </div>

            <div className="flex justify-end mt-5 pt-4 border-t border-cream-200">
              <Link
                href={`/account/addresses?edit=${address._id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-forest-700 hover:text-forest-800 font-sans text-[10px] tracking-[0.15em] uppercase"
              >
                <Pencil size={12} />
                Edit
              </Link>
            </div>
          </button>
        );
      })}
    </div>
  );
}