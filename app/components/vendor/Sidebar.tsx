"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  PlusCircle,
  ClipboardList,
  TrendingUp,
  Settings,
  Truck,
  LogOut,
} from "lucide-react";

const mainNav = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/products", label: "My Products", icon: Package },
  { href: "/vendor/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/vendor/payout", label: "Payouts", icon: DollarSign },
];

const manageNav = [
  { href: "/vendor/products/new", label: "Add Product", icon: PlusCircle },
  { href: "/vendor/products/stock", label: "Stock & Variants", icon: ClipboardList },
  { href: "/vendor/analytics", label: "Analytics", icon: TrendingUp },
];

const accountNav = [
  { href: "/vendor/settings", label: "Settings", icon: Settings },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleSignOut = () => {
    localStorage.removeItem("vendor_auth");
    router.push("/vendor/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0a0a] flex flex-col flex-shrink-0">
      {/* Logo + Division */}
      <div className="border-b border-[#1c1c1c] pb-4 px-6 pt-10">
        <div className="mb-4">
          <img src="/logo.png" alt="Akwaaba Products" className="h-14 w-auto object-contain" />
        </div>
        <div className="bg-[#1a1a1a] rounded-[8px] px-3 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4caf50] flex-shrink-0" />
          <div>
            <p className="text-[#ccc] text-[10px] font-medium">Active Division</p>
            <p className="text-white text-[13px] font-semibold leading-tight">Akwaaba Foods</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-[#555] text-[10px] font-semibold uppercase tracking-[1.2px] px-2 mb-2">
          Main
        </p>
        {mainNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-colors ${
              isActive(href)
                ? "bg-[#4caf50] text-[#0a0a0a] font-bold"
                : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <p className="text-[#555] text-[10px] font-semibold uppercase tracking-[1.2px] px-2 mt-5 mb-2">
          Manage
        </p>
        {manageNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-colors ${
              isActive(href)
                ? "bg-[#4caf50] text-[#0a0a0a] font-bold"
                : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <p className="text-[#555] text-[10px] font-semibold uppercase tracking-[1.2px] px-2 mt-5 mb-2">
          Account
        </p>
        {accountNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-colors ${
              isActive(href)
                ? "bg-[#4caf50] text-[#0a0a0a] font-bold"
                : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <p className="text-[#555] text-[10px] font-semibold uppercase tracking-[1.2px] px-2 mt-5 mb-2">
          Logistics Overview
        </p>
        <Link
          href="/logistics/overview"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium text-[#aaa] hover:text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <Truck size={16} />
          Logistics
        </Link>
      </nav>

      {/* User card + sign out */}
      <div className="border-t border-[#1c1c1c] p-4 space-y-2">
        <div className="bg-[#1a1a1a] rounded-[8px] px-3 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[18px] bg-[#4caf50] flex items-center justify-center flex-shrink-0">
            <span className="text-[#0a0a0a] text-[14px] font-bold">AF</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[12px] font-semibold truncate">Kofi Mensah</p>
            <p className="text-[#888] text-[11px] truncate">Akwaaba Foods Staff</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] text-[#aaa] hover:text-white hover:bg-[#1a1a1a] transition-colors border border-[#2a2a2a]"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
