"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getShipments, type Shipment } from "@/lib/logistics";

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

const filterOptions = ["All", "In Transit", "Delivered", "Created", "Shipped", "Cancelled"];

export default function AllShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchShipments = useCallback(() => {
    setLoading(true);
    setError(null);
    const statusParam = activeFilter === "All" ? undefined : activeFilter.replace(" ", "_").toUpperCase();
    getShipments({ status: statusParam, search: search || undefined })
      .then((res) => setShipments(res.shipments))
      .catch((err) => setError(err.message ?? "Failed to load shipments"))
      .finally(() => setLoading(false));
  }, [activeFilter, search]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">All Shipments</h1>
          <p className="text-[14px] text-[#6b6b6b] mt-1">View and manage all dispatch records</p>
        </div>
        <Link
          href="/logistics/shipments/new"
          className="h-[40px] px-5 text-[14px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors flex items-center"
        >
          + Create Shipment
        </Link>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setActiveFilter(opt)}
            className={`h-9 px-4 text-[13px] font-medium rounded-[6px] transition-colors ${
              activeFilter === opt
                ? "bg-[#0a0a0a] text-white font-semibold"
                : "bg-white border border-[#e6e6e6] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a]"
            }`}
          >
            {opt}
          </button>
        ))}
        <form onSubmit={handleSearchSubmit} className="ml-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search shipments..."
            className="h-9 px-4 text-[13px] bg-white border border-[#e6e6e6] rounded-[6px] outline-none focus:border-[#4caf50] w-[220px]"
          />
        </form>
      </div>

      <div className="bg-white border border-[#e6e6e6] rounded-[10px] overflow-hidden">
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
