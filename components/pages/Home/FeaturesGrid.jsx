const features = [
  {
    title: "Timeless Silver Artistry",
    desc: "Our collections celebrate the perfect blend of traditional craftsmanship and modern elegance, designed to elevate every space with sophistication.",
    icon: "✦",
  },
  {
    title: "Customized Bulk Gifting",
    desc: "From corporate gifting to festive hampers and special occasions, we offer premium bulk gifting solutions tailored to your requirements.",
    icon: "✧",
  },
  {
    title: "Legacy of Trust",
    desc: "Backed by over 26 years of excellence from Abhinandan Jewellers, Elmas continues a legacy built on quality, craftsmanship, and customer trust.",
    icon: "◆",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream-300">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-cream-100 p-10 text-center flex flex-col items-center gap-4"
            >
              <span className="text-2xl text-forest-600">{f.icon}</span>

              <h3 className="font-luxury text-xl text-forest-800">
                {f.title}
              </h3>

              <p className="font-sans text-sm text-cream-700 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}