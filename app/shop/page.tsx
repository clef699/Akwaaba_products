"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getProducts,
  getCategories,
  type Product,
  type Category,
  type ProductFilters,
} from "@/lib/catalog";
import { useCart } from "../context/CartContext";

const PRICE_MIN = 0;
const PRICE_MAX = 800;
const PAGE_SIZE = 12;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${filled || half ? "text-(--primary)" : "text-gray-300"}`}
            fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
            stroke="currentColor"
            strokeWidth={filled || half ? 0 : 1.5}
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#4caf50" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function StarRow({ count, label }: { count: number; label: string }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= count ? "text-(--primary)" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
      {label && <span className="text-sm text-gray-600 ml-0.5">{label}</span>}
    </span>
  );
}

function DualRangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (min: number, max: number) => void;
}) {
  const minPct = ((minVal - min) / (max - min)) * 100;
  const maxPct = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="relative mt-5 mb-1 px-1">
      <div className="relative h-1.5 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-(--primary) rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(e) =>
          onChange(Math.min(+e.target.value, maxVal - 1), maxVal)
        }
        className="absolute w-full -top-1.25 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-(--primary)
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(e) =>
          onChange(minVal, Math.max(+e.target.value, minVal + 1))
        }
        className="absolute w-full -top-1.25 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-(--primary)
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  );
}

export default function ShopPage() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filters: ProductFilters = {
      page,
      sort: sortBy,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    if (debouncedSearch) filters.q = debouncedSearch;
    if (selectedCategories.length === 1) filters.category = selectedCategories[0];

    try {
      const res = await getProducts(filters);
      setProducts(res.data);
      setTotalResults(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategories, priceRange, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategories([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setMinRating(null);
    setSortBy("featured");
    setPage(1);
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalResults);

  const visibleProducts =
    minRating !== null
      ? products.filter((p) => (p.rating ?? 0) >= minRating!)
      : products;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 sm:px-10 lg:px-16 py-8">
        <p className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-(--primary) transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">All Products</span>
        </p>

        {filtersOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setFiltersOpen(false)}
          />
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto transition-transform duration-300 lg:sticky lg:top-8 lg:z-auto lg:translate-x-0 lg:w-72 lg:shrink-0 lg:self-start lg:max-h-[calc(100vh-4rem)] ${
              filtersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-h-dvh lg:min-h-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAll}
                    className="text-sm font-medium text-(--primary) hover:text-(--primary) transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                    aria-label="Close filters"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Category
                  </h3>
                  <ul className="space-y-2.5">
                    {categories.map((cat) => (
                      <li
                        key={cat.id}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.name)}
                            onChange={() => toggleCategory(cat.name)}
                            className="w-4 h-4 rounded border-gray-300 text-(--primary) accent-(--primary) cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">
                            {cat.name}
                          </span>
                        </label>
                        {cat.count != null && (
                          <span className="text-sm text-gray-400">
                            {cat.count}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Price Range
                </h3>
                <DualRangeSlider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  minVal={priceRange[0]}
                  maxVal={priceRange[1]}
                  onChange={(lo, hi) => {
                    setPriceRange([lo, hi]);
                    setPage(1);
                  }}
                />
                <div className="flex justify-between mt-3 text-sm text-gray-600 font-medium">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Rating
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { stars: 5, label: "", value: 5 },
                    { stars: 4, label: "& up", value: 4 },
                    { stars: 3, label: "& up", value: 3 },
                    { stars: 1, label: "& up", value: 1 },
                  ].map((opt) => (
                    <li key={opt.value}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === opt.value}
                          onChange={() => {
                            setMinRating(opt.value);
                            setPage(1);
                          }}
                          className="w-4 h-4 accent-(--primary) cursor-pointer"
                        />
                        <StarRow count={opt.stars} label={opt.label} />
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort row */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 shrink-0 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-(--primary) transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18M7 8h10M11 12h4"
                  />
                </svg>
                Filters
              </button>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-(--primary) cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Result count */}
            <p className="text-sm text-gray-500 mb-5">
              {loading ? (
                "Loading products…"
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : totalResults > 0 ? (
                <>
                  Showing{" "}
                  <strong className="text-gray-800">
                    {startIdx}–{endIdx}
                  </strong>{" "}
                  of <strong className="text-gray-800">{totalResults}</strong>{" "}
                  results
                </>
              ) : (
                "No products match your filters."
              )}
            </p>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="bg-gray-200 h-52 w-full" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-100 h-52 w-full flex items-center justify-center">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1}
                          viewBox="0 0 24 24"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-gray-400 mb-1">
                        {product.brand}
                      </p>
                      <h2 className="font-semibold text-gray-900 mb-2 leading-snug">
                        {product.name}
                      </h2>

                      {product.rating != null && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <StarRating rating={product.rating} />
                          <span className="text-xs text-gray-500 font-medium">
                            {product.rating}
                          </span>
                          {product.reviews != null && (
                            <span className="text-xs text-gray-400">
                              ({product.reviews})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto">
                        <p className="text-xl font-bold text-(--primary) mb-3">
                          ${product.price}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                qty: 1,
                                image: product.images?.[0],
                              });
                              setAddedIds((prev) => {
                                const next = new Set(prev);
                                next.add(product.id);
                                return next;
                              });
                              setTimeout(() => {
                                setAddedIds((prev) => {
                                  const next = new Set(prev);
                                  next.delete(product.id);
                                  return next;
                                });
                              }, 2000);
                            }}
                            className="flex-1 bg-(--primary) text-white text-sm font-semibold py-2.5 rounded-lg transition-colors hover:bg-green-700"
                          >
                            {addedIds.has(product.id) ? "Added ✓" : "Add to Cart"}
                          </button>
                          <Link
                            href={`/shop/${product.id}`}
                            className="px-3 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-(--primary) transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-20 text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <p className="text-sm">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              )
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-(--primary) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        n === page
                          ? "bg-(--primary) border-(--primary) text-white font-medium"
                          : "border-gray-200 text-gray-600 hover:border-(--primary)"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-(--primary) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
