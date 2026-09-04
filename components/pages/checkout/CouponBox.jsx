"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

const getCouponDiscountText = (coupon = {}) => {
  const discountValue = Number(
    coupon.value ?? coupon.discountValue ?? coupon.discount ?? 0
  );

  const valueType = String(coupon.valueType || "").toLowerCase();

  return valueType === "percentage"
    ? `${discountValue}% OFF`
    : `${fmt(discountValue)} OFF`;
};

export default function CouponBox({
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponError,
  applyCoupon,
  removeCoupon,
  availableCoupons = [],
  showCoupons,
  setShowCoupons,
  discountLoading,
}) {
  const handleManualApply = () => {
    applyCoupon();
  };

  const handleDirectApply = async (code) => {
    if (!code) return;

    await applyCoupon(code);
    setShowCoupons(false);
  };

  return (
    <div className="mb-5">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="INVITE CODE"
          onKeyDown={(e) => e.key === "Enter" && handleManualApply()}
          className={`flex-1 border px-3 py-2.5 font-sans text-xs tracking-widest uppercase bg-white focus:outline-none ${
            appliedCoupon
              ? "border-forest-600"
              : "border-cream-400 focus:border-forest-600"
          }`}
        />

        <button
          type="button"
          onClick={handleManualApply}
          disabled={discountLoading}
          className="px-4 font-sans text-xs tracking-widest uppercase bg-forest-700 text-cream-100 hover:bg-forest-600 disabled:opacity-60"
        >
          {discountLoading ? "..." : "APPLY"}
        </button>
      </div>

      {couponError && (
        <p className="font-sans text-xs text-red-600">{couponError}</p>
      )}

      {appliedCoupon && (
        <div className="flex items-center justify-between gap-3">
          <p className="font-sans text-xs text-forest-600">
            ✓ {appliedCoupon.code} applied
            {appliedCoupon.discountAmount || appliedCoupon.discount ? (
              <>
                {" "}
                — Save{" "}
                {fmt(appliedCoupon.discountAmount || appliedCoupon.discount)}
              </>
            ) : null}
          </p>

          <button
            type="button"
            onClick={removeCoupon}
            className="text-red-600 hover:text-red-700 text-xs underline"
          >
            Remove
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowCoupons(!showCoupons)}
        className="flex items-center gap-2 font-sans text-xs text-forest-600 mt-3 hover:text-forest-800"
      >
        View Available Invitations{" "}
        {showCoupons ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {showCoupons && (
        <div className="mt-2 space-y-2">
          {discountLoading ? (
            <div className="bg-white p-3 border border-cream-200 font-sans text-xs text-cream-600">
              Loading available coupons...
            </div>
          ) : availableCoupons.length === 0 ? (
            <div className="bg-white p-3 border border-cream-200 font-sans text-xs text-cream-600">
              No coupons available for this order.
            </div>
          ) : (
            availableCoupons.map((discount) => {
              const code = discount.code || discount.couponCode;
              const desc =
                discount.description ||
                discount.title ||
                discount.name ||
                "Eligible coupon for this order";

              const discountText = getCouponDiscountText(discount);

              const appliedCode =
                appliedCoupon?.code || appliedCoupon?.couponCode || "";

              const isApplied = appliedCode === code;

              return (
                <div
                  key={discount._id || code}
                  className="flex items-center justify-between bg-white p-2 border border-cream-200 gap-3"
                >
                  <div>
                    <code className="font-sans text-xs font-medium text-forest-700">
                      {code}
                    </code>

                    <p className="font-sans text-[10px] text-cream-600">
                      {desc}
                    </p>

                    <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-forest-600 mt-1">
                      {discountText}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={discountLoading || isApplied}
                    onClick={() => handleDirectApply(code)}
                    className={`font-sans text-[10px] uppercase tracking-widest transition-colors ${
                      isApplied
                        ? "text-forest-700 cursor-default"
                        : "text-forest-600 hover:text-forest-800"
                    }`}
                  >
                    {isApplied ? "APPLIED" : "APPLY"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}