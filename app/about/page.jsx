"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import bannersApi from "@/api/banners/bannersApi";
import { ArrowRight, Award, Users, Gem, Heart } from "lucide-react";
import MeetOurCEO from "@/components/pages/AboutUs/MeetOurCeo";
import EventsGallery from "@/components/pages/AboutUs/EventsGallery";
import Image from "next/image";
import DynamicHeroBanner from "@/components/pages/AboutUs/DynamicBanner";

const collageImages = [
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413027/WhatsApp_Image_2026-09-02_at_18.21.04.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413028/WhatsApp_Image_2026-09-02_at_18.12.28.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413027/WhatsApp_Image_2026-09-02_at_18.12.28_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413026/WhatsApp_Image_2026-09-02_at_18.21.04_1.jpg",
];

const atelierImages = [
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413027/WhatsApp_Image_2026-09-02_at_18.12.28_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788413028/WhatsApp_Image_2026-09-02_at_18.12.28.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788414184/WhatsApp_Image_2026-09-02_at_18.12.27_1.jpg",
  "https://res.cloudinary.com/jy0tpdto/image/upload/v1788414184/WhatsApp_Image_2026-09-02_at_18.12.27.jpg",
];

function FourImageFrame({ images }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {images.slice(0, 4).map((src, index) => (
        <div
          key={src}
          className={`overflow-hidden border-4 border-white shadow-xl bg-cream-100 ${
            index === 0 || index === 3
              ? "h-[190px] sm:h-[240px] lg:h-[290px]"
              : "h-[170px] sm:h-[220px] lg:h-[260px]"
          }`}
        >
          <img
            src={src}
            alt={`Elmas visual ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await bannersApi.fetchBanners();

        const banner = res?.data?.data?.find(
          (ban) => ban?.page === "about" && ban?.position === "hero",
        );

        setHeroBanner(banner || null);
      } catch (error) {
        console.error("About hero banner error:", error);
      }
    })();
  }, []);

  return (
    <div className="bg-cream-100">
      {/* Hero */}
      <DynamicHeroBanner
        page="about"
        position="hero"
        fallbackImage="https://res.cloudinary.com/jy0tpdto/image/upload/v1788411257/_DSC4776.jpg"
        fallbackEyebrow="THE ABHINANDAN STORY"
        fallbackTitle="The Elmas"
        fallbackSubtitle="999 Silver | Silver Gifting | God Idols & More...."
        heightClass="h-[81vh] min-h-[520px]"
        imagePosition="object-[center_30%]"
      />

      {/* Heritage Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="section-subheading text-forest-500 mb-4">
                SINCE 1999
              </p>

              <h2 className="font-luxury text-4xl md:text-5xl text-forest-800 mb-6 leading-tight">
                The Abhinandan Legacy
              </h2>

              {[
                "For over 26 years, Abhinandan Jewellers has been a symbol of trust, craftsmanship, and timeless elegance. Founded by Mr. Piyush Jain, the brand was established with a vision to create jewellery and artistic masterpieces that reflect tradition, purity, and excellence.",
                "Expanding this legacy of excellence, Elmas by Abhinandan Jewellers was introduced to bring premium silver artistry into modern lifestyles. Elmas specializes in beautifully crafted silver statues, divine god idols, elegant décor pieces, and premium bulk gifting solutions.",
                "Each creation by Elmas is thoughtfully designed to embody sophistication, spirituality, and timeless beauty. From sacred idols that inspire devotion to luxury showpieces that elevate spaces, every product reflects the brand’s commitment to fine craftsmanship.",
              ].map((text) => (
                <p
                  key={text}
                  className="font-sans text-sm md:text-base text-cream-700 leading-7 mb-4"
                >
                  {text}
                </p>
              ))}
            </div>

            <FourImageFrame images={collageImages} />
          </div>
        </div>
      </section>

      <MeetOurCEO />
      <EventsGallery />

      {/* Values */}
      <section className="py-16 md:py-24 bg-cream-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-12 md:mb-16">
            <p className="section-subheading text-forest-500 mb-4">
              OUR PRINCIPLES
            </p>
            <h2 className="section-heading">What Defines Elmas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Award,
                title: "Premium Craftsmanship",
                desc: "Carefully crafted 999 pure silver pieces designed with meticulous attention to every detail — from sacred idols to luxury décor.",
              },
              {
                icon: Heart,
                title: "Elegant Packaging",
                desc: "Luxury presentation boxes perfect for gifting and memorable occasions. Every unboxing feels like opening something precious.",
              },
              {
                icon: Users,
                title: "Trusted Since Generations",
                desc: "Built on relationships, trust, and a legacy of serving valued customers for 26 years with unwavering commitment to quality.",
              },
              {
                icon: Gem,
                title: "Corporate & Custom Gifting",
                desc: "Personalized gifting solutions for weddings, celebrations, and businesses. Pan-India delivery with GST billing for bulk orders.",
              },
            ].map((value, i) => (
              <div
                key={value.title}
                className="bg-white p-6 md:p-8 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-forest-700 flex items-center justify-center">
                  <value.icon size={28} className="text-cream-100" />
                </div>

                <span className="font-sans text-xs tracking-[0.25em] text-forest-500 uppercase">
                  {`0${i + 1}`}
                </span>

                <h3 className="font-luxury text-xl text-forest-800">
                  {value.title}
                </h3>

                <p className="font-sans text-sm text-cream-700 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 md:py-20 bg-forest-700">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="section-subheading text-forest-300 mb-4">
              OUR COMMITMENT
            </p>

            <h2 className="font-luxury text-4xl text-cream-100 mb-10">
              The Elmas Promise
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                "Premium Craftsmanship",
                "Luxury Packaging",
                "Custom Gifting",
                "Trusted Legacy",
              ].map((cert) => (
                <div key={cert} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-cream-100/10 border-2 border-cream-300 flex items-center justify-center mb-3 mx-auto">
                    <Award size={32} className="text-cream-200" />
                  </div>

                  <p className="font-sans text-sm tracking-widest text-cream-200 uppercase">
                    {cert}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Atelier */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <FourImageFrame images={atelierImages} />
            </div>

            <div className="order-1 lg:order-2">
              <p className="section-subheading text-forest-500 mb-4">
                WHERE MAGIC HAPPENS
              </p>

              <h2 className="font-luxury text-4xl md:text-5xl text-forest-800 mb-6 leading-tight">
                The Atelier
              </h2>

              {[
                "Step into our workshop, and you enter a world suspended in time. Here, master craftsmen with decades of experience work with tools passed down through generations.",
                "The atelier is not merely a workspace. It is a sanctuary of precision, where raw silver transforms into devotional idols, luxury décor, and timeless gifts.",
                "We invite connoisseurs and collectors to visit by appointment and experience the dedication that makes Elmas a guardian of heritage and meaningful gifting.",
              ].map((text) => (
                <p
                  key={text}
                  className="font-sans text-sm md:text-base text-cream-700 leading-7 mb-4"
                >
                  {text}
                </p>
              ))}

              <Link
                href="/contact"
                className="btn-primary inline-flex items-center gap-2 mt-2"
              >
                SCHEDULE YOUR VISIT <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-12 md:mb-16">
            <p className="section-subheading text-forest-500 mb-4">
              OUR PROCESS
            </p>
            <h2 className="section-heading">From Sketch to Splendor</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Design Consultation",
                desc: "Your vision meets our expertise. We listen, sketch, and refine until perfection emerges.",
              },
              {
                step: "02",
                title: "Silver Selection",
                desc: "Hand-picked 999 pure silver from trusted sources. Every batch is certified and inspected for purity.",
              },
              {
                step: "03",
                title: "Master Crafting",
                desc: "Four to eight weeks of meticulous work. Traditional techniques meet modern precision in our atelier.",
              },
              {
                step: "04",
                title: "Final Blessing",
                desc: "Each piece undergoes rigorous quality checks and is blessed before reaching your hands.",
              },
            ].map((process) => (
              <div key={process.step} className="text-center">
                <div className="font-luxury text-5xl md:text-6xl text-forest-200 mb-4">
                  {process.step}
                </div>

                <h3 className="font-luxury text-xl text-forest-800 mb-3">
                  {process.title}
                </h3>

                <p className="font-sans text-sm text-cream-700 leading-relaxed">
                  {process.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-luxury text-4xl md:text-5xl text-forest-800 mb-6 leading-tight">
            Begin Your Story with Us
          </h2>

          <p className="font-sans text-sm md:text-base text-cream-700 leading-relaxed mb-10 max-w-lg mx-auto">
            Visit our atelier for a private consultation, or explore our
            collections online. Every journey begins with a conversation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              BOOK A CONSULTATION <ArrowRight size={14} />
            </Link>

            <Link
              href="/shop"
              className="btn-outline inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              VIEW COLLECTIONS <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
