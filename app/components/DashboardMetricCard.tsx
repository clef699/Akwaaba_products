import { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
}

export default function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  change,
}: DashboardMetricCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{value}</h3>
          <p className="text-sm text-(--primary) font-medium">
            ↑ {change.toFixed(1)}% vs last month
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <Icon size={24} className="text-(--primary)" />
        </div>
      </div>
    </div>
  );
}
