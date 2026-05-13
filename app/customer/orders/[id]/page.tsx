"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { getOrder, type Order, type OrderTimeline } from "@/lib/orders";

const statusStyles: Record<string, string> = {
  PROCESSING: "bg-black text-white",
  DELIVERED: "bg-(--primary) text-white",
  CANCELLED: "border border-gray-300 text-gray-600",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount?: number, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function deriveTimeline(status: string, createdAt?: string): OrderTimeline[] {
  const placedTime = createdAt ? formatDate(createdAt) : "—";
  const allSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const doneUntil: Record<string, number> = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
    CANCELLED: 0,
  };
  const doneCount = doneUntil[status] ?? 0;
  return allSteps.map((step, i) => ({
    step,
    time: i === 0 ? placedTime : i <= doneCount ? "Completed" : "Pending",
    done: i <= doneCount,
    isFirst: i === 0,
  }));
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getOrder(id)
      .then(setOrder)
      .catch((err) => {
        if (err?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="bg-gray-100 rounded-xl h-64" />
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-xl h-48" />
            <div className="bg-gray-100 rounded-xl h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="p-8">
        <Link
          href="/customer/orders"
          className="flex items-center gap-2 text-(--primary) text-sm mb-6 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const timeline: OrderTimeline[] =
    order.timeline && order.timeline.length > 0
      ? order.timeline
      : deriveTimeline(order.status, order.createdAt);

  const addr = order.shippingAddress;

  return (
    <div className="p-8">
      {/* Back link */}
      <Link
        href="/customer/orders"
        className="flex items-center gap-2 text-(--primary) text-sm mb-6 hover:underline w-fit"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-(--dark)">Order {order.id}</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            {order.createdAt && <>Placed on {formatDate(order.createdAt)} · </>}
            {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {order.status}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-(--dark) mb-6">Order Status</h2>
          <div className="flex flex-col">
            {timeline.map((step, i) => {
              const isLast = i === timeline.length - 1;
              return (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        step.done
                          ? "bg-(--primary)"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {step.done && (
                        <Check size={13} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 min-h-8 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                    <p
                      className={`font-semibold text-sm ${
                        step.isFirst && step.done
                          ? "text-(--primary)"
                          : "text-(--dark)"
                      }`}
                    >
                      {step.step}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-(--dark) mb-5">Items</h2>
            <div className="flex flex-col divide-y divide-gray-50">
              {order.items.map((item, i) => (
                <div
                  key={item.productId ?? i}
                  className="flex items-center gap-4 py-4 first:pt-0"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-(--dark) text-sm">
                      {item.name ?? item.productId}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.vendor && <>{item.vendor} · </>}Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-bold text-(--dark)">
                    {item.price != null
                      ? formatCurrency(item.price * item.qty, order.currency)
                      : "—"}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 mt-2 pt-5 flex flex-col gap-2">
              {order.subtotal != null && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
              )}
              {order.shipping != null && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shipping, order.currency)}</span>
                </div>
              )}
              {order.tax != null && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-(--dark) text-base mt-2 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-(--primary)">
                  {formatCurrency(order.total, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Delivery Address
              </p>
              {addr.name && <p className="text-sm text-(--dark)">{addr.name}</p>}
              <p className="text-sm text-(--dark)">{addr.line1}</p>
              {addr.line2 && <p className="text-sm text-(--dark)">{addr.line2}</p>}
              {addr.city && (
                <p className="text-sm text-(--dark)">
                  {addr.city}
                  {addr.state ? `, ${addr.state}` : ""}
                </p>
              )}
              <p className="text-sm text-(--dark)">{addr.country}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Payment
              </p>
              {order.payment?.method ? (
                <p className="text-sm text-(--dark)">{order.payment.method}</p>
              ) : order.payment?.provider ? (
                <p className="text-sm text-(--dark) capitalize">
                  {order.payment.provider}
                  {order.payment.last4 && ` ending in ${order.payment.last4}`}
                </p>
              ) : (
                <p className="text-sm text-gray-400">—</p>
              )}
              {order.total != null && (
                <p className="text-sm text-(--dark)">
                  Charged{" "}
                  <strong>{formatCurrency(order.total, order.currency)}</strong>
                </p>
              )}
              {order.payment?.status && (
                <p className="text-sm text-gray-400 capitalize">
                  {order.payment.status}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
