"use client";

const atelierSteps = [
  {
    num: "01",
    title: "The Vision",
    desc: "At ELMAS, we envision silver artistry that blends devotion, luxury, and timeless gifting into meaningful creations.",
    image:
      "https://images.unsplash.com/photo-1605100804567-1ffe942b5cd6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    num: "02",
    title: "Precision Engineering",
    desc: "Each silver article is crafted with intricate detailing, premium purity, and expert craftsmanship to ensure elegance in every piece.",
    image:
      "https://images.pexels.com/photos/29495765/pexels-photo-29495765.jpeg?auto=compress&cs=tinysrgb&w=1600",
    dark: true,
  },
  {
    num: "03",
    title: "The Final Polish",
    desc: "From divine finishing to luxurious presentation, every creation receives a flawless final touch worthy of celebration and gifting.",
    image:
      "https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=1600&q=80",
  },
  {
    num: "04",
    title: "Exclusivity in Every Detail",
    desc: "From bespoke bulk orders to limited edition collections, we ensure that what you own is as unique as the occasion it celebrates.",
    image:
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1600&q=80",
    dark: true,
  },
];

export default function DigitalAtelier() {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subheading text-forest-500 mb-3">
            FROM CONCEPT TO CREATION
          </p>

          <h2 className="section-heading">The Digital Atelier</h2>

          <p className="font-sans text-sm md:text-base text-cream-700 max-w-2xl mx-auto mt-4 leading-relaxed">
            Discover how every Elmas creation evolves from inspiration to
            craftsmanship, resulting in timeless silver masterpieces designed
            for devotion, gifting, and celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atelierSteps.map((step, i) => (
            <div
              key={i}
              className="relative overflow-hidden group"
              style={{ minHeight: "260px" }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 ${
                  step.dark
                    ? "bg-gradient-to-r from-forest-900/85 via-forest-800/60 to-transparent"
                    : "bg-gradient-to-r from-black/65 via-black/30 to-transparent"
                }`}
              />

              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end">
                <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3 text-cream-300">
                  {step.num}
                </p>

                <h3 className="font-luxury text-2xl md:text-3xl text-white mb-3">
                  {step.title}
                </h3>

                <p className="font-sans text-sm md:text-base leading-relaxed text-cream-100 max-w-md">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
