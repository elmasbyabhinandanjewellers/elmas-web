const items = [
  {
    title: "Pure as a Promise ",
    desc: "999 silver. No compromises, no shortcuts.",
    icon: "✦",
  },
  {
    title: "26 Years of Mastery",
    desc: "More than 2 decades of heritage craftsmanship. Every piece carries the mark of a skilled hand.",
    icon: "✧",
  },
  {
    title: "Delivered to Your Doorstep ",
    desc: "Pan-India shipping with packaging worthy of gifting.",
    icon: "✧",
  },
];

export default function WhyChooseElmas() {
  return (
    <section className="py-20 bg-cream-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subheading text-forest-500 mb-3">
            THE ELMAS DIFFERENCE
          </p>
          <h2 className="section-heading">Why Choose Elmas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-forest-700 flex items-center justify-center">
                <span className="text-3xl text-cream-100">{item.icon}</span>
              </div>

              <h3 className="font-luxury text-xl text-forest-800">
                {item.title}
              </h3>

              <p className="font-sans text-sm text-cream-700 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}