"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import LogisticsSidebar from "@/app/components/logistics/Sidebar";

function hasLogisticsAccess(roles: string[]): boolean {
  return roles.includes("logistics_admin") || roles.includes("logistics_staff") || roles.includes("admin");
}

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
    } else if (!hasLogisticsAccess(user.roles)) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <LogisticsSidebar />
      <main className="flex-1 bg-[#fafafa] min-h-screen">{children}</main>
    </div>
  );
}
