"use client";

import Image from "next/image";

export default function MeetOurCEO() {
  return (
    <section className="py-16 md:py-24 bg-cream-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="section-subheading text-forest-500 mb-3">
              MEET OUR CEO
            </p>

            <h2 className="font-luxury text-4xl md:text-5xl lg:text-6xl text-forest-800 mb-6 leading-tight">
              Carrying Forward a Legacy of Trust
            </h2>

            <p className="font-sans text-sm md:text-base leading-8 text-cream-700 max-w-xl">
              At Elmas by Abhinandan Jewellers, our leadership is rooted in
              heritage, craftsmanship, and customer trust. With a vision to
              present timeless silver creations in a modern way, every piece is
              chosen with care, elegance, and a deep respect for meaningful
              gifting.
            </p>

            <div className="mt-8 border-l-2 border-forest-700 pl-5">
              <p className="font-luxury text-2xl text-forest-800">
                Elmas By Abhinandan Jewellers
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-forest-500 mt-1">
                Founder & CEO
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-5 -right-5 w-28 h-28 bg-forest-700/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl" />

            <div className="relative max-w-[340px] md:max-w-[380px] mx-auto">
              <div className="relative rounded-[2rem] border border-cream-300 p-3 shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#DFD8D8]">
                  <Image
                    src="https://res.cloudinary.com/jy0tpdto/image/upload/v1788413227/WhatsApp_Image_2026-09-03_at_10.54.54.jpg"
                    alt="CEO of Elmas by Abhinandan Jewellers"
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 460px"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              <div className="relative -mt-8 mx-auto w-[88%] rounded-2xl border border-cream-300 bg-white/95 backdrop-blur px-5 py-4 shadow-xl">
                <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-forest-500">
                  Elmas by Abhinandan Jewellers
                </p>
                <p className="font-luxury text-xl md:text-2xl text-forest-800 mt-1">
                  Mr. Piyush Jain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}