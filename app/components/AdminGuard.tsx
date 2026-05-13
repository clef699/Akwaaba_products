"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

export function hasAdminAccess(roles: string[]): boolean {
  return roles.includes("admin") || roles.some((r) => r.startsWith("division_"));
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
    } else if (!hasAdminAccess(user.roles)) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
