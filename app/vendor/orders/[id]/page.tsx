"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, type VendorOrder } from "@/lib/vendor";

const statusStyles: Record<string, string> = {
  Processing: "bg-[#efefef] text-[#555]",
  Shipped: "bg-[#0a0a0a] text-white",
  Delivered: "bg-[#4caf50] text-white",
  Cancelled: "border border-[#d1d1d1] text-[#3f3f3f]",
};

export default function VendorOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<VendorOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-9 text-[13px] text-[#888]">Loading order…</div>;
  }

  if (error || !order) {
    return (
      <div className="p-9">
        <div className="px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error ?? "Order not found."}
        </div>
        <Link href="/vendor/orders" className="mt-4 inline-block text-[13px] font-semibold text-[#4caf50] hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const statusStyle = statusStyles[order.status] ?? "bg-[#efefef] text-[#555]";

  return (
    <div className="p-9">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/vendor/orders"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#efefef] rounded-[8px] text-[16px] hover:bg-[#f9f9f9] transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-[24px] font-bold text-[#0a0a0a]">Order {order.id}</h1>
          <p className="text-[13px] text-[#888] mt-0.5">{order.date}</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.3px] ${statusStyle}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Order Items */}
        <div className="col-span-2 space-y-5">
          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Items</h3>
            </div>
            {order.items && order.items.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
                    {["PRODUCT", "QTY", "UNIT PRICE", "SUBTOTAL"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.productId} className="border-b border-[#f5f5f5] last:border-0">
                      <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{item.productName}</td>
                      <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{item.qty}</td>
                      <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">
                        ${(item.qty * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-[#f4f4f4] to-[#e6e6e6] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#0a0a0a]">{order.product}</p>
                  </div>
                  <p className="text-[14px] font-bold text-[#0a0a0a]">${order.amount.toFixed(2)}</p>
                </div>
              </div>
            )}
            <div className="border-t border-[#efefef] px-6 py-4 flex justify-end">
              <div className="text-right">
                <p className="text-[12px] text-[#888]">Order Total</p>
                <p className="text-[20px] font-bold text-[#0a0a0a]">${order.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Customer</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-[14px] font-semibold text-[#0a0a0a]">{order.customer}</p>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
              <div className="border-b border-[#efefef] px-6 py-4">
                <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Shipping Address</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-[13px] text-[#333] leading-relaxed whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Order Info</h3>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888]">Order ID</span>
                <span className="font-semibold text-[#0a0a0a]">{order.id}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888]">Date</span>
                <span className="font-semibold text-[#0a0a0a]">{order.date}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888]">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyle}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
