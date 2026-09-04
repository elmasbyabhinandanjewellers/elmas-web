"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import bannersApi from "@/api/banners/bannersApi";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState(null);

  const slides =
    banners?.items
      ?.filter((item) => item?.isActive)
      ?.map((item) => item) || [];

  useEffect(() => {
    (async () => {
      const res = await bannersApi.fetchBanners();
      const selectiveData = res?.data?.data?.filter(
        (ban) => ban?.page === "home" && ban?.position === "hero"
      );
      setBanners(selectiveData?.[0] || null);
    })();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides.length) return null;

  const getSlideImages = (slide) => {
    const isRamDarbar =
      slide?.title?.toLowerCase()?.includes("ram darbar") ||
      slide?.subtitle?.toLowerCase()?.includes("ram darbar") ||
      slide?.subtitle?.toLowerCase()?.includes("faith, devotion");

    if (isRamDarbar) {
      return {
        desktop:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494956/WhatsApp_Image_2026-09-03_at_13.25.33_1.jpg",
        mobile:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494957/WhatsApp_Image_2026-09-03_at_13.25.33.jpg",
      };
    }

    const isShankh =
      slide?.title?.toLowerCase()?.includes("shankh") ||
      slide?.subtitle?.toLowerCase()?.includes("shankh") ||
      slide?.subtitle?.toLowerCase()?.includes("pure 999 silver, inspired");

    if (isShankh) {
      return {
        desktop:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494956/WhatsApp_Image_2026-09-03_at_13.25.31.jpg",
        mobile:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494960/WhatsApp_Image_2026-09-03_at_13.25.32.jpg",
      };
    }

    const isGuruJi =
      slide?.title?.toLowerCase()?.includes("guru ji") ||
      slide?.subtitle?.toLowerCase()?.includes("guru ji") ||
      slide?.buttonText?.toLowerCase()?.includes("guru ji");

    if (isGuruJi) {
      return {
        desktop:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494958/WhatsApp_Image_2026-09-03_at_13.25.35_2.jpg",
        mobile:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494958/WhatsApp_Image_2026-09-03_at_13.25.36.jpg",
      };
    }

    const isPurses =
      slide?.title?.toLowerCase()?.includes("purses") ||
      slide?.subtitle?.toLowerCase()?.includes("everyday luxury") ||
      slide?.subtitle?.toLowerCase()?.includes("reimagined as everyday");

    if (isPurses) {
      return {
        desktop:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494957/WhatsApp_Image_2026-09-03_at_13.25.34.jpg",
        mobile:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494958/WhatsApp_Image_2026-09-03_at_13.25.34_1.jpg",
      };
    }

    const isGifting =
      slide?.title?.toLowerCase()?.includes("gifting") ||
      slide?.subtitle?.toLowerCase()?.includes("gift of silver") ||
      slide?.subtitle?.toLowerCase()?.includes("mark every milestone");

    if (isGifting) {
      return {
        desktop:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494957/WhatsApp_Image_2026-09-03_at_13.25.35_1.jpg",
        mobile:
          "https://res.cloudinary.com/jy0tpdto/image/upload/v1788494958/WhatsApp_Image_2026-09-03_at_13.25.35.jpg",
      };
    }

    const desktop =
      slide?.image && !slide.image.includes("dxsnvcwif") ? slide.image : null;
    const mobile =
      slide?.mobileImage && !slide.mobileImage.includes("dxsnvcwif")
        ? slide.mobileImage
        : null;

    return { desktop, mobile };
  };

  return (
    <div className="w-full overflow-hidden">
      <section className="relative h-[58vh] min-h-[550px] max-h-[780px] w-full bg-black">
        {slides.map((slide, idx) => {
          const { desktop: desktopImage, mobile: mobileImage } =
            getSlideImages(slide);

          const hasOnlyButton =
            !slide?.title &&
            !slide?.subtitle &&
            slide?.buttonText &&
            slide?.link;

          const shouldRenderContent =
            slide?.title ||
            slide?.subtitle ||
            (slide?.buttonText && slide?.link);

          return (
            <div
              key={slide?._id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
            >
              {/* Images */}
              <div className="absolute inset-0">
                {mobileImage && (
                  <Image
                    src={mobileImage}
                    alt={slide?.title || "Banner"}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover object-top block md:hidden"
                  />
                )}

                {desktopImage && (
                  <Image
                    src={desktopImage}
                    alt={slide?.title || "Banner"}
                    fill
                    priority={idx === 0}
                    sizes="100vw 100vh"
                    className={`object-cover object-top ${
                      mobileImage ? "hidden md:block" : "block"
                    }`}
                  />
                )}
              </div>

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent z-[2]" />

              {/* Content */}
              {shouldRenderContent && (
                <div
                  className={`absolute inset-0 z-[3] flex ${
                    hasOnlyButton ? "items-end pb-24" : "items-center"
                  }`}
                >
                  <div className="px-8 sm:px-14 md:px-20 max-w-xl">
                    {(slide?.title || slide?.subtitle) && (
                      <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">
                        Elmas · Handcrafted Silver
                      </p>
                    )}

                    {slide?.title && (
                      <h2
                        className={`font-luxury text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-4 transition-all duration-700 ${
                          idx === currentSlide
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        {slide.title}
                      </h2>
                    )}

                    {slide?.subtitle && (
                      <p
                        className={`font-sans text-sm sm:text-base text-white/75 leading-relaxed mb-8 max-w-sm transition-all duration-700 delay-100 ${
                          idx === currentSlide
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        {slide.subtitle}
                      </p>
                    )}

                    {slide?.buttonText && slide?.link && (
                      <Link
                        href={slide.link}
                        className={`inline-flex items-center gap-2 px-7 py-3 font-sans text-xs tracking-[0.2em] uppercase border border-white text-white hover:bg-white hover:text-black transition-all duration-300 delay-200 ${
                          idx === currentSlide
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        {slide.buttonText}
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-px transition-all duration-500 ${
                i === currentSlide ? "w-10 bg-white" : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Previous */}
        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next */}
        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </section>
    </div>
  );
}