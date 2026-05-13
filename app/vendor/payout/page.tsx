"use client";

import { useEffect, useState } from "react";
import { getPayouts, requestPayout, type VendorPayout, type VendorPayoutSummary } from "@/lib/vendor";

const statusStyles: Record<string, string> = {
  Completed: "bg-[#4caf50] text-white",
  Pending: "bg-[#efefef] text-[#555]",
  Processing: "bg-[#0a0a0a] text-white",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function VendorPayoutPage() {
  const [data, setData] = useState<VendorPayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    getPayouts()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleRequestPayout() {
    setRequesting(true);
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await requestPayout();
      setSuccessMsg(res.message ?? "Payout request submitted successfully.");
      const refreshed = await getPayouts();
      setData(refreshed);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRequesting(false);
    }
  }

  const summary = data
    ? [
        { label: "Total Earnings", value: fmt(data.totalEarnings), sub: "" },
        { label: "Pending Payout", value: fmt(data.pendingPayout), sub: "Processing" },
        { label: "Platform Fee", value: fmt(data.platformFee), sub: "5% of gross sales" },
        { label: "Net Paid Out", value: fmt(data.netPaidOut), sub: "" },
      ]
    : [];

  const hasPending = data?.payouts.some((p) => p.status === "Pending");

  return (
    <div className="p-9">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0a0a0a]">Payouts</h1>
          <p className="text-[13px] text-[#888] mt-1">Track your division earnings and payout history</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPending && (
            <button
              onClick={handleRequestPayout}
              disabled={requesting}
              className="h-[39px] px-4 text-[13px] font-semibold text-white bg-[#0a0a0a] rounded-[8px] hover:bg-[#222] transition-colors disabled:opacity-60"
            >
              {requesting ? "Requesting…" : "Request Payout"}
            </button>
          )}
          <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-5 px-4 py-3 rounded-[8px] bg-green-50 border border-green-200 text-green-700 text-[13px]">
          {successMsg}
        </div>
      )}

      {loading && <div className="text-[13px] text-[#888] mb-8">Loading…</div>}

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-7">
            {summary.map((s) => (
              <div key={s.label} className="bg-white border border-[#efefef] rounded-[12px] p-5">
                <p className="text-[12px] text-[#888] mb-2">{s.label}</p>
                <p className="text-[26px] font-bold text-[#0a0a0a]">{s.value}</p>
                {s.sub && <p className="text-[11px] text-[#3d9140] font-bold mt-1">{s.sub}</p>}
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#efefef]">
              <h3 className="text-[15px] font-bold text-[#0a0a0a]">Payout History</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
                  {["PAYOUT ID", "PERIOD", "ORDERS", "GROSS SALES", "FEE (5%)", "NET PAYOUT", "STATUS"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#888]">No payout history yet.</td>
                  </tr>
                ) : (
                  data.payouts.map((p: VendorPayout) => (
                    <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                      <td className="px-5 py-4 text-[14px] font-bold text-[#4caf50]">{p.id}</td>
                      <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{p.period}</td>
                      <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{p.orders}</td>
                      <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">{fmt(p.gross)}</td>
                      <td className="px-5 py-4 text-[14px] text-[#888]">{fmt(p.fee)}</td>
                      <td className="px-5 py-4 text-[14px] font-bold text-[#3d9140]">{fmt(p.net)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[p.status] ?? ""}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
