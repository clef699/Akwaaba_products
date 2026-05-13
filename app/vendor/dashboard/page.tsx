"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardStats, type VendorStats } from "@/lib/vendor";

const statusStyles: Record<string, string> = {
  Processing: "bg-[#efefef] text-[#555]",
  Shipped: "bg-[#0a0a0a] text-white",
  Delivered: "bg-[#4caf50] text-white",
  Cancelled: "border border-[#d1d1d1] text-[#3f3f3f]",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function VendorDashboardPage() {
  const [data, setData] = useState<VendorStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const stats = data
    ? [
        { emoji: "💵", label: "Total Revenue", value: fmt(data.totalRevenue), trend: `↑ ${data.revenueChange}%`, trendGreen: true },
        { emoji: "🛒", label: "Total Orders", value: data.totalOrders.toLocaleString(), trend: `↑ ${data.ordersChange}%`, trendGreen: true },
        { emoji: "📦", label: "Listed Products", value: String(data.listedProducts), trend: `${data.listedProducts} Active`, trendGreen: false },
        { emoji: "📊", label: "Avg. Order Value", value: fmt(data.avgOrderValue), trend: `↑ ${data.avgOrderChange}%`, trendGreen: true },
      ]
    : [];

  const barHeights = data?.revenueChart ?? [];

  return (
    <div className="p-9">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0a0a0a] leading-tight">Dashboard</h1>
          <p className="text-[13px] text-[#888] mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
            Export Report
          </button>
          <Link
            href="/vendor/products/new"
            className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-[#4caf50] rounded-[8px] hover:bg-[#43a047] transition-colors flex items-center"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          Failed to load dashboard: {error}
        </div>
      )}

      {!data && !error && (
        <div className="text-[13px] text-[#888] mb-8">Loading…</div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-7">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-[#efefef] rounded-[12px] p-5 h-[140px] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[20px]">{s.emoji}</span>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-[20px] ${s.trendGreen ? "bg-[#efefef] text-[#3d9140]" : "bg-[#f5f5f5] text-[#666]"}`}>
                    {s.trend}
                  </span>
                </div>
                <div>
                  <p className="text-[26px] font-bold text-[#0a0a0a] leading-tight">{s.value}</p>
                  <p className="text-[12px] text-[#888] mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white border border-[#efefef] rounded-[12px] p-6 h-[404px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-[#0a0a0a]">Revenue — Last 30 Days</h3>
                <div className="bg-[#efefef] rounded-[6px] px-3 h-8 flex items-center text-[12px] text-[#0a0a0a]">
                  Last 30 Days
                </div>
              </div>
              <div className="bg-[#f9f9f9] border border-dashed border-[#efefef] rounded-[8px] h-[180px] flex items-end px-4 py-3 gap-[9px]">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#4caf50] rounded-t-[4px] transition-all"
                    style={{ height: `${h}%`, opacity: h === Math.max(...barHeights) ? 0.9 : 0.15 }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px] text-[#888]">
                <span>Day 1</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
            </div>

            <div className="bg-white border border-[#efefef] rounded-[12px] p-6 h-[404px]">
              <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-5">Top Products</h3>
              <div className="space-y-0">
                {data.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-4 border-b border-[#f5f5f5] last:border-0">
                    <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${i === 0 ? "bg-[#4caf50] text-[#0a0a0a]" : "bg-[#0a0a0a] text-white"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#888]">{p.unitsSold} units sold</p>
                    </div>
                    <span className="text-[13px] font-bold text-[#3d9140]">{fmt(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#efefef]">
              <h3 className="text-[15px] font-bold text-[#0a0a0a]">Recent Orders</h3>
              <Link href="/vendor/orders" className="text-[13px] font-semibold text-[#4caf50] hover:underline">
                View all →
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
                  {["ORDER ID", "PRODUCT", "CUSTOMER", "AMOUNT", "STATUS"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-4 text-[14px] font-bold text-[#4caf50]">{o.id}</td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{o.product}</td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{o.customer}</td>
                    <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">{fmt(o.amount)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
