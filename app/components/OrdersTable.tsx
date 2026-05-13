import Link from "next/link";

export interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

interface OrdersTableProps {
  orders?: Order[];
}

const statusStyles = {
  PROCESSING: "bg-gray-900 text-white",
  SHIPPED: "bg-gray-900 text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-700 bg-white",
};

export default function OrdersTable({
  orders = [
    {
      id: "#AKW-0418",
      customer: "Ama Asante",
      date: "May 1, 2026",
      items: 3,
      total: 397.0,
      status: "PROCESSING",
    },
    {
      id: "#AKW-0417",
      customer: "Kwame Boateng",
      date: "May 1, 2026",
      items: 6,
      total: 1240.0,
      status: "SHIPPED",
    },
    {
      id: "#AKW-0416",
      customer: "Naomi Osei",
      date: "Apr 30, 2026",
      items: 2,
      total: 178.0,
      status: "DELIVERED",
    },
    {
      id: "#AKW-0415",
      customer: "Yaw Owusu",
      date: "Apr 29, 2026",
      items: 4,
      total: 632.0,
      status: "DELIVERED",
    },
    {
      id: "#AKW-0414",
      customer: "Esi Amankwah",
      date: "Apr 29, 2026",
      items: 1,
      total: 89.0,
      status: "CANCELLED",
    },
    {
      id: "#AKW-0413",
      customer: "Kojo Tawiah",
      date: "Apr 28, 2026",
      items: 2,
      total: 245.0,
      status: "DELIVERED",
    },
    {
      id: "#AKW-0412",
      customer: "Adwoa Sarpong",
      date: "Apr 27, 2026",
      items: 5,
      total: 882.0,
      status: "SHIPPED",
    },
  ],
}: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Items
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-semibold text-gray-900">
                  {order.id}
                </td>
                <td className="py-4 px-6 text-gray-600">{order.customer}</td>
                <td className="py-4 px-6 text-gray-600">{order.date}</td>
                <td className="py-4 px-6 text-gray-600">{order.items}</td>
                <td className="py-4 px-6 font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="bg-(--primary) text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition inline-block"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
