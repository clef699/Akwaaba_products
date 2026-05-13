"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import CustomerSidebar from "./CustomerSidebar";

export default function CustomerGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen">
      <CustomerSidebar />
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
