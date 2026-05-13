"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, DollarSign, MapPin } from "lucide-react";
import { getOrders, type Order } from "@/lib/orders";
import { getMe, getStoredUser, type User } from "@/lib/auth";

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-black text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-600",
  SHIPPED: "bg-gray-700 text-white",
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase();
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[key] ?? "bg-gray-100 text-gray-600"}`}
    >
      {key}
    </span>
  );
}

export default function CustomerOverviewPage() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingOrders(true);
    getOrders()
      .then(setOrders)
      .catch((err) => setOrdersError(err.message ?? "Failed to load orders"))
      .finally(() => setLoadingOrders(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const totalSpent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const recentOrders = orders.slice(0, 4);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--dark)">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here&apos;s a snapshot of your account today
          </p>
        </div>
        <p className="text-gray-400 text-sm">{formattedDate}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
            <Box size={20} className="text-(--primary)" />
          </div>
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-4xl font-bold text-(--dark) mt-1">
            {loadingOrders ? "—" : orders.length}
          </p>
          <p className="text-(--primary) text-sm mt-2">Lifetime orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
            <DollarSign size={20} className="text-(--primary)" />
          </div>
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-4xl font-bold text-(--dark) mt-1">
            {loadingOrders ? "—" : `$${totalSpent.toLocaleString()}`}
          </p>
          <p className="text-(--primary) text-sm mt-2">Across all orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-(--light-primary) rounded-lg flex items-center justify-center mb-4">
            <MapPin size={20} className="text-(--primary)" />
          </div>
          <p className="text-gray-500 text-sm">Account</p>
          <p className="text-4xl font-bold text-(--dark) mt-1">
            {user ? "Active" : "—"}
          </p>
          <p className="text-gray-400 text-sm mt-2">{user?.email ?? ""}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-(--dark)">Recent Orders</h2>
          <Link
            href="/customer/orders"
            className="text-(--primary) text-sm flex items-center gap-1 hover:underline"
          >
            View all →
          </Link>
        </div>

        {ordersError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {ordersError}
          </div>
        )}

        {loadingOrders ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 animate-pulse">
            Loading orders…
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            No orders yet.{" "}
            <Link href="/shop" className="text-(--primary) hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    Order #
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    Items
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    Total
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    Status
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-(--dark)">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-(--dark)">
                      ${(order.total ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/customer/orders/${order.id}`}
                        className="text-(--primary) font-medium hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
