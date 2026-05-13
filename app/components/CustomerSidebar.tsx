"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  User,
  MapPin,
  DollarSign,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/customer", label: "Overview", icon: Home },
  { href: "/customer/orders", label: "My Orders", icon: Package },
  { href: "/customer/profile", label: "Profile", icon: User },
  { href: "/customer/addresses", label: "Addresses", icon: MapPin },
  { href: "/customer/payment-methods", label: "Payment Methods", icon: DollarSign },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/customer") return pathname === "/customer";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-(--dark) min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="text-xl font-bold text-white">
          akwaaba<span className="text-(--primary)">.</span>
        </Link>
      </div>

      <div className="px-6 pb-5">
        <div className="w-12 h-12 rounded-full bg-(--primary) flex items-center justify-center text-white font-bold text-base mb-3">
          JM
        </div>
        <p className="text-white font-semibold text-sm">John Mensah</p>
        <p className="text-gray-400 text-xs mt-0.5">Customer</p>
      </div>

      <div className="border-t border-white/10 mx-6 mb-3" />

      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors border-l-[3px] ${
                active
                  ? "text-(--primary) border-(--primary)"
                  : "text-white/60 border-transparent hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6">
        <button className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
