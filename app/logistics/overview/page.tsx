"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLogisticsOverview, type LogisticsOverview, type Shipment } from "@/lib/logistics";

const statusStyles: Record<string, string> = {
  "IN_TRANSIT": "bg-[#0a0a0a] text-white",
  "CREATED": "bg-[#f4f4f4] text-[#3f3f3f]",
  "DELIVERED": "bg-[#4caf50] text-white",
  "CANCELLED": "border border-[#d1d1d1] text-[#3f3f3f]",
  "SHIPPED": "bg-[#0a0a0a] text-white",
};

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function LogisticsOverviewPage() {
  const [data, setData] = useState<LogisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLogisticsOverview()
      .then(setData)
      .catch((err) => setError(err.message ?? "Failed to load overview"))
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { label: "Total Shipments", value: data.stats.total.toLocaleString(), sub: "Lifetime" },
        { label: "Delivered", value: data.stats.delivered.toLocaleString(), sub: `${data.stats.total ? Math.round((data.stats.delivered / data.stats.total) * 100) : 0}%` },
        { label: "In Transit", value: data.stats.inTransit.toLocaleString(), sub: "Active" },
        { label: "Pending", value: data.stats.pending.toLocaleString(), sub: "Awaiting dispatch" },
      ]
    : [];

  const shipments: Shipment[] = data?.recentShipments ?? [];

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">Logistics Overview</h1>
        </div>
        <p className="text-[14px] text-[#6b6b6b]">Active shipments and dispatch status</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-7">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e6e6e6] rounded-[10px] p-5 h-36 animate-pulse" />
            ))
          : stats.map((s) => (
              <div key={s.label} className="bg-white border border-[#e6e6e6] rounded-[10px] p-5">
                <div className="w-9 h-9 rounded-[8px] bg-[#e8f5e9] flex items-center justify-center mb-4">
                  <span className="text-[16px]">📦</span>
                </div>
                <p className="text-[13px] text-[#6b6b6b] mb-1">{s.label}</p>
                <p className="text-[30px] font-extrabold text-[#0a0a0a] tracking-[-0.5px] leading-tight">{s.value}</p>
                <p className="text-[12px] font-semibold mt-1 text-[#6b6b6b]">{s.sub}</p>
              </div>
            ))}
      </div>

      {/* Recent Shipments */}
      <div className="bg-white border border-[#e6e6e6] rounded-[10px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-[16px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">Recent Shipments</h3>
          <Link href="/logistics/shipments" className="text-[13px] font-semibold text-[#4caf50] hover:underline">
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
              {["SHIPMENT ID", "ADDRESS", "ORDER REF", "DATE", "STATUS", "ACTION"].map((h) => (
                <th key={h} className="text-left px-[18px] py-3 text-[12px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-[18px] py-10 text-center text-[14px] text-[#6b6b6b] animate-pulse">
                  Loading shipments…
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-[18px] py-10 text-center text-[14px] text-[#6b6b6b]">
                  No shipments found.
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="border-b border-[#f4f4f4] hover:bg-[#fafafa] transition-colors">
                  <td className="px-[18px] py-[17px] text-[14px] font-bold text-[#0a0a0a]">{s.id}</td>
                  <td className="px-[18px] py-[17px] text-[14px] text-[#0a0a0a]">
                    {[s.address.street, s.address.city].filter(Boolean).join(", ")}
                  </td>
                  <td className="px-[18px] py-[17px] text-[14px] font-bold text-[#4caf50]">{s.orderRef}</td>
                  <td className="px-[18px] py-[17px] text-[14px] text-[#0a0a0a]">{formatDate(s.createdAt)}</td>
                  <td className="px-[18px] py-[17px]">
                    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[s.status.toUpperCase()] ?? "bg-gray-100 text-gray-600"}`}>
                      {formatStatus(s.status)}
                    </span>
                  </td>
                  <td className="px-[18px] py-[17px]">
                    <Link
                      href={`/logistics/shipments/${s.id}`}
                      className="inline-flex items-center px-4 py-2 text-[13px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
