"use client";

interface BarChartProps {
  data?: number[];
  title?: string;
}

export default function BarChart({
  data = [480, 420, 510, 470, 550, 480, 600, 520, 480, 590, 650, 620, 580, 700, 640],
  title = "Orders Per Day",
}: BarChartProps) {
  const maxValue = Math.max(...data);
  const width = 100;
  const height = 280;
  const barWidth = width / data.length;
  const padding = 20;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="flex items-end justify-center gap-1 h-64">
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * 240;
          return (
            <div
              key={index}
              style={{ height: `${barHeight}px` }}
              className="bg-gray-900 rounded-t w-4 transition-all hover:opacity-80"
              title={`Day ${index + 1}: ${value} orders`}
            />
          );
        })}
      </div>
    </div>
  );
}
