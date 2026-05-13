"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrder, type AdminOrder } from "@/lib/admin";

const statusStyles: Record<string, string> = {
  PROCESSING: "bg-gray-900 text-white",
  SHIPPED: "bg-gray-900 text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-700",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message ?? "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error ?? "Order not found"}
        </div>
      </div>
    );
  }

  const statusKey = order.status.toUpperCase();

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[statusKey] ?? "bg-gray-100 text-gray-700"}`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Order info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Customer</p>
            <p className="font-semibold text-gray-900">{order.customer}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Vendor</p>
            <p className="font-semibold text-gray-900">{order.vendor}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {order.paymentMethod && (
            <div>
              <p className="text-gray-500 mb-0.5">Payment</p>
              <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
            </div>
          )}
          {order.shippingAddress && (
            <div className="col-span-2">
              <p className="text-gray-500 mb-0.5">Shipping Address</p>
              <p className="font-semibold text-gray-900">{order.shippingAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Items</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">
                Product
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Qty
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Unit Price
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-3.5 px-6 text-sm font-semibold text-gray-900">
                  {item.productName}
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600">{item.qty}</td>
                <td className="py-3.5 px-4 text-sm text-gray-600">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">
                  ${(item.qty * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={3} className="py-4 px-6 text-sm font-bold text-gray-900 text-right">
                Total
              </td>
              <td className="py-4 px-4 text-sm font-bold text-(--primary)">
                ${order.total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
