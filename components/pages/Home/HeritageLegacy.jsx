import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeritageLegacy() {
  return (
    <section className="py-24 bg-cream-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[480px]">
            <div className="absolute left-0 md:left-10 top-0 w-[65%] md:w-[50%] h-[78%] overflow-hidden border-4 border-white shadow-xl bg-cream-100">
              <img
                src="https://res.cloudinary.com/jy0tpdto/image/upload/v1788412838/WhatsApp_Image_2026-09-02_at_18.02.28.jpg"
                alt="Heritage Atelier"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute right-0 bottom-0 w-[52%] h-[52%] overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="https://res.cloudinary.com/jy0tpdto/image/upload/v1788412837/WhatsApp_Image_2026-09-02_at_18.02.28_1.jpg"
                alt="Craft"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="section-subheading text-forest-500 mb-4">
              THE ABHINANDAN LEGACY
            </p>

            <h2 className="font-luxury text-5xl md:text-6xl text-forest-800 mb-6 leading-tight">
              The Abhinandan
              <br />
              Legacy
            </h2>

            <p className="font-sans text-sm text-cream-700 leading-7 mb-4">
              For over 26 years, Abhinandan Jewellers has been a symbol of
              trust, craftsmanship, and timeless elegance. Founded by Mr. Piyush
              Jain, the brand was established with a vision to create jewellery
              and artistic masterpieces that reflect tradition, purity, and
              excellence.
            </p>

            <p className="font-sans text-sm text-cream-700 leading-7 mb-8">
              Over the years, Abhinandan Jewellers has earned the trust of
              generations through its dedication to superior quality, authentic
              craftsmanship, and exceptional customer experience. Every creation
              represents a perfect harmony of heritage and refined artistry,
              making the brand a respected name in the jewellery industry.
            </p>

            <Link
              href="/about"
              className="btn-outline inline-flex items-center gap-2"
            >
              READ OUR FULL STORY <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
