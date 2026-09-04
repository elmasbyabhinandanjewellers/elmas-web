const socialImages = [
  "https://images.unsplash.com/photo-1727784892059-c85b4d9f763c?auto=format&fit=crop&w=400&q=80",
  "https://images.pexels.com/photos/29495765/pexels-photo-29495765.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/34479808/pexels-photo-34479808.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1650455221359-3aebf920bcc5?auto=format&fit=crop&w=400&q=80",
];

export default function SocialAtelier() {
  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-luxury text-3xl text-forest-800">
            Social Atelier
          </h2>

          <a
            href="#"
            className="font-sans text-xs tracking-widest text-forest-600 uppercase hover:text-forest-800 transition-colors"
          >
            FOLLOW US @ELMASBYABHINANDAN
          </a>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {socialImages.map((img, i) => (
            <div key={i} className="overflow-hidden group cursor-pointer aspect-square">
              <img
                src={img}
                alt={`Social ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}