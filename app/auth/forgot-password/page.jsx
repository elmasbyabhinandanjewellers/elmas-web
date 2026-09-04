"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCustomer } from "@/context/CustomerContext";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const { forgotPassword, resetPassword, customerLoading } = useCustomer();

  const mobileFormik = useFormik({
    initialValues: {
      mobile: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    }),
    onSubmit: async (values, { setStatus }) => {
      setStatus("");
      setMessage("");

      try {
        await forgotPassword({ mobile: values.mobile });
        setMessage("OTP has been sent to your registered WhatsApp number.");
        setStep("otp");
      } catch (err) {
        setStatus(err?.message || "Failed to send OTP");
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{6}$/, "Please enter valid 6-digit OTP")
        .required("OTP is required"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
    }),
    onSubmit: async (values, { setStatus }) => {
      setStatus("");
      setMessage("");

      try {
        await resetPassword({
          mobile: mobileFormik.values.mobile,
          otp: values.otp,
          newPassword: values.newPassword,
        });

        setMessage("Password changed successfully. You can now sign in.");
        setStep("success");
      } catch (err) {
        setStatus(err?.message || "Failed to reset password");
      }
    },
  });

  const handleResendOtp = async () => {
    if (!mobileFormik.values.mobile) {
      otpFormik.setStatus(
        "Mobile number is missing. Please go back and enter mobile number."
      );
      return;
    }

    try {
      setResending(true);
      otpFormik.setStatus("");
      setMessage("");

      await forgotPassword({ mobile: mobileFormik.values.mobile });

      setMessage("A new OTP has been sent to your WhatsApp number.");
      otpFormik.setFieldValue("otp", "");
    } catch (err) {
      otpFormik.setStatus(err?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            ACCOUNT SECURITY
          </p>

          <h1 className="font-luxury text-5xl text-forest-800 mb-4">
            {step === "mobile" && "Reset Password"}
            {step === "otp" && "Verify OTP"}
            {step === "success" && "Password Updated"}
          </h1>

          <p className="font-sans text-sm text-cream-700">
            {step === "mobile" &&
              "Enter your registered mobile number and we’ll send you an OTP on WhatsApp."}

            {step === "otp" && (
              <>
                OTP sent to WhatsApp number{" "}
                <span className="text-forest-700 font-medium">
                  {mobileFormik.values.mobile}
                </span>
              </>
            )}

            {step === "success" &&
              "Your password has been updated successfully."}
          </p>
        </div>

        <div className="bg-white border border-cream-300 p-8">
          {step === "mobile" && (
            <form
              onSubmit={mobileFormik.handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobileFormik.values.mobile}
                  onChange={(e) =>
                    mobileFormik.setFieldValue(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  onBlur={mobileFormik.handleBlur}
                  className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  placeholder="9876543210"
                />

                {mobileFormik.touched.mobile && mobileFormik.errors.mobile && (
                  <p className="font-sans text-xs text-red-600 mt-1">
                    {mobileFormik.errors.mobile}
                  </p>
                )}
              </div>

              {mobileFormik.status && <ErrorBox error={mobileFormik.status} />}
              {message && <SuccessBox message={message} />}

              <button
                type="submit"
                disabled={customerLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {customerLoading ? "SENDING OTP..." : "SEND OTP"}
                {!customerLoading && <ArrowRight size={14} />}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={otpFormik.handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  Enter OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpFormik.values.otp}
                  onChange={(e) =>
                    otpFormik.setFieldValue(
                      "otp",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  onBlur={otpFormik.handleBlur}
                  className="w-full border border-cream-300 px-4 py-3 font-sans text-lg tracking-[0.4em] text-center text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                  placeholder="000000"
                />

                {otpFormik.touched.otp && otpFormik.errors.otp && (
                  <p className="font-sans text-xs text-red-600 mt-1">
                    {otpFormik.errors.otp}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending || customerLoading}
                  className="mt-3 font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "RESENDING OTP..." : "RESEND OTP"}
                </button>
              </div>

              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={otpFormik.values.newPassword}
                    onChange={otpFormik.handleChange}
                    onBlur={otpFormik.handleBlur}
                    className="w-full border border-cream-300 px-4 py-3 pr-10 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-600 hover:text-forest-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {otpFormik.touched.newPassword &&
                  otpFormik.errors.newPassword && (
                    <p className="font-sans text-xs text-red-600 mt-1">
                      {otpFormik.errors.newPassword}
                    </p>
                  )}

                <p className="font-sans text-xs text-cream-600 mt-1">
                  At least 8 characters
                </p>
              </div>

              {otpFormik.status && <ErrorBox error={otpFormik.status} />}
              {message && <SuccessBox message={message} />}

              <button
                type="submit"
                disabled={customerLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {customerLoading ? "RESETTING..." : "RESET PASSWORD"}
                {!customerLoading && <ArrowRight size={14} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("mobile");
                  setMessage("");
                  otpFormik.setStatus("");
                }}
                className="w-full font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700"
              >
                Change Mobile Number
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-6 text-center">
              <SuccessBox message={message} />

              <Link
                href="/auth/login"
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                SIGN IN NOW <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-cream-200 text-center">
            <Link
              href="/auth/login"
              className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700"
            >
              Back to Sign In
            </Link>
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

function ErrorBox({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-sans text-sm">
      {error}
    </div>
  );
}

function SuccessBox({ message }) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 font-sans text-sm">
      {message}
    </div>
  );
}