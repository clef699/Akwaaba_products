"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, type VendorOrder, type VendorOrdersStats } from "@/lib/vendor";

const statusStyles: Record<string, string> = {
  Processing: "bg-[#efefef] text-[#555]",
  Shipped: "bg-[#0a0a0a] text-white",
  Delivered: "bg-[#4caf50] text-white",
  Cancelled: "border border-[#d1d1d1] text-[#3f3f3f]",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [stats, setStats] = useState<VendorOrdersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(({ stats, orders }) => {
        setStats(stats);
        setOrders(orders);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), sub: "" },
        { label: "Processing", value: String(stats.processing), sub: "Awaiting fulfillment" },
        { label: "Shipped", value: String(stats.shipped), sub: "In transit" },
        { label: "Delivered", value: String(stats.delivered), sub: `${Math.round((stats.delivered / stats.totalOrders) * 100)}% rate` },
      ]
    : [];

  return (
    <div className="p-9">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0a0a0a]">My Orders</h1>
          <p className="text-[13px] text-[#888] mt-1">Track and manage customer orders</p>
        </div>
        <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
          Export Orders
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          Failed to load orders: {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-7">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-[#efefef] rounded-[12px] p-5">
              <p className="text-[12px] text-[#888] mb-2">{s.label}</p>
              <p className="text-[26px] font-bold text-[#0a0a0a]">{s.value}</p>
              {s.sub && <p className="text-[11px] text-[#3d9140] font-bold mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#efefef]">
          <h3 className="text-[15px] font-bold text-[#0a0a0a]">All Orders</h3>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-[13px] text-[#888]">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
                {["ORDER ID", "PRODUCT", "CUSTOMER", "DATE", "AMOUNT", "STATUS", ""].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#888]">No orders yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-4 text-[14px] font-bold text-[#4caf50]">{o.id}</td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{o.product}</td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{o.customer}</td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{o.date}</td>
                    <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">${o.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/vendor/orders/${o.id}`}
                        className="text-[13px] font-semibold text-[#4caf50] hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
