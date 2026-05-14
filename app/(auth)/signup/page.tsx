"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { register } from "@/lib/auth";
import { type ApiError } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/customer");
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.details && Object.keys(apiErr.details).length > 0) {
        setFieldErrors(apiErr.details);
      }
      setError(apiErr.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-(--dark) min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-(--white) p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-2 py-3">
            <img src="/logo.png" alt="Akwaaba Products" className="h-9 w-auto object-contain" />
          </div>
          <h3 className="text-2xl sm:text-4xl font-semibold mb-2 py-4 text-center">
            Create Account
          </h3>
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            Join thousands of shoppers on Akwaaba
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-(--gray) rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                placeholder="John Doe"
              />
              {fieldErrors.name?.map((msg) => (
                <p key={msg} className="mt-1 text-xs text-red-600">{msg}</p>
              ))}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border border-(--gray) rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                placeholder="john.doe@example.com"
              />
              {fieldErrors.email?.map((msg) => (
                <p key={msg} className="mt-1 text-xs text-red-600">{msg}</p>
              ))}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full border border-(--gray) rounded px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--gray)"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password?.map((msg) => (
                <p key={msg} className="mt-1 text-xs text-red-600">{msg}</p>
              ))}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="w-full border border-(--gray) rounded px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--gray)"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.confirmPassword?.map((msg) => (
                <p key={msg} className="mt-1 text-xs text-red-600">{msg}</p>
              ))}
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 shrink-0"
                required
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-(--primary) hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-(--primary) text-white py-3 rounded hover:bg-green-800 transition duration-300 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-(--primary) hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
