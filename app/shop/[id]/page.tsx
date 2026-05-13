"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductTabs, { type TabType } from "../../components/ProductTabs";
import { Undo2 } from "lucide-react";
import { getProduct, type Product } from "@/lib/catalog";
import { useCart } from "../../context/CartContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProduct(id)
      .then((p) => setProduct(p))
      .catch((err) => {
        if (err?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white px-4 sm:px-12 lg:px-20 py-10">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              <div className="w-full lg:w-1/2 bg-gray-200 rounded-lg h-96" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-10 bg-gray-200 rounded w-32" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop" className="text-(--primary) hover:underline">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const discountedPrice = product.price * 1.5;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 sm:px-12 lg:px-20 py-10">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/shop" className="hover:text-(--primary)">
            Shop
          </Link>{" "}
          / {product.category && <span>Category / {product.category}</span>}
        </nav>

        <div className="py-6 sm:py-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-64 sm:h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {product.images.slice(1).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={product.name}
                    className="h-20 sm:h-28 w-24 sm:w-32 rounded shrink-0 object-cover bg-amber-500"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start flex-1">
            {product.category && (
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                {product.category}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--dark) mb-3">
              {product.name}
            </h1>
            <div className="flex gap-4 mb-6 items-baseline">
              <p className="text-4xl font-bold text-(--primary)">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm font-bold text-(--primary)">
                <s className="text-gray-400">${discountedPrice.toFixed(2)}</s>
              </p>
              <p className="text-xs font-bold text-white bg-(--primary) px-2 py-1 rounded-full">
                20% OFF
              </p>
            </div>

            {product.rating != null && (
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating!) ? "text-(--primary)" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.608-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating.toFixed(1)}
                </span>
                {product.reviews != null && (
                  <span>{product.reviews} Reviews</span>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mb-6">
              <ul className="text-sm text-gray-600 space-y-1 border border-(--gray-text) p-4 rounded-md">
                {product.brand && (
                  <li className="flex items-center gap-2 justify-between">
                    Brand: <span>{product.brand}</span>
                  </li>
                )}
                <li className="flex items-center gap-2 justify-between text-(--primary)">
                  Stock:{" "}
                  <span>
                    {product.stock != null
                      ? product.stock > 0
                        ? `In stock (${product.stock} left)`
                        : "Out of stock"
                      : "In stock"}
                  </span>
                </li>
                {product.countryOfOrigin && (
                  <li className="flex items-center gap-2 justify-between">
                    Ships from: <span>{product.countryOfOrigin}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium">Quantity</span>
              <div className="border border-(--gray-text) rounded-md flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: quantity,
                    image: product.images?.[0],
                  });
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className="flex-1 bg-(--primary) py-3 text-white rounded font-semibold hover:bg-green-800 transition duration-200"
              >
                {addedToCart ? "Added ✓" : "Add to Cart"}
              </button>
              <Link
                href="/checkout/address"
                className="flex-1 text-center bg-(--dark) text-white py-3 rounded font-semibold transition duration-200"
              >
                Buy Now
              </Link>
            </div>
            <hr className="border-gray-200 my-5 text-xl" />
            <div className="flex flex-wrap items-center gap-4 sm:gap-10 mb-4">
              <p>🚚 Free shipping over $200</p>
              <div className="flex items-center gap-1">
                <Undo2 size={20} />
                <p>14 day returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="mt-10 sm:mt-12 border-gray-200">
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-(--dark) mb-4">
                  Product Description
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description ?? "No description available."}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-(--dark) mb-4">
                  Customer Reviews
                </h2>
                <p className="text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-(--dark) mb-4">
                  Shipping &amp; Returns
                </h2>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="font-semibold text-(--dark) mb-2">
                      Shipping Information
                    </h3>
                    <p>
                      We offer free shipping on orders over $200. Standard
                      shipping typically takes 5-7 business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-(--dark) mb-2">
                      Return Policy
                    </h3>
                    <p>
                      Returns are accepted within 14 days of purchase. Items
                      must be unused and in original packaging.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
