"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, ShieldCheck } from "lucide-react";

const divisions = [
  "Akwaaba Foods",
  "Secrets Springs",
  "Bliss Company",
  "Juno Shea",
  "Akwaaba Farms",
  "Sesi Oils",
];

export default function VendorLoginPage() {
  const router = useRouter();
  const [selectedDivision, setSelectedDivision] = useState("Akwaaba Foods");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "vendor_auth",
      JSON.stringify({ division: selectedDivision, email, loggedIn: true })
    );
    router.push("/vendor/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left — white card */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[440px] shadow-2xl">
          {/* Logo */}
          <div className="mb-5">
            <img src="/logo.png" alt="Akwaaba Products" className="h-16 w-auto" />
          </div>

          {/* Badge */}
          <span className="inline-block bg-[#4CAF50] text-white text-[11px] font-bold px-3 py-1.5 rounded-full tracking-widest mb-6">
            DIVISION STAFF PORTAL
          </span>

          {/* Heading */}
          <h1 className="text-[28px] font-bold text-[#0A0A0A] mb-1">Staff Sign In</h1>
          <p className="text-[#888] text-[13.5px] mb-6">
            Select your division and enter your credentials
          </p>

          {/* Division chips */}
          <div className="flex flex-wrap gap-2 mb-7">
            {divisions.map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  selectedDivision === div
                    ? "bg-[#4CAF50] text-white"
                    : "bg-[#f5f5f5] text-[#555] hover:bg-[#e8f5e9] hover:text-[#4CAF50]"
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#333] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@division.com"
                required
                className="w-full border border-[#e0e0e0] rounded-[10px] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder:text-[#bbb] focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#333] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-[#e0e0e0] rounded-[10px] px-4 py-3 pr-12 text-[14px] text-[#0A0A0A] placeholder:text-[#bbb] focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white font-semibold text-[14px] py-3.5 rounded-[10px] hover:bg-[#3d9140] transition-colors mt-2"
            >
              Sign In to Portal
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-5 flex items-start gap-2 bg-[#f9f9f9] rounded-[8px] px-3 py-2.5">
            <ShieldCheck size={14} className="text-[#4CAF50] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-[#888] leading-relaxed">
              This is a secure internal portal. Unauthorized access is strictly
              prohibited and monitored.
            </p>
          </div>
        </div>
      </div>

      {/* Right — dark panel */}
      <div className="flex-1 bg-[#111111] flex flex-col items-center justify-center p-12 border-l border-[#1a1a1a]">
        <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-6">
          <Leaf size={32} className="text-[#4CAF50]" />
        </div>

        <h2 className="text-[26px] font-bold text-white mb-2 text-center">
          Internal Division Portal
        </h2>
        <p className="text-[#555] text-[14px] mb-10 text-center max-w-xs">
          Secure access for division staff across all Akwaaba entities
        </p>

        <div className="w-full max-w-xs space-y-3">
          {divisions.map((div) => (
            <div
              key={div}
              className="flex items-center gap-3 bg-[#1a1a1a] rounded-[10px] px-4 py-3"
            >
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] flex-shrink-0" />
              <span className="text-[#ccc] text-[13.5px] font-medium">{div}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
