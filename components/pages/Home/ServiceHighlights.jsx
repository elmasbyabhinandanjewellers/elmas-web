import { Package, CheckCircle, RefreshCw } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Pan India Delivery",
    desc: "Secure and reliable shipping across India with carefully packaged deliveries and real-time order assistance for a seamless shopping experience.",
  },
  {
    icon: CheckCircle,
    title: "Certified Silver Craftsmanship",
    desc: "Every creation by Elmas by Abhinandan Jewellers is crafted with premium quality silver, ensuring authenticity, elegance, and lasting value.",
  },
  {
    icon: RefreshCw,
    title: "Premium Gifting Collection",
    desc: "Discover thoughtfully designed silver idols, decorative showpieces, and luxury gifting collections perfect for festive, personal, and corporate occasions.",
  },
];

export default function ServiceHighlights() {
  return (
    <section className="py-16 bg-cream-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {services.map((s, i) => {
            const Icon = s.icon;

            return (
              <div key={i} className="flex flex-col items-center gap-4 p-8">
                <div className="w-14 h-14 rounded-full bg-forest-700 flex items-center justify-center">
                  <Icon size={22} className="text-cream-100" />
                </div>

                <h3 className="font-luxury text-xl text-forest-800">
                  {s.title}
                </h3>

                <p className="font-sans text-sm text-cream-700 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}