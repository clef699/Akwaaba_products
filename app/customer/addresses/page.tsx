"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  type CustomerAddress,
  type CreateAddressPayload,
} from "@/lib/customer";

const emptyForm: CreateAddressPayload = {
  label: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAddressPayload>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAddresses()
      .then(setAddresses)
      .catch((err) => setError(err.message ?? "Failed to load addresses"))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setCreating(true);
    setCreateError(null);
    try {
      const created = await createAddress(form);
      setAddresses((prev) => [...prev, created]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err: unknown) {
      setCreateError((err as Error).message ?? "Failed to add address");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    setSettingDefaultId(id);
    try {
      const updated = await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => (a.id === id ? updated : { ...a, isDefault: false }))
      );
    } catch {
    } finally {
      setSettingDefaultId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--dark)">My Addresses</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm(emptyForm); setCreateError(null); }}
          className="flex items-center gap-2 bg-(--primary) text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-(--dark)">New Address</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {createError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {(
              [
                { name: "label", label: "Label (e.g. Home)", placeholder: "Home" },
                { name: "name", label: "Recipient Name", placeholder: "John Mensah" },
                { name: "line1", label: "Address Line 1", placeholder: "14 Independence Ave" },
                { name: "line2", label: "Address Line 2", placeholder: "Apt, suite, etc. (optional)" },
                { name: "city", label: "City", placeholder: "Accra" },
                { name: "state", label: "State / Region", placeholder: "Greater Accra" },
                { name: "country", label: "Country", placeholder: "Ghana" },
                { name: "phone", label: "Phone", placeholder: "+233 24 000 0000" },
              ] as { name: keyof CreateAddressPayload; label: string; placeholder: string }[]
            ).map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  value={String(form[name] ?? "")}
                  onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)"
                />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              className="accent-(--primary)"
            />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={creating || !form.label.trim() || !form.line1.trim()}
              className="bg-(--primary) text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
            >
              {creating ? "Saving…" : "Save Address"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 text-(--dark) font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-(--dark)">{addr.label}</h3>
                {addr.isDefault && (
                  <span className="bg-(--primary) text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{addr.name}</p>
              <p className="text-sm text-gray-700">{addr.line1}</p>
              {addr.line2 && <p className="text-sm text-gray-700">{addr.line2}</p>}
              {(addr.city || addr.state || addr.country) && (
                <p className="text-sm text-gray-700">
                  {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
                </p>
              )}
              {addr.phone && <p className="text-sm text-gray-700 mt-0.5">{addr.phone}</p>}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingId === addr.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                    className="text-sm text-gray-500 hover:text-(--primary) transition-colors disabled:opacity-50"
                  >
                    {settingDefaultId === addr.id ? "Updating…" : "Set as default"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add address slot */}
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setForm(emptyForm); }}
              className="rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-(--primary) hover:text-(--primary) text-gray-400 transition-colors"
            >
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium">Add Address</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
