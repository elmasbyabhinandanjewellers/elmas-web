"use client";

import { Truck } from "lucide-react";

export default function DeliveryModeSelector() {
  return (
    <section>
      <h2 className="font-luxury text-2xl text-forest-800 mb-5">
        Delivery Preference
      </h2>

      <DeliveryModeCard
        icon={Truck}
        title="Concierge Delivery"
        desc="Your handcrafted masterpiece will be securely delivered to your selected address."
      />
    </section>
  );
}

function DeliveryModeCard({ icon: Icon, title, desc }) {
  return (
    <div className="text-left p-5 border border-forest-700 bg-cream-200">
      <div className="flex items-start gap-4">
        <div className="w-5 h-5 rounded-full border-2 border-forest-700 flex items-center justify-center mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-forest-700" />
        </div>

        <div>
          <Icon size={18} className="text-forest-700 mb-2" />

          <p className="font-sans text-sm text-forest-800">
            {title}
          </p>

          <p className="font-sans text-xs text-cream-600 mt-1 leading-6">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}