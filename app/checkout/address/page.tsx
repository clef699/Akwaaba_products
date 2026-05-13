"use client";

import { useRouter } from "next/navigation";
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

export default function AddressPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const address = {
      name: (form.elements.namedItem("fullName") as HTMLInputElement).value,
      line1: (form.elements.namedItem("street") as HTMLInputElement).value,
      city: (form.elements.namedItem("city") as HTMLInputElement).value,
      state: (form.elements.namedItem("region") as HTMLInputElement).value,
      country: "Ghana",
    };
    sessionStorage.setItem("checkout_address", JSON.stringify(address));
    router.push("/checkout/payment");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-10xl px:6 md:px-20 mx-auto">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <StepTabs current={1} />
          <StepProgress current={1} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Delivery Address Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-6">Delivery Address</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="John Mensah"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+233 24 555 0144"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required
                    placeholder="14 Independence Avenue"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      placeholder="Accra"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      Region
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      placeholder="Greater Accra"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-(--primary)"
                  />
                  <span className="text-sm text-gray-700">
                    Save this address for future orders
                  </span>
                </label>

                <button
                  type="submit"
                  className="block w-1/3 text-center bg-(--primary) text-white py-3 rounded font-semibold hover:bg-green-700 transition duration-200"
                >
                  Continue to Payment
                </button>
              </form>
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
