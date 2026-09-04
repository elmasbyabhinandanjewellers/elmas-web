"use client";

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

const getProductId = (item) => item?.product?._id || item?.product;

export default function CheckoutItems({ items = [] }) {
  return (
    <section>
      <h2 className="font-luxury text-2xl text-forest-800 mb-5">
        Atelier Pieces ({items.length})
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={getProductId(item)}
            className="flex gap-4 pb-4 border-b border-cream-200"
          >
            <img
              src={item.product?.images?.[0] || "/logo.png"}
              alt={item.product?.name || "Product"}
              className="w-20 h-20 object-contain bg-white border border-cream-200"
            />

            <div className="flex-1 min-w-0">
              <p className="font-luxury text-base text-forest-800 line-clamp-1">
                {item.product?.name}
              </p>
              <p className="font-sans text-xs text-cream-700 mt-1">
                Qty: {item.quantity}
              </p>
            </div>

            <span className="font-luxury text-lg text-forest-800">
              {fmt(item.product?.selling_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}