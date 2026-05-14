"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { login } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
            Welcome back!
          </h3>
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            Sign in to your account
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter email"
                className="w-full border border-(--gray) rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />
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
                  placeholder="Password"
                  className="w-full border border-(--gray) rounded px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="shrink-0" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="button" className="text-(--primary) hover:underline">
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-(--primary) text-white py-3 rounded hover:bg-green-800 transition duration-300 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Login"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-(--primary) hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
