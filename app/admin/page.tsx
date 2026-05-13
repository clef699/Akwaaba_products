"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, Users, UserCheck } from "lucide-react";
import DashboardMetricCard from "@/app/components/DashboardMetricCard";
import RevenueChart from "@/app/components/RevenueChart";
import RecentOrders from "@/app/components/RecentOrders";
import TopProducts from "@/app/components/TopProducts";
import { getAdminStats, type AdminStats } from "@/lib/admin";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message ?? "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats
    ? [
        { icon: DollarSign, label: "Total Revenue", value: `$${(stats.totalRevenue / 1_000_000).toFixed(1)}M`, change: stats.totalRevenueChange },
        { icon: Package, label: "Total Orders", value: stats.totalOrders.toLocaleString(), change: stats.totalOrdersChange },
        { icon: Users, label: "Total Users", value: stats.totalUsers.toLocaleString(), change: stats.totalUsersChange },
        { icon: UserCheck, label: "Active Vendors", value: stats.activeVendors.toLocaleString(), change: stats.activeVendorsChange },
      ]
    : [];

  const recentOrders = stats?.recentOrders.map((o) => ({
    id: o.id,
    customer: o.customer,
    amount: o.amount,
    status: o.status.toUpperCase() as "PROCESSING" | "DELIVERED" | "CANCELLED",
  }));

  const topProducts = stats?.topProducts.map((p) => ({
    name: p.name,
    vendor: p.vendor,
    unitsSold: p.unitsSold,
    revenue: p.revenue,
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
          <p className="text-gray-600">Marketplace performance at a glance</p>
        </div>
        <p className="text-gray-600 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <DashboardMetricCard
              key={index}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              change={metric.change}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={stats?.revenueChart} />
        </div>
        <div>
          <RecentOrders orders={recentOrders} />
        </div>
      </div>

      <TopProducts products={topProducts} />
    </div>
  );
}
