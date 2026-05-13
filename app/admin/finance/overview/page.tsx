"use client";

import { useEffect, useState, useCallback } from "react";
import { DollarSign, Package, TrendingUp } from "lucide-react";
import { getFinanceOverview, type FinanceOverview } from "@/lib/admin";

const W = 700, H = 260, PX = 10, PY = 20;

function buildPath(data: number[], maxVal: number): string {
  const chartW = W - PX * 2;
  const chartH = H - PY * 2;
  return data
    .map((v, i) => {
      const x = PX + (i / (data.length - 1)) * chartW;
      const y = H - PY - (v / maxVal) * chartH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function FinanceOverviewPage() {
  const [period, setPeriod] = useState("30");
  const [data, setData] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(() => {
    setLoading(true);
    setError(null);
    getFinanceOverview(period)
      .then(setData)
      .catch((err) => setError(err.message ?? "Failed to load finance overview"))
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const revPath = data && data.revenueChart.length > 1
    ? buildPath(data.revenueChart, Math.max(...data.revenueChart, ...data.expensesChart) * 1.05)
    : "";
  const expPath = data && data.expensesChart.length > 1
    ? buildPath(data.expensesChart, Math.max(...data.revenueChart, ...data.expensesChart) * 1.05)
    : "";

  const gridYs = [0.15, 0.38, 0.6, 0.82].map((pct) => PY + pct * (H - PY * 2));

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Finance Overview</h1>
          <p className="text-gray-500 text-sm">Revenue, expenses, and net performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none"
          >
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">This year</option>
          </select>
          <button className="bg-(--primary) text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
                <DollarSign size={20} className="text-(--primary)" />
              </div>
              <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-(--primary) mb-2">
                ${data.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-(--primary) font-medium">
                {data.totalRevenueChange >= 0 ? "↑" : "↓"} {Math.abs(data.totalRevenueChange).toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
                <Package size={20} className="text-(--primary)" />
              </div>
              <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                ${data.totalExpenses.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{data.expensesRatio.toFixed(1)}% of revenue</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={20} className="text-(--primary)" />
              </div>
              <p className="text-gray-500 text-sm mb-1">Net Profit</p>
              <p className="text-3xl font-bold text-(--primary) mb-2">
                ${data.netProfit.toLocaleString()}
              </p>
              <p className="text-sm text-(--primary) font-medium">
                {data.netProfitChange >= 0 ? "↑" : "↓"} {Math.abs(data.netProfitChange).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Revenue vs Expenses</h2>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-0.5 bg-(--primary) inline-block rounded" />
                  Revenue
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-0.5 bg-gray-900 inline-block rounded" />
                  Expenses
                </span>
              </div>
            </div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              {gridYs.map((y, i) => (
                <line key={i} x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
              ))}
              <path d={revPath} stroke="#4caf50" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={expPath} stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Description</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentTransactions.map((tx, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3.5 px-6 text-sm text-gray-700">{tx.description}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 whitespace-nowrap">{tx.date}</td>
                      <td className={`py-3.5 px-4 text-sm font-semibold whitespace-nowrap ${tx.positive ? "text-(--primary)" : "text-gray-900"}`}>
                        {tx.positive ? "+" : "–"} ${Math.abs(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Top Products by Revenue</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Product</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{p.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">${p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
