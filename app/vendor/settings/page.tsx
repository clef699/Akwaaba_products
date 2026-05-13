"use client";

import { useState } from "react";

const navSections = ["Profile", "Notifications", "Security", "Division"];

export default function VendorSettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");

  return (
    <div className="p-9">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0a0a0a]">Account Settings</h1>
        <p className="text-[13px] text-[#888] mt-1">Manage your profile, notifications, and account preferences</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Nav */}
        <div className="w-[220px] flex-shrink-0 bg-white border border-[#efefef] rounded-[12px] p-3">
          {navSections.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`w-full text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                activeSection === s
                  ? "bg-[#efefef] text-[#0a0a0a] font-semibold"
                  : "text-[#888] hover:text-[#0a0a0a] hover:bg-[#f9f9f9]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Main Settings Panel */}
        <div className="flex-1 space-y-5">
          {/* Profile Picture */}
          <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-5">Profile Photo</h3>
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] rounded-full bg-[#4caf50] flex items-center justify-center text-[#0a0a0a] text-[28px] font-bold flex-shrink-0">
                AF
              </div>
              <div>
                <button className="h-[36px] px-4 text-[13px] font-semibold bg-[#4caf50] text-[#0a0a0a] rounded-[8px] hover:bg-[#43a047] transition-colors mr-3">
                  Upload Photo
                </button>
                <button className="h-[36px] px-4 text-[13px] text-[#888] hover:text-[#0a0a0a] transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-5">Personal Information</h3>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "First Name", placeholder: "Kofi", type: "text" },
                { label: "Last Name", placeholder: "Mensah", type: "text" },
                { label: "Email Address", placeholder: "kofi.mensah@akwaaba.com", type: "email" },
                { label: "Phone Number", placeholder: "+233 24 555 0100", type: "tel" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    defaultValue={f.placeholder}
                    className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button className="h-[39px] px-5 text-[13px] font-semibold bg-[#4caf50] text-[#0a0a0a] rounded-[8px] hover:bg-[#43a047] transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-5">Password</h3>
            <div className="space-y-4 max-w-md">
              {[
                { label: "Current Password", placeholder: "Enter current password" },
                { label: "New Password", placeholder: "Enter new password" },
                { label: "Confirm Password", placeholder: "Confirm new password" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">
                    {f.label}
                  </label>
                  <input
                    type="password"
                    placeholder={f.placeholder}
                    className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                  />
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#3d9140] cursor-pointer hover:underline">Forgot password?</span>
                <button className="h-[39px] px-5 text-[13px] font-semibold bg-[#4caf50] text-[#0a0a0a] rounded-[8px] hover:bg-[#43a047] transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-5">Notifications</h3>
            <div className="space-y-4">
              {[
                { label: "New Order Notifications", sub: "Get notified when a new order is placed" },
                { label: "Payout Alerts", sub: "Receive alerts when a payout is processed" },
                { label: "Low Stock Warnings", sub: "Alert when a product drops below 10 units" },
                { label: "Weekly Performance Report", sub: "Receive a weekly summary of your sales" },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-[#f5f5f5] last:border-0">
                  <div>
                    <p className="text-[14px] font-semibold text-[#0a0a0a]">{n.label}</p>
                    <p className="text-[12px] text-[#888]">{n.sub}</p>
                  </div>
                  <div className="w-10 h-6 bg-[#4caf50] rounded-full relative cursor-pointer flex-shrink-0">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
