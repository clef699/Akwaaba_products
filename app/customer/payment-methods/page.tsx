"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  getPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  type PaymentMethod,
} from "@/lib/customer";

function CardDisplay({ brand, last4, cardholder, expires, isDefault }: PaymentMethod) {
  const isVisa = brand.toUpperCase() === "VISA";
  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-[#111111] p-6 text-white relative select-none">
      <div className="flex items-start justify-between mb-8">
        <div className={`w-10 h-7 rounded-md ${isVisa ? "bg-(--primary)" : "bg-gray-300"}`} />
        <div className="flex items-center gap-3">
          {isDefault && (
            <span className="bg-(--primary) text-white text-xs font-bold px-3 py-1 rounded-full">
              DEFAULT
            </span>
          )}
          <span className={`font-black text-lg tracking-wider ${isVisa ? "italic" : ""}`}>
            {brand.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-base tracking-[0.18em] font-mono mb-7 text-white/90">
        {"• • • •  • • • •  • • • •  " + last4.split("").join(" ")}
      </p>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Cardholder</p>
          <p className="text-sm font-bold">{cardholder}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Expires</p>
          <p className="text-sm font-bold">{expires}</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPaymentMethods()
      .then(setMethods)
      .catch((err) => setError(err.message ?? "Failed to load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await deletePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch {
    } finally {
      setRemovingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    setSettingDefaultId(id);
    try {
      const updated = await setDefaultPaymentMethod(id);
      setMethods((prev) =>
        prev.map((m) => (m.id === id ? updated : { ...m, isDefault: false }))
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
          <h1 className="text-3xl font-bold text-(--dark)">Payment Methods</h1>
          <p className="text-gray-400 text-sm mt-1">Cards saved to your account</p>
        </div>
        <button className="flex items-center gap-2 bg-(--primary) text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          Add New Card
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-full max-w-[320px] h-44 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : methods.length === 0 ? (
        <div className="text-gray-400 text-sm">No payment methods saved yet.</div>
      ) : (
        <div className="flex flex-col gap-5">
          {methods.map((card) => (
            <div key={card.id}>
              <CardDisplay {...card} />
              <div className="flex items-center justify-between mt-3 max-w-[320px]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRemove(card.id)}
                    disabled={removingId === card.id}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {removingId === card.id ? "Removing…" : "Remove"}
                  </button>
                </div>
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    disabled={settingDefaultId === card.id}
                    className="text-sm text-gray-500 hover:text-(--primary) transition-colors disabled:opacity-50"
                  >
                    {settingDefaultId === card.id ? "Updating…" : "Set as default"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
