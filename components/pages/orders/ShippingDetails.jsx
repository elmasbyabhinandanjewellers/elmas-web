"use client";

import { Truck } from "lucide-react";

export default function ShippingDetails({ order }) {
  if (!order.trackingNumber && !order.carrier) return null;

  return (
    <div className="border border-cream-300 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-forest-700" />
        <h3 className="font-luxury text-xl text-forest-800">
          Shipping Details
        </h3>
      </div>
      <p className="font-sans text-sm text-cream-700">
        Carrier: {order.carrier || "N/A"}
      </p>
      <p className="font-sans text-sm text-cream-700">
        Tracking: {order.trackingNumber || "N/A"}
      </p>
      {order.trackingUrl && (
        <a
          href={order.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700 mt-3 inline-block"
        >
          Track Shipment
        </a>
      )}
    </div>
  );
}