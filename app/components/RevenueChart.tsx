"use client";

interface RevenueChartProps {
  data?: number[];
}

export default function RevenueChart({ data = [30, 35, 32, 40, 45, 42, 50, 55, 52, 58, 62, 65, 68, 72, 70, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110] }: RevenueChartProps) {
  const width = 600;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Revenue This Month</h3>
        <select className="text-sm border border-gray-300 rounded px-3 py-2 bg-white">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 60 days</option>
        </select>
      </div>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(76, 175, 80, 0.1)" />
            <stop offset="100%" stopColor="rgba(76, 175, 80, 0)" />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <path
          d={pathD}
          stroke="rgb(76, 175, 80)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="rgb(76, 175, 80)"
          />
        ))}
      </svg>
    </div>
  );
}
