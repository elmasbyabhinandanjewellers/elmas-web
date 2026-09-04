"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";

export default function RegisterPage() {
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { sendWebsiteRegisterOtp, verifyWebsiteRegisterOtp, customerLoading } =
    useCustomer();

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await sendWebsiteRegisterOtp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      setStep("otp");
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      return;
    }

    try {
      await verifyWebsiteRegisterOtp({
        email: formData.email,
        otp,
      });

      router.push("/account/profile");
    } catch (err) {
      setError(err?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            JOIN THE ATELIER
          </p>

          <h1 className="font-luxury text-5xl text-forest-800 mb-4">
            {step === "form" ? "Create Account" : "Verify OTP"}
          </h1>

          <p className="font-sans text-sm text-cream-700">
            {step === "form" ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-forest-600 hover:text-forest-700 underline"
                >
                  Sign in here
                </Link>
              </>
            ) : (
              <>
                OTP sent to WhatsApp number{" "}
                <span className="text-forest-700 font-medium">
                  {formData.mobile}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="bg-white border border-cream-300 p-8">
          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  placeholder="9876543210"
                />
              </div>

              <PasswordField
                label="Password"
                name="password"
                value={formData.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChange={handleChange}
                showToggle
              />

              <p className="font-sans text-xs text-cream-600 -mt-4">
                At least 8 characters
              </p>

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                showPassword={showPassword}
                onChange={handleChange}
              />

              {error && <ErrorBox error={error} />}

              <button
                type="submit"
                disabled={customerLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {customerLoading ? "SENDING OTP..." : "SEND OTP"}
                {!customerLoading && <ArrowRight size={14} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  Enter OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  className="w-full border border-cream-300 px-4 py-3 font-sans text-lg tracking-[0.4em] text-center text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  placeholder="000000"
                />
              </div>

              {error && <ErrorBox error={error} />}

              <button
                type="submit"
                disabled={customerLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {customerLoading ? "VERIFYING..." : "VERIFY & CREATE ACCOUNT"}
                {!customerLoading && <ArrowRight size={14} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setError("");
                }}
                className="w-full font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700"
              >
                Edit registration details
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-cream-200">
            <p className="font-sans text-xs text-cream-600 leading-relaxed text-center">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-cream-700 hover:text-forest-600 transition-colors"
          >
            <ArrowRight size={12} className="rotate-180" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  showPassword,
  setShowPassword,
  onChange,
  showToggle = false,
}) {
  return (
    <div>
      <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full border border-cream-300 px-4 py-3 pr-10 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
          placeholder="••••••••"
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-600 hover:text-forest-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorBox({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-sans text-sm">
      {error}
    </div>
  );
}