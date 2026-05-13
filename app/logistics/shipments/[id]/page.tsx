"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getShipment, type Shipment } from "@/lib/logistics";

const statusStyles: Record<string, string> = {
  "IN_TRANSIT": "bg-[#0a0a0a] text-white",
  "CREATED": "bg-[#f4f4f4] text-[#0a0a0a]",
  "DELIVERED": "bg-[#4caf50] text-white",
  "CANCELLED": "border border-[#d1d1d1] text-[#3f3f3f]",
  "SHIPPED": "bg-[#0a0a0a] text-white",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getShipment(id)
      .then(setShipment)
      .catch((err) => setError(err.message ?? "Failed to load shipment"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-7" />
        <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mb-5" />
        <div className="flex gap-5">
          <div className="w-[370px] h-96 bg-gray-100 rounded-[10px] animate-pulse" />
          <div className="flex-1 h-96 bg-gray-100 rounded-[10px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="p-10">
        <Link href="/logistics/shipments" className="text-[14px] font-semibold text-[#4caf50] hover:underline block mb-7">
          ← Back to Shipments
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error ?? "Shipment not found."}
        </div>
      </div>
    );
  }

  const statusKey = shipment.status.toUpperCase();

  return (
    <div className="p-10">
      <Link
        href="/logistics/shipments"
        className="text-[14px] font-semibold text-[#4caf50] hover:underline block mb-7"
      >
        ← Back to Shipments
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">{shipment.id}</h1>
          <p className="text-[14px] text-[#6b6b6b] mt-1">
            Linked to <span className="font-bold text-[#4caf50]">{shipment.orderRef}</span>
            <span className="text-[#6b6b6b]"> · Created {formatDate(shipment.createdAt)}</span>
          </p>
        </div>
        <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[statusKey] ?? "bg-gray-100 text-gray-600"}`}>
          {shipment.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="flex gap-5">
        {/* Status Timeline */}
        <div className="w-[370px] flex-shrink-0 bg-white border border-[#e6e6e6] rounded-[10px] p-6">
          <h3 className="text-[16px] font-extrabold text-[#0a0a0a] tracking-[-0.5px] mb-6">Shipment Status</h3>
          {shipment.timeline.length === 0 ? (
            <p className="text-[14px] text-[#6b6b6b]">No timeline events yet.</p>
          ) : (
            <div className="relative pl-3">
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[#e6e6e6]" />
              <div className="space-y-[68px]">
                {shipment.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-5 relative">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 relative z-10 -ml-[3px] ${
                      step.done
                        ? step.current
                          ? "bg-[#4caf50] border-[#4caf50] shadow-[0_0_0_5px_rgba(76,175,80,0.2)]"
                          : "bg-[#4caf50] border-[#4caf50]"
                        : "bg-white border-[#d1d1d1]"
                    }`}>
                      {step.done && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-[14px] font-semibold ${step.done ? "text-[#4caf50]" : "text-[#0a0a0a]"}`}>
                        {step.label}
                      </p>
                      <p className="text-[12px] text-[#6b6b6b] mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Details */}
        <div className="flex-1 bg-white border border-[#e6e6e6] rounded-[10px] p-6">
          <p className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-[0.4px] mb-4">Delivery Address</p>
          <div className="text-[15px] text-[#0a0a0a] space-y-0 mb-6">
            <p>{shipment.recipient.name}</p>
            <p>{shipment.address.street}</p>
            <p>{[shipment.address.city, shipment.address.region].filter(Boolean).join(", ")}</p>
            {shipment.address.country && <p>{shipment.address.country}{shipment.address.postalCode ? ` — ${shipment.address.postalCode}` : ""}</p>}
          </div>

          <div className="border-t border-[#f4f4f4] pt-4 mb-4">
            <p className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-[0.4px]">Contact</p>
          </div>
          <p className="text-[14px] text-[#0a0a0a] mb-6">
            {[shipment.recipient.phone, shipment.recipient.email].filter(Boolean).join(" · ")}
          </p>

          <div className="border-t border-[#f4f4f4] pt-4 mb-5">
            <p className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-[0.4px]">Items in this shipment</p>
          </div>

          <div className="space-y-4 mb-7">
            {shipment.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[6px] bg-gradient-to-br from-[#f4f4f4] to-[#e6e6e6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0a0a0a]">{item.name}</p>
                  <p className="text-[12px] text-[#6b6b6b]">{item.vendor}</p>
                </div>
                <span className="text-[15px] font-bold text-[#0a0a0a]">Qty {item.quantity}</span>
              </div>
            ))}
          </div>

          <Link
            href={`/logistics/shipments/${id}/update`}
            className="w-full h-[53px] text-[15px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors flex items-center justify-center"
          >
            Update Status
          </Link>
        </div>
      </div>
    </div>
  );
}
