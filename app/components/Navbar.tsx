"use client";

import Link from "next/link";
import { ShoppingCartIcon, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout, type User as AuthUser } from "@/lib/auth";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setUser(null);
    router.push("/");
    setLoggingOut(false);
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-(--dark) text-white">
      <div className="flex items-center justify-between px-6 sm:px-12 lg:px-20 h-16">
        <Link href="/">
          <img src="/logo.png" alt="Akwaaba Products" className="h-16 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex space-x-4 items-center text-sm">
          <Link href="/shop" className="hover:text-(--primary)">
            Shop
          </Link>

          {user ? (
            <>
              <Link
                href="/customer/orders"
                className="flex items-center gap-1.5 hover:text-(--primary)"
              >
                <User className="w-4 h-4" />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 hover:text-(--primary) disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-(--primary)">
              Login
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center bg-(--primary) px-3 py-1.5 rounded-sm"
          >
            <ShoppingCartIcon className="w-3 h-3 mr-1" />
            Cart{" "}
            <span className="bg-white text-(--dark) h-5 w-5 text-center ml-2 rounded-full">
              {itemCount}
            </span>
          </Link>
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <Link
            href="/cart"
            className="flex items-center bg-(--primary) px-2 py-1.5 rounded-sm"
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </Link>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="sm:hidden bg-(--dark) border-t border-white/10 px-6 pb-4 pt-3 flex flex-col gap-4 text-sm">
          <Link
            href="/shop"
            className="hover:text-(--primary)"
            onClick={() => setOpen(false)}
          >
            Shop
          </Link>

          {user ? (
            <>
              <Link
                href="/customer/orders"
                className="flex items-center gap-1.5 hover:text-(--primary)"
                onClick={() => setOpen(false)}
              >
                <User className="w-4 h-4" />
                {user.name}
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1.5 hover:text-(--primary) text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-(--primary)"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
