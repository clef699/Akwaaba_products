interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "PROCESSING" | "DELIVERED" | "CANCELLED";
}

interface RecentOrdersProps {
  orders?: Order[];
}

const statusStyles = {
  PROCESSING: "bg-gray-900 text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-700",
};

export default function RecentOrders({
  orders = [
    { id: "#AKW-0418", customer: "Ama Asante", amount: 397, status: "PROCESSING" },
    { id: "#AKW-0417", customer: "Kwame Boateng", amount: 1240, status: "PROCESSING" },
    { id: "#AKW-0416", customer: "Naomi Osei", amount: 178, status: "DELIVERED" },
    { id: "#AKW-0415", customer: "Yaw Owusu", amount: 632, status: "DELIVERED" },
    { id: "#AKW-0414", customer: "Esi Amankwah", amount: 89, status: "CANCELLED" },
  ],
}: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">
                {order.customer} - ${order.amount}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
