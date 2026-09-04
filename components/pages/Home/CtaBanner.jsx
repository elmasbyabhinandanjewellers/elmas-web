import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-24 bg-forest-700">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <p className="text-xs text-cream-300 mb-4">
          YOUR JOURNEY BEGINS HERE
        </p>

        <h2 className="font-luxury text-5xl md:text-6xl text-cream-100 mb-6 leading-tight">
          Begin Your Story
          <br />
          with Elmas
        </h2>

        <p className="font-sans text-sm text-cream-300 leading-relaxed mb-10 max-w-lg mx-auto">
          Whether you are seeking the perfect engagement ring or a timeless
          heirloom, our concierge consultants are here to guide you through a
          world of brilliance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="btn-luxury border border-cream-300 text-cream-100 hover:bg-cream-100/10"
          >
            BOOK AN APPOINTMENT
          </Link>

          <Link
            href="/shop"
            className="btn-luxury bg-cream-100 text-forest-800 hover:bg-cream-200"
          >
            VIEW COLLECTIONS
          </Link>
        </div>
      </div>
    </section>
  );
}