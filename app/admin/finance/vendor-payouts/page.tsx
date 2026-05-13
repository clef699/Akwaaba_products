"use client";

import { useEffect, useState, useCallback } from "react";
import { getVendorPayouts, type VendorPayout } from "@/lib/admin";

function StatusBadge({ status }: { status: string }) {
  if (status === "PROCESSED") {
    return (
      <span className="px-3 py-1 bg-(--primary) text-white text-xs font-bold rounded-full">
        {status}
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
        {status}
      </span>
    );
  }
  return (
    <span className="px-3 py-1 border border-gray-400 text-gray-700 text-xs font-bold rounded-full">
      {status}
    </span>
  );
}

export default function VendorPayoutsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-05-01");

  const [payouts, setPayouts] = useState<VendorPayout[]>([]);
  const [totalPaidOut, setTotalPaidOut] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = useCallback(() => {
    setLoading(true);
    setError(null);
    getVendorPayouts({
      status: statusFilter !== "all" ? statusFilter : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
      .then((res) => {
        setPayouts(res.payouts);
        setTotalPaidOut(res.totalPaidOut);
        setTotalPending(res.totalPending);
      })
      .catch((err) => setError(err.message ?? "Failed to load payouts"))
      .finally(() => setLoading(false));
  }, [statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Vendor Payouts</h1>
          <p className="text-gray-500 text-sm">Weekly settlement to vendor bank accounts</p>
        </div>
        <button className="bg-(--primary) text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Process Payout
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="PROCESSED">Processed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        />
        <span className="text-gray-500 text-sm">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-6">Vendor</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">Period</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">Date Processed</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 animate-pulse">
                  Loading payouts…
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No payouts found.
                </td>
              </tr>
            ) : (
              payouts.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{p.vendor}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{p.period}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(p.dateProcessed)}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-sm font-semibold text-(--primary) hover:opacity-70 transition-opacity">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && (
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={3} className="py-4 px-6 text-sm font-bold text-gray-900">
                  Total Paid Out This Month{" "}
                  <span className="text-(--primary)">${totalPaidOut.toLocaleString()}</span>
                </td>
                <td colSpan={3} className="py-4 px-4 text-sm text-gray-600">
                  Total Pending{" "}
                  <span className="font-semibold text-gray-900 ml-0.5">
                    ${totalPending.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
