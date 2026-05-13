"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getAIForecast, type AIForecastResult } from "@/lib/admin";

const W = 800, H = 260, PX = 10, PY = 20;

function ForecastChart({ data }: { data: number[] }) {
  const maxVal = Math.max(...data) * 1.05;
  const minVal = Math.min(...data) * 0.92;
  const range = maxVal - minVal;
  const chartW = W - PX * 2;
  const chartH = H - PY * 2;

  const points = data.map((v, i) => ({
    x: PX + (i / (data.length - 1)) * chartW,
    y: H - PY - ((v - minVal) / range) * chartH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - PY} L ${points[0].x.toFixed(1)} ${H - PY} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id="forecastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(76,175,80,0.18)" />
          <stop offset="100%" stopColor="rgba(76,175,80,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#forecastGrad)" />
      <path d={linePath} stroke="#4caf50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4caf50" />
      ))}
    </svg>
  );
}

export default function AIForecastsPage() {
  const [productId, setProductId] = useState("PROD-AKW-1042");
  const [result, setResult] = useState<AIForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRunForecast() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getAIForecast(productId.trim());
      setResult(data);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Forecast request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">AI Demand Forecast</h1>
          <span className="flex items-center gap-1.5 bg-(--light-primary) text-(--primary) text-xs font-bold px-3 py-1.5 rounded-full">
            <Sparkles size={12} />
            AI POWERED
          </span>
        </div>
        <p className="text-gray-500 text-sm max-w-2xl">
          Enter a product ID below to generate a 30-day demand prediction based on historical sales
          data, seasonality, and current trend signals across the marketplace.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Product ID</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="e.g. PROD-AKW-1042"
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-(--primary) w-72"
          />
          <button
            onClick={handleRunForecast}
            disabled={loading || !productId.trim()}
            className="bg-(--primary) text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Running…" : "Run Forecast"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">30-Day Demand Forecast</h2>
                <p className="text-sm text-gray-500">
                  Product:{" "}
                  <span className="font-semibold text-gray-900">{result.productName}</span>
                  <span className="mx-1.5">·</span>
                  <span className="font-semibold text-gray-900">{result.productId}</span>
                  <span className="mx-1.5">·</span>
                  Confidence {result.confidence}%
                </p>
              </div>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Export as CSV
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Predicted Total</p>
                <p className="text-2xl font-bold text-(--primary)">{result.predictedTotal.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">{result.dailyAverage.toFixed(1)} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Peak Day</p>
                <p className="text-2xl font-bold text-gray-900">{result.peakDay}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Trend</p>
                <p className="text-2xl font-bold text-(--primary)">
                  {result.trendPercent >= 0 ? "↑" : "↓"} {Math.abs(result.trendPercent).toFixed(1)}%
                </p>
              </div>
            </div>

            <ForecastChart data={result.chartData} />
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Daily Forecast
            </h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Day</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Predicted Units</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.dailyForecast.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{row.date}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{row.day}</td>
                    <td className="py-3.5 px-4 text-sm font-bold text-gray-900">{row.units} units</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{row.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
