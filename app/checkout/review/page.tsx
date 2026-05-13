"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const steps = [
  { label: "Address", title: "Delivery Address" },
  { label: "Payment", title: "Payment" },
  { label: "Confirmation", title: "Confirmation" },
];

const orderItems = [
  { name: "Secret Springs Water Bottle", qty: 2, price: 178 },
  { name: "Juna Shea Cream", qty: 1, price: 249 },
  { name: "Bliss Chocolates", qty: 1, price: 35 },
];

const subtotal = orderItems.reduce((s, i) => s + i.price, 0);
const shipping = 25;
const tax = 18;
const total = subtotal + shipping + tax;

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

export default function ReviewPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(sessionStorage.getItem("checkout_order_id"));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-7xl px-6 md:px-20 mx-auto">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <StepTabs current={3} />
          <StepProgress current={3} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Success Card */}
            <div className="bg-white rounded-lg border-2 p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-(--primary) flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                  <path
                    d="M4 12l5.5 5.5L20 6"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold">
                  Order Placed Successfully
                </h2>
                {orderId && (
                  <p className="text-gray-500 text-sm">Order #{orderId}</p>
                )}
                <p className="text-gray-700 text-sm">
                  Estimated delivery:{" "}
                  <span className="font-bold">5–7 business days</span>
                </p>
              </div>

              {orderId ? (
                <Link
                  href={`/customer/orders/${orderId}`}
                  className="px-8 py-3 bg-(--primary) text-white rounded font-semibold hover:bg-green-700 transition duration-200"
                >
                  Track My Order
                </Link>
              ) : (
                <Link
                  href="/customer/orders"
                  className="px-8 py-3 bg-(--primary) text-white rounded font-semibold hover:bg-green-700 transition duration-200"
                >
                  View My Orders
                </Link>
              )}

              <Link
                href="/shop"
                className="text-sm text-gray-400 hover:text-gray-600 transition"
              >
                or continue shopping →
              </Link>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
              <h2 className="text-lg font-bold mb-5">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold">${item.price}</span>
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
