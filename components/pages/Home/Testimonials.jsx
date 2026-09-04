"use client";

import { Star, Quote } from "lucide-react";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    quote:
      "Ordered a silver elephant pair as a housewarming gift and the quality genuinely surprised me. The weight, the finish, the packaging everything felt considered and premium. Already planning my next purchase.",
    name: "Radhika Goel",
    title: "Delhi",
    rating: 5,
  },
  {
    quote:
      "Diwali pe office ke liye bulk order kiya tha, around 40 pieces. Honestly expected delays and confusion but everything was smooth — GST billing, packaging, delivery, all on time. Team ne kaafi ache se handle kiya.",
    name: "Tanveer Singhal",
    title: "Delhi",
    rating: 5,
  },
  {
    quote:
      "Bought the silver clutch purse for my sister's wedding and it was an instant hit. Even more elegant in person than the photos. The packaging was so premium that we didn't even need extra gift wrapping.",
    name: "Priya Chadda",
    title: "Delhi",
    rating: 5,
  },
  {
    quote:
      "Our company completed 25 years so we planned customized silver gifting for clients and senior staff. The Elmas team handled everything from design discussions to delivery, and every single piece had consistent quality. Made the entire process stress free.",
    name: "Mihir Chabbra",
    title: "Mumbai",
    rating: 4,
  },
  {
    quote:
      "Ordered a silver Shubh Labh piece for the entrance of our new home and it looks beautiful. Almost every guest asks where we got it from. The finish and quality feel genuinely premium when you see it in person.",
    name: "Sneha Mittal",
    title: "Bangalore",
    rating: 5,
  },
  {
    quote:
      "Was looking for a retirement gift for a senior colleague and wanted something meaningful instead of the usual items. Picked a silver wall clock from Elmas and it turned out to be the perfect choice. He genuinely loved it.",
    name: "Arvind Kapoor",
    title: "Gurgaon",
    rating: 5,
  },
  {
    quote:
      "I was honestly hesitant about ordering silver online but the experience turned out to be really smooth. The purse arrived beautifully packed and looked premium right out of the box. The craftsmanship stands out immediately.",
    name: "Meera Gupta",
    title: "Chennai",
    rating: 5,
  },
  {
    quote:
      "Gifted the Namokar Mantra piece to my in-laws on their anniversary and they absolutely loved it. They notice quality instantly, so seeing them genuinely impressed said a lot. The detailing feels very refined.",
    name: "Deepika Jain",
    title: "Kochi",
    rating: 5,
  },
  {
    quote:
      "Beti ki shaadi ke liye customized silver gifting karwai thi for close guests. Packaging par names bhi add karwaye and everything arrived exactly on time. Guests loved the personal touch and honestly it made the gifting feel special.",
    name: "Rohit & Sunita Malhotra",
    title: "Jaipur",
    rating: 5,
  },
  {
    quote:
      "Bought a silver purse for a family function and did not regret it for a second. It looked classy without being over the top and people kept asking where it was from. Definitely one of my favourite purchases lately.",
    name: "Kavya Singh",
    title: "Pune",
    rating: 5,
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24 bg-cream-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subheading text-forest-500 mb-3">
            CLIENT VOICES
          </p>
          <h2 className="section-heading">Voices of Elegance</h2>
        </div>

        <div className="overflow-hidden -ml-4 md:-ml-6" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-none pl-4 md:pl-6 w-[85%] sm:w-[60%] md:w-1/3"
              >
                <div className="bg-white p-8 flex flex-col gap-5 h-full min-h-[360px]">
                  <Quote size={24} className="text-forest-300" />

                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className="text-gold-500 fill-gold-500"
                      />
                    ))}
                  </div>

                  <p className="font-sans text-sm text-cream-700 leading-7 italic">
                    "{t.quote}"
                  </p>

                  <div className="mt-auto pt-4 border-t border-cream-200">
                    <p className="font-luxury text-base text-forest-800">
                      {t.name}
                    </p>
                    <p className="font-sans text-xs text-cream-600 mt-1">
                      {/* {t.title} */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}