"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createShipment, type CreateShipmentPayload } from "@/lib/logistics";

const emptyForm = {
  orderRef: "",
  street: "",
  city: "",
  region: "",
  recipientName: "",
  recipientPhone: "",
  carrier: "Standard Delivery (2–4 days)",
  notes: "",
};

export default function CreateShipmentPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    const payload: CreateShipmentPayload = {
      orderRef: form.orderRef.trim(),
      address: {
        street: form.street.trim(),
        city: form.city.trim(),
        region: form.region.trim(),
      },
      recipient: {
        name: form.recipientName.trim(),
        phone: form.recipientPhone.trim(),
      },
      carrier: form.carrier || undefined,
      notes: form.notes.trim() || undefined,
    };
    try {
      const shipment = await createShipment(payload);
      router.push(`/logistics/shipments/${shipment.id}`);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to create shipment");
      setSaving(false);
    }
  }

  const canSubmit = form.orderRef.trim() && form.street.trim() && form.recipientName.trim() && !saving;

  return (
    <div className="p-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/logistics/shipments"
          className="text-[14px] font-semibold text-[#4caf50] hover:underline"
        >
          ← Back to Shipments
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">Create Shipment</h1>
          <p className="text-[14px] text-[#6b6b6b] mt-1">Register a new outbound shipment</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/logistics/shipments"
            className="h-[53px] px-6 text-[15px] font-semibold text-[#0a0a0a] bg-white border border-[#e6e6e6] rounded-[6px] hover:bg-[#f9f9f9] transition-colors flex items-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="h-[53px] px-6 text-[15px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create Shipment"}
          </button>
        </div>
      </div>

      <div className="max-w-[600px]">
        <div className="bg-white border border-[#e6e6e6] rounded-[10px] p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Order Reference */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Order Reference</label>
            <input
              name="orderRef"
              type="text"
              value={form.orderRef}
              onChange={handleChange}
              placeholder="#AKW-0419"
              className="w-full h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Delivery Address</label>
            <input
              name="street"
              type="text"
              value={form.street}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors mb-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
              />
              <input
                name="region"
                type="text"
                value={form.region}
                onChange={handleChange}
                placeholder="Region"
                className="h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Recipient Contact</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="recipientName"
                type="text"
                value={form.recipientName}
                onChange={handleChange}
                placeholder="Recipient name"
                className="h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
              />
              <input
                name="recipientPhone"
                type="tel"
                value={form.recipientPhone}
                onChange={handleChange}
                placeholder="+233 ..."
                className="h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
              />
            </div>
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Carrier / Method</label>
            <select
              name="carrier"
              value={form.carrier}
              onChange={handleChange}
              className="w-full h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
            >
              <option>Standard Delivery (2–4 days)</option>
              <option>Express Delivery (1–2 days)</option>
              <option>Same Day Delivery</option>
              <option>Pickup Point</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special instructions for this shipment..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="w-full h-[53px] text-[15px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}
