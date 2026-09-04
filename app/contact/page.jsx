"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { createContactLeadApi } from "@/api/leads/leadApi";
import DynamicHeroBanner from "@/components/pages/Contact/HeroBanner";

const SUBJECT_OPTIONS = [
  {
    label: "General Enquiry",
    value: "general_enquiry",
  },
  {
    label: "Quotation for Bulk Products",
    value: "quotation_for_bulk_products",
  },
  {
    label: "Product Question",
    value: "product_question",
  },
  {
    label: "Shipment Related",
    value: "shipment_related",
  },
  {
    label: "Exchange Related",
    value: "exchange_related",
  },
];

const initialValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[0-9+\-\s]{8,15}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!values.subject) {
    errors.subject = "Subject is required";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required";
  }

  return errors;
};

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSuccess(false);
    setServerError("");

    try {
      await createContactLeadApi({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        subject: values.subject,
        message: values.message.trim(),
      });

      setSuccess(true);
      resetForm();
    } catch (error) {
      setServerError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-100">
      <DynamicHeroBanner
        page="contact"
        position="hero"
        fallbackImage="https://res.cloudinary.com/jy0tpdto/image/upload/v1788411258/_DSC4812.jpg"
        fallbackEyebrow="THE ABHINANDAN STORY"
        fallbackTitle="The Elmas"
        fallbackSubtitle="999 Silver | Silver Gifting | God Idols & More...."
        heightClass="h-[81vh] min-h-[520px]"
        imagePosition="object-[80%_45%] scale-125 md:scale-135 origin-[82%_45%] -translate-y-3 md:-translate-y-5"
      />

      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-luxury text-4xl text-forest-800 mb-8">
                Visit Our Atelier
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-cream-100" />
                  </div>

                  <div>
                    <h3 className="font-sans text-sm tracking-widest uppercase text-forest-700 mb-2">
                      Address
                    </h3>

                    <p className="font-sans text-base text-cream-700 leading-relaxed capitalize">
                      AL-35, Shalimar Bagh West
                      <br />
                      New Delhi, 110088
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-cream-100" />
                  </div>

                  <div>
                    <h3 className="font-sans text-sm tracking-widest uppercase text-forest-700 mb-2">
                      Phone
                    </h3>

                    <p className="font-sans text-base text-cream-700">
                      +91 9871212068
                    </p>

                    <p className="font-sans text-base text-cream-700">
                      +91 7880988165
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-cream-100" />
                  </div>

                  <div>
                    <h3 className="font-sans text-sm tracking-widest uppercase text-forest-700 mb-2">
                      Email
                    </h3>

                    <p className="font-sans text-base text-cream-700">
                      info@elmasbyabhinandanjewellers.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-cream-100" />
                  </div>

                  <div>
                    <h3 className="font-sans text-sm tracking-widest uppercase text-forest-700 mb-2">
                      Hours
                    </h3>

                    <p className="font-sans text-base text-cream-700">
                      Tuesday - Sunday: 11:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-luxury text-2xl text-forest-800 mb-4">
                  Find Us
                </h3>

                <div className="w-full h-80 border-4 border-white shadow-xl overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=Abhinandan%20Jewellers%20Private%20Limited%20Shalimar%20Bagh%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Elmas by Abhinandan Jewellers Location"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white border border-cream-300 p-8">
                <h2 className="font-luxury text-3xl text-forest-800 mb-6">
                  Send Us a Message
                </h2>

                <Formik
                  initialValues={initialValues}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                            Your Name *
                          </label>

                          <Field
                            type="text"
                            name="name"
                            className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                          />

                          <ErrorMessage
                            name="name"
                            component="p"
                            className="mt-2 text-xs text-red-600 font-sans"
                          />
                        </div>

                        <div>
                          <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                            Email Address *
                          </label>

                          <Field
                            type="email"
                            name="email"
                            className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                          />

                          <ErrorMessage
                            name="email"
                            component="p"
                            className="mt-2 text-xs text-red-600 font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                            Phone Number *
                          </label>

                          <Field
                            type="tel"
                            name="phone"
                            className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                          />

                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="mt-2 text-xs text-red-600 font-sans"
                          />
                        </div>

                        <div>
                          <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                            Subject *
                          </label>

                          <Field
                            as="select"
                            name="subject"
                            className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                          >
                            <option value="">Select subject</option>
                            {SUBJECT_OPTIONS.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </Field>

                          <ErrorMessage
                            name="subject"
                            component="p"
                            className="mt-2 text-xs text-red-600 font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                          Your Message *
                        </label>

                        <Field
                          as="textarea"
                          name="message"
                          rows={6}
                          className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors resize-none"
                        />

                        <ErrorMessage
                          name="message"
                          component="p"
                          className="mt-2 text-xs text-red-600 font-sans"
                        />
                      </div>

                      {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-sans text-sm">
                          {serverError}
                        </div>
                      )}

                      {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 font-sans text-sm">
                          Thank you! Your message has been sent successfully.
                          We'll get back to you soon.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                        {!isSubmitting && <Send size={14} />}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
