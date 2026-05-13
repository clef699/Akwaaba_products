const stats = [
  { emoji: "💵", label: "Total Revenue", value: "$24,380", trend: "↑ 18.4%" },
  { emoji: "🛒", label: "Total Orders", value: "1,284", trend: "↑ 11.2%" },
  { emoji: "👁️", label: "Product Views", value: "18,920", trend: "↑ 24.6%" },
  { emoji: "🔄", label: "Conversion Rate", value: "6.8%", trend: "↑ 3.1%" },
];

const topProducts = [
  { rank: 1, name: "Akwaaba Fufu 750g", units: "412 units", revenue: "$3,684" },
  { rank: 2, name: "Akwaaba Palm Oil 1.5L", units: "380 units", revenue: "$4,940" },
  { rank: 3, name: "Jollof Spice 100g", units: "295 units", revenue: "$1,770" },
  { rank: 4, name: "Peanut Butter 750g", units: "210 units", revenue: "$1,890" },
  { rank: 5, name: "Cashew Nuts 750g", units: "188 units", revenue: "$2,818" },
];

const categories = [
  { name: "Staple Foods", pct: 78 },
  { name: "Cooking Oils", pct: 54 },
  { name: "Spices & Seasonings", pct: 38 },
  { name: "Nuts & Seeds", pct: 28 },
];

const keyMetrics = [
  { name: "Avg. Order Value", value: "$18.98", pct: 60 },
  { name: "Return Rate", value: "2.1%", pct: 5 },
  { name: "Customer Satisfaction", value: "4.6★", pct: 92 },
  { name: "Stock Turnover", value: "70%", pct: 70 },
];

const barHeights = [58, 46, 54, 34, 42, 26, 90, 30, 22, 38, 18, 90];

const periodOptions = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "This Year"];

export default function VendorAnalyticsPage() {
  return (
    <div className="p-9">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0a0a0a]">Analytics</h1>
          <p className="text-[13px] text-[#888] mt-1">Performance overview for Akwaaba Foods division</p>
        </div>
        <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
          Export Report
        </button>
      </div>

      {/* Period selector */}
      <div className="flex items-center bg-white border border-[#efefef] rounded-[8px] h-[43px] w-fit mb-7 px-1 gap-1">
        {periodOptions.map((opt) => (
          <button
            key={opt}
            className={`h-[35px] px-4 text-[12px] font-semibold rounded-[7px] transition-colors ${
              opt === "Last 30 Days"
                ? "bg-[#0a0a0a] text-white"
                : "text-[#888] hover:text-[#0a0a0a]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#efefef] rounded-[12px] p-5 h-[131px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[20px]">{s.emoji}</span>
              <span className="text-[11px] font-bold px-2 py-1 rounded-[20px] bg-[#efefef] text-[#3d9140]">
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[24px] font-bold text-[#0a0a0a]">{s.value}</p>
              <p className="text-[12px] text-[#888]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Revenue bar chart */}
        <div className="bg-white border border-[#efefef] rounded-[12px] p-6 h-[404px]">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-5">Revenue — Last 30 Days</h3>
          <div className="bg-[#f9f9f9] border border-dashed border-[#efefef] rounded-[8px] h-[200px] flex items-end px-4 py-3 gap-[9px]">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#4caf50] rounded-t-[4px]"
                style={{ height: `${h}%`, opacity: h === 90 ? 0.9 : 0.15 }}
              />
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-[#efefef] rounded-[12px] p-6 h-[404px]">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-4">Top Products</h3>
          <div>
            {topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3 py-3.5 border-b border-[#f5f5f5] last:border-0">
                <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${p.rank === 1 ? "bg-[#4caf50] text-[#0a0a0a]" : "bg-[#0a0a0a] text-white"}`}>
                  {p.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#888]">{p.units}</p>
                </div>
                <span className="text-[13px] font-bold text-[#3d9140]">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sales by Category */}
        <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-5">Sales by Category</h3>
          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#888]">{c.name}</span>
                  <span className="font-bold text-[#0a0a0a]">{c.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#efefef] rounded-full">
                  <div className="h-1.5 bg-[#4caf50] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white border border-[#efefef] rounded-[12px] p-6">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-5">Key Metrics</h3>
          <div className="space-y-4">
            {keyMetrics.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#888]">{m.name}</span>
                  <span className="font-bold text-[#0a0a0a]">{m.value}</span>
                </div>
                <div className="h-1.5 bg-[#efefef] rounded-full">
                  <div className="h-1.5 bg-[#4caf50] rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
