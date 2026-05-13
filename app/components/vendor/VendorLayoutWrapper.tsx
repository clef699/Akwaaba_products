"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import VendorSidebar from "./Sidebar";

export default function VendorLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const isPublicPath = pathname === "/vendor/login";

  useEffect(() => {
    if (isPublicPath) {
      setAuthorized(true);
      return;
    }
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
    } else if (!user.roles.includes("vendor")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router, isPublicPath]);

  if (!authorized) return null;

  if (isPublicPath) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#fff8f2]">
      <VendorSidebar />
      <main className="flex-1 bg-white min-h-screen">{children}</main>
    </div>
  );
}
