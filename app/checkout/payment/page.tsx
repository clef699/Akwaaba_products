"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { placeOrder } from "@/lib/orders";
import { type ApiError } from "@/lib/api";
import { useCart } from "../../context/CartContext";

const steps = [
  { label: "Address", title: "Delivery Address" },
  { label: "Payment", title: "Payment" },
  { label: "Confirmation", title: "Confirmation" },
];

const SHIPPING = 25;
const TAX = 18;

type PaymentMethod = "card" | "mobilemoney" | "banktransfer";

function StepTabs({ current }: { current: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {steps.map((s, i) => {
        const n = i + 1;
        const active = n === current;
        return (
          <div
            key={s.label}
            className={`px-4 py-2 rounded text-sm font-medium border ${
              active
                ? "bg-(--primary) text-white border-(--primary)"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            Step {n}: {s.label}
          </div>
        );
      })}
    </div>
  );
}

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  active
                    ? "bg-(--primary) border-(--primary) text-white"
                    : done
                      ? "bg-(--primary) border-(--primary) text-white"
                      : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-xs mt-1 ${
                  active
                    ? "text-(--primary) font-semibold"
                    : done
                      ? "text-(--primary)"
                      : "text-gray-400"
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-24 mx-1 mb-5 ${
                  done ? "bg-(--primary)" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MethodOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 flex-1 px-4 py-3 rounded border-2 text-sm font-medium transition-colors ${
        selected
          ? "border-(--primary) bg-(--light-primary)"
          : "border-gray-200 bg-white text-gray-600"
      }`}
    >
      <span
        className={`w-5 h-5 rounded shrink-0 flex items-center justify-center border-2 transition-colors ${
          selected
            ? "bg-(--primary) border-(--primary) text-white"
            : "border-gray-300 bg-white"
        }`}
      >
        {selected && (
          <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
            <path
              d="M1 5l3.5 3.5L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = SHIPPING;
  const tax = TAX;
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const addressRaw = sessionStorage.getItem("checkout_address");
    const shippingAddress = addressRaw
      ? JSON.parse(addressRaw)
      : { line1: "Unknown", country: "Ghana" };

    try {
      const order = await placeOrder({
        items: items.map(({ id, qty }) => ({ productId: id, qty })),
        currency: "USD",
        shippingAddress,
        payment: {
          provider: method,
          transactionId: `TXN-${Date.now()}`,
          status: "completed",
        },
      });
      sessionStorage.setItem("checkout_order_id", order.id);
      clearCart();
      router.push("/checkout/review");
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.code === "PAYMENT_FAILED") {
        const reason = apiErr.reason ? `: ${apiErr.reason}` : "";
        setError(`Payment declined${reason}. Your cart has been preserved — please try a different payment method or card.`);
      } else {
        setError(apiErr.message ?? "Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-10xl px-6 md:px-20 mx-auto">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <StepTabs current={2} />
          <StepProgress current={2} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Payment Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-5">Payment</h2>

              {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}

              {/* Method selector */}
              <div className="flex gap-3 mb-6">
                <MethodOption
                  label="Card"
                  selected={method === "card"}
                  onClick={() => setMethod("card")}
                />
                <MethodOption
                  label="Mobile Money"
                  selected={method === "mobilemoney"}
                  onClick={() => setMethod("mobilemoney")}
                />
                <MethodOption
                  label="Bank Transfer"
                  selected={method === "banktransfer"}
                  onClick={() => setMethod("banktransfer")}
                />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {method === "card" && (
                  <>
                    <div>
                      <label
                        htmlFor="cardnumber"
                        className="block text-sm text-gray-600 mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardnumber"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiry"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          placeholder="08 / 28"
                          maxLength={7}
                          className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          CVV
                        </label>
                        <input
                          type="password"
                          id="cvv"
                          placeholder="•••"
                          maxLength={4}
                          className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cardholder"
                        className="block text-sm text-gray-600 mb-1"
                      >
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardholder"
                        placeholder="John Mensah"
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                      />
                    </div>
                  </>
                )}

                {method === "mobilemoney" && (
                  <>
                    <div>
                      <label
                        htmlFor="network"
                        className="block text-sm text-gray-600 mb-1"
                      >
                        Network
                      </label>
                      <select
                        id="network"
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white"
                      >
                        <option value="">Select network</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="airteltigo">AirtelTigo Money</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="momonumber"
                        className="block text-sm text-gray-600 mb-1"
                      >
                        Mobile Money Number
                      </label>
                      <input
                        type="tel"
                        id="momonumber"
                        placeholder="024 000 0000"
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                      />
                    </div>
                  </>
                )}

                {method === "banktransfer" && (
                  <div className="bg-gray-50 rounded p-4 text-sm text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800">
                      Bank Transfer Details
                    </p>
                    <p>Bank: Ghana Commercial Bank</p>
                    <p>Account Name: Akwaaba Marketplace</p>
                    <p>Account Number: 1234567890</p>
                    <p>Reference: Use your order number</p>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Link
                    href="/checkout/address"
                    className="px-6 py-3 rounded border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 text-center bg-(--primary) text-white py-3 rounded font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-60"
                  >
                    {loading ? "Placing order…" : `Pay Now · $${total.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
              <h2 className="text-lg font-bold mb-5">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-700">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-gray-700">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-lg text-(--primary)">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
