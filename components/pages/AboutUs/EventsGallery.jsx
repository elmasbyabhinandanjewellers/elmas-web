"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const eventImages = [
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788411258/_DSC4812.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788411257/_DSC4776.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413554/WhatsApp_Image_2026-09-03_at_10.50.43.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413502/WhatsApp_Image_2026-09-03_at_10.50.39.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413501/WhatsApp_Image_2026-09-03_at_10.50.39_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413503/WhatsApp_Image_2026-09-03_at_10.50.40.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413502/WhatsApp_Image_2026-09-03_at_10.50.40_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788414113/WhatsApp_Image_2026-09-03_at_10.50.41.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413504/WhatsApp_Image_2026-09-03_at_10.50.42.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413504/WhatsApp_Image_2026-09-03_at_10.50.43_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413505/WhatsApp_Image_2026-09-03_at_10.50.41_3.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788414113/WhatsApp_Image_2026-09-03_at_10.50.41_2.jpg",
];

const tileCount = 12;

const slideDirections = [
  {
    enter: "translate-x-full",
    active: "translate-x-0 translate-y-0",
    exit: "-translate-x-full",
  },
  {
    enter: "-translate-x-full",
    active: "translate-x-0 translate-y-0",
    exit: "translate-x-full",
  },
  {
    enter: "translate-y-full",
    active: "translate-x-0 translate-y-0",
    exit: "-translate-y-full",
  },
  {
    enter: "-translate-y-full",
    active: "translate-x-0 translate-y-0",
    exit: "translate-y-full",
  },
  {
    enter: "translate-x-full translate-y-full",
    active: "translate-x-0 translate-y-0",
    exit: "-translate-x-full -translate-y-full",
  },
  {
    enter: "-translate-x-full translate-y-full",
    active: "translate-x-0 translate-y-0",
    exit: "translate-x-full -translate-y-full",
  },
];

export default function EventsGallery() {
  const [step, setStep] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLayer((prev) => (prev === 0 ? 1 : 0));
      setStep((prev) => prev + 1);
    }, 3400);

    return () => clearInterval(timer);
  }, []);

  const tiles = useMemo(() => {
    return Array.from({ length: tileCount }).map((_, index) => {
      const currentImage = eventImages[(index + step) % eventImages.length];

      const previousImage =
        eventImages[
          (index + step - 1 + eventImages.length) % eventImages.length
        ];

      return {
        currentImage,
        previousImage,
        slide: slideDirections[(index + step) % slideDirections.length],
      };
    });
  }, [step]);

  return (
    <section className="py-16 md:py-24 bg-cream-200 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="section-subheading text-forest-500 mb-3">
            EVENTS & MOMENTS
          </p>

          <h2 className="section-heading">Celebrating Our Journey</h2>

          <p className="font-sans text-sm md:text-base leading-7 text-cream-700 max-w-2xl mx-auto mt-4">
            A glimpse into our exhibitions, client celebrations, gifting
            milestones, and memorable moments from the Elmas family.
          </p>
        </div>

        <div className="rounded-[2rem] bg-cream-100/60 border border-cream-300 p-3 md:p-5 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
            {tiles.map((tile, index) => {
              const currentVisible = activeLayer === 1;
              const previousVisible = activeLayer === 0;

              return (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100 group"
                >
                  <div
                    className={`absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                      previousVisible ? tile.slide.active : tile.slide.exit
                    }`}
                  >
                    <Image
                      src={tile.previousImage}
                      alt={`Elmas event ${index + 1}`}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover object-center scale-[0.94] transition-transform duration-700 group-hover:scale-100"
                    />
                  </div>

                  <div
                    className={`absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                      currentVisible ? tile.slide.active : tile.slide.enter
                    }`}
                  >
                    <Image
                      src={tile.currentImage}
                      alt={`Elmas event ${index + 1}`}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover object-center scale-[0.94] transition-transform duration-700 group-hover:scale-100"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}