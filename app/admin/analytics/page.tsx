"use client";

import { useEffect, useState, useCallback } from "react";
import { DollarSign, Package, TrendingUp } from "lucide-react";
import DashboardMetricCard from "@/app/components/DashboardMetricCard";
import RevenueChart from "@/app/components/RevenueChart";
import BarChart from "@/app/components/BarChart";
import TopSellingProducts from "@/app/components/TopSellingProducts";
import TopVendors from "@/app/components/TopVendors";
import { getAnalytics, type AdminAnalytics } from "@/lib/admin";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "3 Months" },
  ];

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    setError(null);
    getAnalytics(period)
      .then(setData)
      .catch((err) => setError(err.message ?? "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const metrics = data
    ? [
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: `$${(data.totalRevenue / 1_000_000).toFixed(2)}M`,
          change: data.totalRevenueChange,
        },
        {
          icon: Package,
          label: "Total Orders",
          value: data.totalOrders.toLocaleString(),
          change: data.totalOrdersChange,
        },
        {
          icon: TrendingUp,
          label: "Avg. Order Value",
          value: `$${data.avgOrderValue.toFixed(2)}`,
          change: data.avgOrderValueChange,
        },
      ]
    : [];

  const topProducts = data?.topProducts.map((p) => ({
    name: p.name,
    units: p.unitsSold,
    revenue: p.revenue,
  }));

  const topVendors = data?.topVendors.map((v) => ({
    name: v.name,
    totalSales: v.revenue,
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-600">Marketplace performance insights</p>
        </div>

        <div className="flex items-center gap-3">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded font-semibold transition ${
                period === p.value
                  ? "bg-(--primary) text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button className="bg-(--primary) text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition">
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={data?.revenueChart} />
        <BarChart
          data={data?.categoryChart.map((c) => c.value)}
          title="Orders by Category"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts products={topProducts} />
        <TopVendors vendors={topVendors} />
      </div>
    </div>
  );
}
