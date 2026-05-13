import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderConfirmationPage() {
  const orderNumber = "AKW-2026-0418";

  const items = [
    { name: "Secret Springs Water Bottle", qty: 2, price: 178 },
    { name: "Juna Shea Cream", qty: 1, price: 249 },
    { name: "Bliss Chocolates", qty: 1, price: 35 },
  ];

  const subtotal = 354;
  const shipping = 25;
  const tax = 18;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
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
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Thank you for your purchase. Your order is being prepared
            <br />
            and will ship soon.
          </p>

          {/* Order details card */}
          <div className="border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex justify-between text-sm mb-6">
              <span className="text-gray-500">Order Number</span>
              <span className="font-bold text-gray-900">#{orderNumber}</span>
            </div>

            <div className="space-y-5 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-sm">Qty {item.qty}</p>
                  </div>
                  <span className="font-bold text-gray-900">${item.price}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span
                className="font-bold text-lg"
                style={{ color: "var(--primary)" }}
              >
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery address card */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Delivery Address
            </p>
            <p className="text-gray-900">John Mensah</p>
            <p className="text-gray-900">14 Independence Avenue</p>
            <p className="text-gray-900">Accra, Greater Accra</p>
            <p className="text-gray-900 mb-5">Ghana · +233 24 555 0144</p>
            <p className="text-sm text-gray-500 mb-1">Estimated delivery</p>
            <p className="font-semibold" style={{ color: "var(--primary)" }}>
              Tuesday, May 5 — Thursday, May 7
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 text-white py-4 rounded-lg font-semibold text-center transition"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Track My Order
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-gray-900 text-white py-4 rounded-lg font-semibold text-center hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
