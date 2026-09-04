"use client";

import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createNewsletterLeadApi } from "@/api/leads/leadApi";
import { useState } from "react";

export default function Footer() {
  const [newsletterSuccess, setNewsletterSuccess] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const validateNewsletter = (values) => {
    const errors = {};

    if (!values.whatsappNumber.trim()) {
      errors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(values.whatsappNumber.trim())) {
      errors.whatsappNumber = "Enter a valid WhatsApp number";
    }

    return errors;
  };

  const handleNewsletterSubmit = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    setNewsletterSuccess("");
    setNewsletterError("");

    try {
      await createNewsletterLeadApi({
        whatsappNumber: values.whatsappNumber.trim(),
      });

      setNewsletterSuccess("Subscribed successfully.");
      resetForm();
    } catch (error) {
      setNewsletterError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to subscribe. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-cream-200 border-t border-cream-300">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="relative z-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Elmas by Abhinandan"
                width={140}
                height={52}
                className="object-contain drop-shadow-sm"
              />
            </Link>

            <p className="font-sans text-sm text-cream-700 leading-relaxed mt-5">
              Sacred idols, statement purses, and bulk gifts worth remembering,
              crafted in 999 pure silver for 26 years.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/elmas_byabhinandanjewellers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-700 hover:text-forest-500 transition-colors"
              >
                <Instagram size={18} />
              </a>

              <a
                href="mailto:info@elmasbyabhinandanjewellers.com"
                className="text-forest-700 hover:text-forest-500 transition-colors"
              >
                <Mail size={18} />
              </a>

              <a
                href="tel:+919220898791"
                className="text-forest-700 hover:text-forest-500 transition-colors"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-forest-800 mb-5 font-medium">
              DISCOVER
            </p>

            <ul className="space-y-3">
              {[
                { label: "Silver Decor", href: "/shop?collection=silver-decor" },
                {
                  label: "Silver Candle Stand",
                  href: "/shop?collection=silver-candle-stand",
                },
                { label: "Animal/Birds", href: "/shop?category=animal/birds" },
                { label: "Luxury Gifts", href: "/shop?category=gifting" },
                { label: "New Arrivals", href: "/shop?sort=newest" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-forest-800 mb-5 font-medium">
              THE HOUSE
            </p>

            <ul className="space-y-3">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "Purses", href: "/shop?category=purses" },
                { label: "New Arrivals", href: "/shop?sort=newest" },
                { label: "Under ₹15,000", href: "/shop?maxPrice=15000" },
                { label: "Under ₹30,000", href: "/shop?maxPrice=30000" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-forest-800 mb-5 font-medium">
              CONCIERGE
            </p>

            <ul className="space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Track Order", href: "/account/orders" },
                { label: "My Account", href: "/account/profile" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Cart", href: "/cart" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-700 hover:text-forest-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-cream-400">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-luxury text-xl text-forest-800 mb-1">
                Join the Inner Circle
              </p>

              <p className="font-sans text-xs text-cream-700">
                Exclusive access to new collections, private events, and
                heritage stories.
              </p>
            </div>

            <Formik
              initialValues={{ whatsappNumber: "" }}
              validate={validateNewsletter}
              onSubmit={handleNewsletterSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="w-full md:w-auto">
                  <div className="flex gap-0 w-full md:w-auto">
                    <Field
                      type="text"
                      name="whatsappNumber"
                      placeholder="Your whatsapp number (Ex: +91 98765 43210)"
                      className="flex-1 md:w-72 px-4 py-3 font-sans text-sm bg-white border border-cream-400 focus:outline-none focus:border-forest-600 text-forest-800 placeholder:text-cream-600"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-forest-700 text-cream-100 font-sans text-xs tracking-widest uppercase hover:bg-forest-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Subscribe"}
                    </button>
                  </div>

                  <ErrorMessage
                    name="whatsappNumber"
                    component="p"
                    className="mt-2 text-xs text-red-600 font-sans"
                  />

                  {newsletterError && (
                    <p className="mt-2 text-xs text-red-600 font-sans">
                      {newsletterError}
                    </p>
                  )}

                  {newsletterSuccess && (
                    <p className="mt-2 text-xs text-green-700 font-sans">
                      {newsletterSuccess}
                    </p>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div className="bg-forest-800 text-cream-300 pt-4 pb-24 lg:pb-4">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-sans text-xs tracking-widest">
            &copy; 2026 ELMAS BY ABHINANDAN JEWELLERS. ALL RIGHTS RESERVED.
          </p>

          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <Link
              href="/privacy-policies"
              className="font-sans text-xs tracking-widest hover:text-cream-100 transition-colors"
            >
              PRIVACY POLICY
            </Link>

            <Link
              href="/terms-and-conditions"
              className="font-sans text-xs tracking-widest hover:text-cream-100 transition-colors"
            >
              TERMS & CONDITIONS
            </Link>

            <Link
              href="/contact"
              className="font-sans text-xs tracking-widest hover:text-cream-100 transition-colors"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}