"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { getLedger, type LedgerTransaction } from "@/lib/admin";

export default function LedgerPage() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-05-01");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = useCallback(() => {
    setLoading(true);
    setError(null);
    getLedger({
      page,
      search: search || undefined,
      type,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
      .then((res) => {
        setTransactions(res.transactions);
        setTotalCredits(res.totalCredits);
        setTotalDebits(res.totalDebits);
        setTotalPages(Math.max(1, Math.ceil(res.total / res.pageSize)));
      })
      .catch((err) => setError(err.message ?? "Failed to load ledger"))
      .finally(() => setLoading(false));
  }, [page, search, type, dateFrom, dateTo]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  useEffect(() => {
    setPage(1);
  }, [search, type, dateFrom, dateTo]);

  function formatAmount(tx: LedgerTransaction) {
    const abs = Math.abs(tx.amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return tx.positive ? `+ ${abs}` : `– ${abs}`;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Ledger</h1>
        <p className="text-gray-500 text-sm">Every credit and debit, by entry</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-(--primary)"
          />
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        />
        <span className="text-gray-400 text-sm">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <table className="w-full">
          <thead style={{ backgroundColor: "#111827" }}>
            <tr>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-6">ID</th>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-4">Date</th>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-4">Description</th>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-4">From Account</th>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-4">To Account</th>
              <th className="text-left text-xs font-bold text-(--primary) uppercase tracking-wider py-4 px-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 animate-pulse">
                  Loading transactions…
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{tx.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">{tx.date}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{tx.description}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{tx.from}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{tx.to}</td>
                  <td className={`py-4 px-4 text-sm font-semibold ${tx.positive ? "text-(--primary)" : "text-gray-900"}`}>
                    {formatAmount(tx)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && (
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={6} className="py-4 px-6 text-sm text-right">
                  <span className="text-gray-500 mr-2">Totals</span>
                  <span className="text-(--primary) font-bold">
                    + ${totalCredits.toLocaleString()}
                  </span>
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900 font-bold">
                    – ${totalDebits.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="flex justify-end items-center gap-1">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-40"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
              page === p
                ? "bg-(--primary) text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}
