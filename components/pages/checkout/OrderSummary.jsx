"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Award, Star, ChevronDown, ChevronUp } from "lucide-react";
import CouponBox from "./CouponBox";

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

export default function OrderSummary({
  cart,
  totals,
  finalAmount,
  deliveryMode,
  processing,
  handlePayment,
  couponProps,
  customerToken,
}) {
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const isGuest = !customerToken;

  const availableCoupons =
    couponProps?.availableCoupons ||
    couponProps?.coupons ||
    couponProps?.eligibleCoupons ||
    [];

  const visibleCoupons = showAllCoupons
    ? availableCoupons
    : availableCoupons.slice(0, 2);

  const hiddenCouponCount = Math.max(availableCoupons.length - 2, 0);

  return (
    <aside>
      <div className="bg-cream-200 p-6 sticky top-32">
        <h2 className="font-luxury text-2xl text-forest-800 mb-6">
          Order Summary
        </h2>

        <div className="space-y-3 pb-5 border-b border-cream-300">
          <SummaryRow
            label="Subtotal"
            value={fmt(totals?.subtotal || cart.total)}
          />

          {totals?.giftMessageCardAmount > 0 && (
            <SummaryRow
              label="Gift Message Card"
              value={fmt(totals.giftMessageCardAmount)}
              highlight
            />
          )}

          {couponProps?.appliedCoupon && (
            <SummaryRow
              label={`${couponProps.appliedCoupon.code} Discount`}
              value={`- ${fmt(
                couponProps.appliedCoupon.discountAmount ||
                  couponProps.appliedCoupon.discount ||
                  0,
              )}`}
              highlight
            />
          )}

          <SummaryRow
            label={
              deliveryMode === "store_collection"
                ? "Collection"
                : "Shipping Charges"
            }
            value={deliveryMode === "store_collection" ? "IN-STORE" : "Free"}
            highlight
          />
        </div>

        <div className="flex justify-between items-baseline py-4 mb-5">
          <span className="font-luxury text-lg text-forest-800">
            Final Investment
          </span>

          <div className="text-right">
            <span className="font-luxury text-3xl text-forest-800">
              {fmt(finalAmount)}
            </span>
            <p className="font-sans text-[9px] text-cream-600 uppercase">
              Inclusive of all taxes
            </p>
          </div>
        </div>

        {isGuest && (
          <div className="mb-5  border border-forest-700/20 bg-white p-4 space-y-3">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-forest-600 mb-2">
                Guest Checkout
              </p>
              <p className="font-sans text-xs text-cream-700 leading-6">
                You can place your order without creating an account. Order
                updates, invoice, and shipment details will be sent on WhatsApp.
              </p>
            </div>

            <div className="border-t border-cream-200 pt-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-forest-600 mb-2">
                Exclusive Member Benefits
              </p>
              <p className="font-sans text-xs text-cream-700 leading-6">
                Join the Elmas family for curated offers, early previews of new
                arrivals, and a seamless shopping experience, crafted just for
                you.
              </p>
            </div>

            <Link
              href="/auth/login?redirect=/checkout"
              className="block text-center border border-forest-700 px-4 py-2.5 font-sans text-[10px] tracking-widest uppercase text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
            >
              Sign In Instead
            </Link>
          </div>
        )}

        {availableCoupons.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-forest-700">
                Available Coupons
              </p>

              <span className="font-sans text-[10px] text-cream-700">
                {availableCoupons.length} available
              </span>
            </div>

            <div className="space-y-2">
              {visibleCoupons.map((coupon) => (
                <AvailableCouponCard
                  key={coupon._id || coupon.code}
                  coupon={coupon}
                  couponProps={couponProps}
                />
              ))}
            </div>

            {hiddenCouponCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllCoupons((prev) => !prev)}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-cream-300 bg-cream-100 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-forest-700 hover:bg-white transition-all"
              >
                {showAllCoupons
                  ? "Show Less Coupons"
                  : `View ${hiddenCouponCount} More Coupons`}

                {showAllCoupons ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            )}
          </div>
        )}

        <CouponBox {...couponProps} />

        <button
          type="button"
          onClick={handlePayment}
          disabled={processing || cart.items.length === 0}
          className="w-full btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {processing
            ? "PROCESSING..."
            : deliveryMode === "store_collection"
              ? "PAY & RESERVE FOR STORE COLLECTION"
              : isGuest
                ? "Continue Guest Payment"
                : "Proceed To Payment"}
        </button>

        <div className="flex items-center justify-center gap-6 mt-5">
          {[
            { icon: Shield, label: "SSL Secure" },
            { icon: Award, label: "BIS Hallmarked" },
            { icon: Star, label: "Premium Craft" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={16} className="text-forest-500" />
              <span className="font-sans text-[8px] tracking-widest uppercase text-cream-700">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AvailableCouponCard({ coupon, couponProps }) {
  const [applying, setApplying] = useState(false);

  const appliedCode =
    couponProps?.appliedCoupon?.code ||
    couponProps?.appliedCoupon?.couponCode ||
    "";

  const isApplied = appliedCode === coupon.code;

  const discountValue = Number(
    coupon.value ?? coupon.discountValue ?? coupon.discount ?? 0,
  );

  const valueType = String(coupon.valueType || "").toLowerCase();

  const discountText =
    valueType === "percentage"
      ? `${discountValue}% OFF`
      : `${fmt(discountValue)} OFF`;

  const handleApply = async () => {
    if (isApplied || applying) return;

    try {
      setApplying(true);

      if (couponProps?.setCouponCode) {
        couponProps.setCouponCode(coupon.code);
      }

      if (couponProps?.applyCoupon) {
        await couponProps.applyCoupon(coupon.code);
        return;
      }

      console.warn(
        "No coupon apply function found in couponProps",
        couponProps,
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-100/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-forest-800">
            {coupon.code}
          </p>

          <p className="mt-1 font-sans text-[11px] text-cream-700">
            {coupon.title || coupon.name || discountText}
          </p>

          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.12em] text-forest-600">
            {discountText}
          </p>
        </div>

        <button
          type="button"
          disabled={isApplied || applying}
          onClick={handleApply}
          className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.14em] transition-all ${
            isApplied
              ? "bg-forest-700 text-cream-100 cursor-default"
              : "bg-white text-forest-700 hover:bg-forest-700 hover:text-cream-100"
          }`}
        >
          {applying ? "Applying" : isApplied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between items-center gap-3 font-sans text-sm">
      <span className={highlight ? "text-forest-600" : "text-cream-700"}>
        {label}
      </span>
      <span className={highlight ? "text-forest-600" : "text-forest-800"}>
        {value}
      </span>
    </div>
  );
}
