"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, PlusCircle, RefreshCw, LogOut } from "lucide-react";

const navItems = [
  { href: "/logistics/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/logistics/shipments", label: "All Shipments", icon: Package },
  { href: "/logistics/shipments/new", label: "Create Shipment", icon: PlusCircle },
  { href: "/logistics/update", label: "Update Status", icon: RefreshCw },
];

export default function LogisticsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0a0a] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 pt-10 pb-0">
        <div>
          <img src="/logo.png" alt="Akwaaba Products" className="h-9 w-auto object-contain" />
        </div>
      </div>

      {/* User */}
      <div className="border-b border-[#1c1c1c] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-[28px] bg-[#3f3f3f] border-2 border-[#4caf50] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[20px] font-bold">LO</span>
          </div>
          <div>
            <p className="text-white text-[15px] font-semibold">Logistics Ops</p>
            <p className="text-[#8a8a8a] text-[12px]">Dispatcher</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-0 py-3 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 mx-3 px-[19px] py-[11px] rounded-[6px] text-[14px] transition-colors border-l-[2.667px] ${
                active
                  ? "bg-[#0e0e0e] border-[#4caf50] text-[#4caf50] font-semibold"
                  : "border-transparent text-white font-medium hover:bg-[#0e0e0e]"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#1c1c1c] p-4">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-[6px] text-[14px] text-white hover:bg-[#1a1a1a] transition-colors">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
