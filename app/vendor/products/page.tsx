"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct, type VendorProduct } from "@/lib/vendor";

const statusStyles: Record<string, string> = {
  Active: "bg-[#4caf50] text-white",
  "Out of Stock": "border border-[#d1d1d1] text-[#3f3f3f]",
  "Low Stock": "bg-[#0a0a0a] text-white",
  Draft: "bg-[#f5f5f5] text-[#555]",
  Archived: "bg-[#efefef] text-[#888]",
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="p-9">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0a0a0a]">My Products</h1>
          <p className="text-[13px] text-[#888] mt-1">Manage your listed products</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-[39px] pl-4 pr-4 text-[13px] bg-white border border-[#efefef] rounded-[8px] outline-none focus:border-[#4caf50] w-[220px]"
          />
          <Link
            href="/vendor/products/new"
            className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-[#4caf50] rounded-[8px] hover:bg-[#43a047] transition-colors flex items-center"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          Failed to load products: {error}
        </div>
      )}

      <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-[13px] text-[#888]">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
                {["PRODUCT", "CATEGORY", "PRICE", "STOCK", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#888]">
                    {search ? "No products match your search." : "No products yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-[#f4f4f4] to-[#e6e6e6] flex-shrink-0" />
                        <div>
                          <p className="text-[14px] font-semibold text-[#0a0a0a]">{p.name}</p>
                          <p className="text-[11px] text-[#888]">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{p.category}</td>
                    <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{p.stock}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[p.status] ?? ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vendor/products/${p.id}/edit`}
                          className="px-3 py-1.5 text-[13px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="px-3 py-1.5 text-[13px] font-semibold text-[#d32f2f] bg-white border border-[#e8e8e8] rounded-[6px] hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === p.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
