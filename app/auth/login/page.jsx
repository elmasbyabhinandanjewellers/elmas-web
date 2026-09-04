"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";

function LoginPageContent() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const { loginCustomer, customerLoading, customerToken } = useCustomer();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginCustomer({ mobile, password });

      const redirectTo = searchParams.get("redirect") || "/cart";
      router.push(redirectTo);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const redirectTo = searchParams.get("redirect") || "/cart";

    if (customerToken) {
      router.replace(redirectTo);
    }
  }, [customerToken, router, searchParams]);

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            WELCOME BACK
          </p>

          <h1 className="font-luxury text-5xl text-forest-800 mb-4">Sign In</h1>

          <p className="font-sans text-sm text-cream-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-forest-600 hover:text-forest-700 underline"
            >
              Create one here
            </Link>
          </p>
        </div>

        <div className="bg-white border border-cream-300 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                required
                minLength={10}
                maxLength={10}
                className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 transition-colors"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-sans text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={customerLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {customerLoading ? "SIGNING IN..." : "SIGN IN"}
              {!customerLoading && <ArrowRight size={14} />}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => router.push("/checkout?guest=true")}
              className="w-full border border-forest-700 py-3 font-sans text-xs tracking-widest uppercase text-forest-700 hover:bg-forest-700 hover:text-white transition-colors"
            >
              Continue As Guest
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-cream-200 text-center">
            <Link
              href="/auth/forgot-password"
              className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700"
            >
              Forgot Password?
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
