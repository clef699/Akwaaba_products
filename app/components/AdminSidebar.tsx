"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  User,
  LogOut,
  ChartNoAxesCombined,
  ChartSpline,
  Users,
  ShoppingCart,
  Settings,
  BookOpen,
  Wallet,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getStoredUser, logout, type User as AuthUser } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredRoles: string[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: Home, requiredRoles: [] },
  { href: "/admin/products", label: "Products", icon: Package, requiredRoles: ["admin", "division_catalog"] },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, requiredRoles: ["admin", "division_orders"] },
  { href: "/admin/users", label: "Users", icon: User, requiredRoles: ["admin"] },
  { href: "/admin/vendors", label: "Vendors", icon: Users, requiredRoles: ["admin"] },
  { href: "/admin/analytics", label: "Analytics", icon: ChartSpline, requiredRoles: [] },
];

const financeSubItems = [
  { href: "/admin/finance/overview", label: "Overview", icon: Users },
  { href: "/admin/finance/ledger", label: "Ledger", icon: BookOpen },
  { href: "/admin/finance/vendor-payouts", label: "Vendor Payouts", icon: Wallet },
  { href: "/admin/finance/ai-forecasts", label: "AI Forecasts", icon: Sparkles },
];

function canSee(requiredRoles: string[], userRoles: string[]): boolean {
  if (requiredRoles.length === 0) return true;
  return requiredRoles.some((r) => userRoles.includes(r));
}

function canSeeFinance(userRoles: string[]): boolean {
  return userRoles.includes("admin") || userRoles.includes("division_finance");
}

function roleLabel(roles: string[]): string {
  if (roles.includes("admin")) return "Administrator";
  const division = roles.find((r) => r.startsWith("division_"));
  if (division) return division.replace("division_", "").replace("_", " ") + " Division";
  return "Staff";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isFinanceActive = pathname.startsWith("/admin/finance");
  const [financeOpen, setFinanceOpen] = useState(isFinanceActive);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const userRoles = user?.roles ?? [];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="w-64 bg-(--dark) min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="px-6 pt-6 pb-4">
        <Link href="/">
          <img src="/logo.png" alt="Akwaaba Products" className="h-9 w-auto object-contain" />
        </Link>
      </div>

      <div className="px-6 pb-5">
        <div className="w-12 h-12 rounded-full bg-(--primary) flex items-center justify-center text-white font-bold text-base mb-3">
          {user ? initials(user.name) : "AK"}
        </div>
        <p className="text-white font-semibold text-sm">
          {user?.name ?? "Admin Console"}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          {user ? roleLabel(userRoles) : "Administrator"}
        </p>
      </div>

      <div className="border-t border-white/10 mx-6 mb-3" />

      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {navItems
          .filter((item) => canSee(item.requiredRoles, userRoles))
          .map((item) => {
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

        {canSeeFinance(userRoles) && (
          <>
            <button
              onClick={() => setFinanceOpen((o) => !o)}
              className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors border-l-[3px] w-full text-left ${
                isFinanceActive
                  ? "text-(--primary) border-(--primary)"
                  : "text-white/60 border-transparent hover:text-white"
              }`}
            >
              <ChartNoAxesCombined size={18} />
              <span className="flex-1">Finance</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${financeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {financeOpen && (
              <div className="flex flex-col gap-0.5 pl-4">
                {financeSubItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors border-l-[3px] ${
                        active
                          ? "text-(--primary) border-(--primary)"
                          : "text-white/60 border-transparent hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </nav>

      <div className="px-6 py-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors mb-3"
        >
          <LogOut size={18} />
          Logout
        </button>
        <button className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}
