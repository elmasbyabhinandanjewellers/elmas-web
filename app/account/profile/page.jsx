"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { Package, Heart, MapPin, User, LogOut, Save } from "lucide-react";
import LuxuryLoader from "@/components/LuxuryLoader";

export default function ProfilePage() {
  const {
    customer,
    customerToken,
    customerAuthReady,
    logoutCustomer,
    updateCustomer,
  } = useCustomer();

  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!customerAuthReady) return;

    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }

    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        mobile: customer.mobile || "",
      });
    }
  }, [customerAuthReady, customerToken, customer, router]);

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    if (!formData.firstName.trim()) {
      setMessage("First name is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setMessage("Email address is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      await updateCustomer({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });

      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage(err?.message || "Failed to update profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!customerAuthReady) {
    return <LuxuryLoader />;
  }

  if (!customerToken) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="section-subheading text-forest-500 mb-3">MY ACCOUNT</p>

          <h1 className="font-luxury text-5xl text-forest-800 mb-2">
            Profile Settings
          </h1>

          <p className="font-sans text-sm text-cream-700">{customer?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AccountSidebar active="profile" onLogout={handleLogout} />

          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-300 p-8">
              <h2 className="font-luxury text-3xl text-forest-800 mb-8">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                      First Name
                    </label>

                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                      Last Name
                    </label>

                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  />

                  <p className="font-sans text-xs text-cream-600 mt-1">
                    If this email is already linked with another account, it
                    will not be updated.
                  </p>
                </div>

                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={formData.mobile}
                    disabled
                    className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-cream-600 bg-cream-100 cursor-not-allowed"
                  />

                  <p className="font-sans text-xs text-cream-600 mt-1">
                    Mobile number cannot be changed.
                  </p>
                </div>

                {message && (
                  <div
                    className={`px-4 py-3 font-sans text-sm ${
                      messageType === "success"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>

              <div className="mt-12 pt-12 border-t border-cream-300">
                <h3 className="font-luxury text-2xl text-forest-800 mb-4">
                  Change Password
                </h3>

                <p className="font-sans text-sm text-cream-700 mb-4">
                  For security reasons, changing your password requires WhatsApp
                  OTP verification.
                </p>

                <Link
                  href="/auth/forgot-password"
                  className="btn-outline inline-flex"
                >
                  REQUEST PASSWORD CHANGE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSidebar({ active, onLogout }) {
  const itemClass = (key) =>
    `flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors ${
      active === key
        ? "text-white bg-forest-700"
        : "text-forest-800 hover:bg-cream-100"
    }`;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white border border-cream-300 p-4 sm:p-6 overflow-x-auto lg:overflow-visible">
        <nav className="flex lg:block gap-2 lg:space-y-2 min-w-max lg:min-w-0">
          <Link href="/account/orders" className={itemClass("orders")}>
            <Package size={18} /> <span>My Orders</span>
          </Link>

          <Link href="/wishlist" className={itemClass("wishlist")}>
            <Heart size={18} /> <span>Wishlist</span>
          </Link>

          <Link href="/account/addresses" className={itemClass("addresses")}>
            <MapPin size={18} /> <span>Addresses</span>
          </Link>

          <Link href="/account/profile" className={itemClass("profile")}>
            <User size={18} /> <span>Profile</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex lg:w-full items-center gap-3 px-4 py-3 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}