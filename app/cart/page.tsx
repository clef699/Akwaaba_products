"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const SHIPPING = 25;
const TAX = 18;

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();

  function increment(id: string, currentQty: number) {
    updateQty(id, currentQty + 1);
  }

  function decrement(id: string, currentQty: number) {
    if (currentQty > 1) updateQty(id, currentQty - 1);
  }

  const total = subtotal + SHIPPING + TAX;
  const isEmpty = items.length === 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 py-10">
        <div className="w-full mx-auto px-6 md:px-20">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <svg
                className="w-16 h-16 text-gray-200 mb-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Looks like you haven&apos;t added anything yet.
              </p>
              <Link
                href="/shop"
                className="px-6 py-3 bg-(--primary) text-white rounded font-semibold hover:bg-green-700 transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
              {/* Items list */}
              <div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 px-6 py-5 ${
                        idx < items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 leading-tight">
                          {item.name}
                        </p>
                        {item.vendor && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.vendor}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1.5 shrink-0">
                        <button
                          onClick={() => decrement(item.id, item.qty)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 transition text-base leading-none"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-5 text-center tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increment(item.id, item.qty)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 transition text-base leading-none"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-(--primary) w-20 text-right shrink-0 tabular-nums">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-gray-500 transition text-xl leading-none ml-1 shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-sm font-medium text-(--primary) mt-5 hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-5">Order Summary</h2>

                <div className="flex justify-between text-sm mb-5">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-gray-700">${SHIPPING.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-gray-700">${TAX.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 mt-4 pt-4">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-lg text-(--primary)">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout/address"
                  className="block w-full text-center bg-(--primary) text-white py-3 rounded font-semibold mt-5 hover:bg-green-700 transition duration-200"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 Secure checkout · Encrypted payment
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
