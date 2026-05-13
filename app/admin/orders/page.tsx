"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import OrdersTable, { type Order } from "@/app/components/OrdersTable";
import Pagination from "@/app/components/Pagination";
import { getOrders } from "@/lib/admin";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-05-01");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrders({
      page,
      search: searchQuery || undefined,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        const mapped: Order[] = res.orders.map((o) => ({
          id: o.id,
          customer: o.customer,
          date: new Date(o.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          items: o.items.length,
          total: o.total,
          status: o.status.toUpperCase() as Order["status"],
        }));
        setOrders(mapped);
        setTotalPages(Math.max(1, Math.ceil(res.total / res.pageSize)));
      })
      .catch((err) => setError(err.message ?? "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [page, searchQuery, status, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, status, startDate, endDate]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage all orders across the platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          />
        </div>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white cursor-pointer"
        />

        <span className="flex items-center text-gray-500 font-semibold">to</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white cursor-pointer"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white cursor-pointer whitespace-nowrap"
        >
          {statuses.map((stat) => (
            <option key={stat.value} value={stat.value}>
              {stat.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 animate-pulse">
          Loading orders…
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
