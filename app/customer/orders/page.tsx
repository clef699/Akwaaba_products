"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getOrders, type Order } from "@/lib/orders";

const PAGE_SIZE = 7;

const statusStyles: Record<string, string> = {
  PROCESSING: "bg-black text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount?: number, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
        </td>
      ))}
    </tr>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All statuses" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-3xl font-bold text-(--dark)">My Orders</h1>
        <p className="text-gray-400 text-sm">All your past and current orders</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) cursor-pointer"
          >
            <option>All statuses</option>
            <option>PROCESSING</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                Order Number
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginated.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-(--dark)">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-(--dark)">
                    {formatCurrency(order.total, order.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="bg-(--primary) text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-block"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-(--primary) hover:text-(--primary) transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                n === page
                  ? "bg-(--primary) text-white"
                  : "border border-gray-200 text-gray-600 hover:border-(--primary) hover:text-(--primary)"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-(--primary) hover:text-(--primary) transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
