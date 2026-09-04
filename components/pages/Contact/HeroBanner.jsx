"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import bannersApi from "@/api/banners/bannersApi";

export default function DynamicHeroBanner({
  page,
  position,
  fallbackImage,
  fallbackEyebrow = "",
  fallbackTitle = "",
  fallbackSubtitle = "",
  heightClass = "h-[70vh] min-h-[520px]",
  imagePosition = "object-center",
  overlayClass = "bg-gradient-to-r from-black/5 via-black/10 to-black/5",
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banner, setBanner] = useState(null);

  const fallbackSlide = {
    image: fallbackImage,
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
  };

  const [imgErrors, setImgErrors] = useState({});

  const getValidImageUrl = (url, fallback) => {
    if (!url || typeof url !== "string") return fallback;
    if (url.includes("dxsnvcwif")) return fallback;
    return url;
  };

  const slides =
    banner?.items && banner.items.length > 0
      ? banner.items
      : fallbackImage
      ? [fallbackSlide]
      : [];
  const activeSlide = slides[currentSlide] || null;
  const isCarousel = slides.length > 1;

  useEffect(() => {
    (async () => {
      try {
        const res = await bannersApi.fetchBanners();
        const matchedBanner = res?.data?.data?.find(
          (ban) => ban?.page === page && ban?.position === position,
        );

        setBanner(matchedBanner || null);
      } catch (error) {
        console.error(`${page} hero banner error:`, error);
      }
    })();
  }, [page, position]);

  useEffect(() => {
    if (!isCarousel) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isCarousel, slides.length]);

  const goPrev = () => {
    if (!isCarousel) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    if (!isCarousel) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className={`relative ${heightClass} overflow-hidden bg-black`}>
      {slides.map((slide, index) => {
        const isDesktopFailed = imgErrors[`${index}-desktop`];
        const isMobileFailed = imgErrors[`${index}-mobile`];

        const rawImage = slide?.image;
        const image = isDesktopFailed
          ? fallbackImage
          : getValidImageUrl(rawImage, fallbackImage);

        const rawMobileImage = slide?.mobileImage;
        const mobileImage = isMobileFailed
          ? null
          : getValidImageUrl(rawMobileImage, null);

        return (
          <div
            key={slide?._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
          >
            {mobileImage && (
              <Image
                src={mobileImage}
                alt={slide?.title || fallbackTitle || "Hero Banner"}
                fill
                priority={index === 0}
                sizes="100vw"
                onError={() =>
                  setImgErrors((prev) => ({
                    ...prev,
                    [`${index}-mobile`]: true,
                  }))
                }
                className={`object-cover ${imagePosition} block md:hidden`}
              />
            )}

            <Image
              src={image}
              alt={slide?.title || fallbackTitle || "Hero Banner"}
              fill
              priority={index === 0}
              sizes="100vw"
              onError={() =>
                setImgErrors((prev) => ({
                  ...prev,
                  [`${index}-desktop`]: true,
                }))
              }
              className={`object-cover ${imagePosition} ${
                mobileImage ? "hidden md:block" : "block"
              }`}
            />
          </div>
        );
      })}

      <div className={`absolute inset-0 z-[2] ${overlayClass}`} />

      <div className="absolute inset-0 z-[3] flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full">
          <div className="max-w-2xl">
            {(activeSlide?.eyebrow || fallbackEyebrow) && (
              <p className="section-subheading text-cream-300 mb-4">
                {activeSlide?.eyebrow || fallbackEyebrow}
              </p>
            )}

            {(activeSlide?.title || fallbackTitle) && (
              <h1 className="font-luxury text-5xl sm:text-6xl md:text-7xl text-white mb-6 leading-tight">
                {activeSlide?.title || fallbackTitle}
              </h1>
            )}

            {(activeSlide?.subtitle || fallbackSubtitle) && (
              <p className="font-sans text-sm md:text-base text-cream-200 leading-relaxed max-w-lg">
                {activeSlide?.subtitle || fallbackSubtitle}
              </p>
            )}

            {activeSlide?.buttonText?.length >0 && activeSlide?.link && (
              <Link
                href={activeSlide.link}
                className="btn-primary inline-flex items-center gap-2 mt-8"
              >
                {activeSlide.buttonText}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {isCarousel && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-px transition-all duration-500 ${
                  index === currentSlide ? "w-10 bg-white" : "w-5 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </section>
  );
}