"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getShipment, updateShipmentStatus, type Shipment } from "@/lib/logistics";

const statusStyles: Record<string, string> = {
  "IN_TRANSIT": "bg-[#0a0a0a] text-white",
  "CREATED": "bg-[#f4f4f4] text-[#0a0a0a]",
  "DELIVERED": "bg-[#4caf50] text-white",
  "CANCELLED": "border border-[#d1d1d1] text-[#3f3f3f]",
  "SHIPPED": "bg-[#0a0a0a] text-white",
};

export default function UpdateShipmentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    getShipment(id)
      .then(setShipment)
      .catch((err) => setLoadError(err.message ?? "Failed to load shipment"));
  }, [id]);

  async function handleConfirm() {
    if (!newStatus) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateShipmentStatus(id, { status: newStatus, note: note || undefined, notifyCustomer });
      router.push(`/logistics/shipments/${id}`);
    } catch (err: unknown) {
      setSaveError((err as Error).message ?? "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  const currentStatusKey = shipment?.status.toUpperCase() ?? "";

  return (
    <div className="p-10">
      <Link
        href={`/logistics/shipments/${id}`}
        className="text-[14px] font-semibold text-[#4caf50] hover:underline block mb-7"
      >
        ← Back to Shipment
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">Update Shipment Status</h1>
          <p className="text-[14px] text-[#6b6b6b] mt-1">Change the dispatch state of a shipment</p>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 max-w-[560px] p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {loadError}
        </div>
      )}

      <div className="max-w-[560px]">
        <div className="bg-white border border-[#e6e6e6] rounded-[10px] p-8 space-y-6">
          {/* Shipment badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-[0.3px] bg-[#f4f4f4] text-[#0a0a0a]">
              Shipment {id}
            </span>
            {shipment && (
              <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[currentStatusKey] ?? "bg-gray-100 text-gray-600"}`}>
                {shipment.status.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {saveError}
            </div>
          )}

          {/* New Status */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
            >
              <option value="">Select new status...</option>
              <option value="CREATED">Created</option>
              <option value="SHIPPED">Shipped</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Add a note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional — add any notes about this status update"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors resize-none placeholder:text-[#b0b0b0]"
            />
          </div>

          {/* Notify checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyCustomer}
              onChange={(e) => setNotifyCustomer(e.target.checked)}
              className="w-4 h-4 accent-[#4caf50] cursor-pointer"
            />
            <span className="text-[14px] text-[#0a0a0a]">Notify customer by email</span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleConfirm}
              disabled={saving || !newStatus}
              className="flex-1 h-[53px] text-[15px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors disabled:opacity-50"
            >
              {saving ? "Updating…" : "Confirm Update"}
            </button>
            <Link
              href={`/logistics/shipments/${id}`}
              className="flex-1 h-[53px] text-[15px] font-semibold text-[#0a0a0a] bg-white border border-[#e6e6e6] rounded-[6px] hover:bg-[#f9f9f9] transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
