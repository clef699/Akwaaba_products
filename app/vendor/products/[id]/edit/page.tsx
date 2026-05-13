"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/lib/vendor";
import { uploadImage } from "@/lib/uploads";

const CATEGORIES = ["Staple Foods", "Cooking Oils", "Spices & Seasonings", "Nuts & Seeds", "Wellness", "Accessories"];

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("10");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    getProduct(id)
      .then((p) => {
        setName(p.name);
        setDescription(p.description ?? "");
        setCategory(p.category);
        setSku(p.sku ?? "");
        setPrice(String(p.price));
        setComparePrice(p.comparePrice ? String(p.comparePrice) : "");
        setStock(String(p.stock));
        setLowStockAlert(p.lowStockAlert ? String(p.lowStockAlert) : "10");
        setStatus(p.status);
        setImages(p.images ?? []);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFiles(files: FileList) {
    setUploadError(null);
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(imageFiles.map(uploadImage));
      setImages((prev) => [...prev, ...urls]);
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateProduct(id, {
        name,
        description,
        category,
        sku,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        stock: parseInt(stock, 10),
        lowStockAlert: lowStockAlert ? parseInt(lowStockAlert, 10) : undefined,
        status,
        images,
      });
      router.push("/vendor/products");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-9 text-[13px] text-[#888]">Loading product…</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-9">
      <div className="flex items-center gap-4 mb-1">
        <Link
          href="/vendor/products"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#efefef] rounded-[8px] text-[16px] hover:bg-[#f9f9f9] transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-[24px] font-bold text-[#0a0a0a]">Edit Product</h1>
          <p className="text-[13px] text-[#888] mt-0.5">Update the details for this product</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/vendor/products"
            className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-[#4caf50] rounded-[8px] hover:bg-[#43a047] transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-6 items-start">
        {/* Left Column */}
        <div className="flex-1 space-y-5">
          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Basic Information</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Product Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Akwaaba Fufu 750g"
                  className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">SKU / Barcode</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AKW-FUFU-750"
                    className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Pricing</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Price (USD)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Compare at Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Inventory</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Stock Quantity</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px] mb-2">Low Stock Alert</label>
                <input
                  type="number"
                  min="0"
                  value={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.value)}
                  placeholder="10"
                  className="w-full h-[50px] px-4 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[8px] text-[14px] outline-none focus:border-[#4caf50] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[380px] flex-shrink-0 space-y-5">
          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Product Images</h3>
            </div>
            <div className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                className="border-2 border-dashed border-[#e8e8e8] rounded-[12px] p-8 flex flex-col items-center justify-center text-center min-h-[160px] hover:border-[#4caf50] transition-colors cursor-pointer"
              >
                {uploading ? (
                  <p className="text-[13px] text-[#888]">Uploading…</p>
                ) : (
                  <>
                    <span className="text-[32px] mb-2">📁</span>
                    <p className="text-[13px] font-semibold text-[#0a0a0a]">Drop images here</p>
                    <p className="text-[12px] text-[#888] mt-1">or click to browse</p>
                    <p className="text-[11px] text-[#bbb] mt-2">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              {uploadError && (
                <p className="mt-2 text-[12px] text-red-600">{uploadError}</p>
              )}
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-16 h-16 object-cover rounded-[8px] border border-[#e8e8e8]" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[#0a0a0a] text-white rounded-full text-[10px] flex items-center justify-center leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
            <div className="border-b border-[#efefef] px-6 py-4">
              <h3 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-[0.5px]">Visibility</h3>
            </div>
            <div className="p-6 space-y-3">
              {["Active", "Draft", "Archived"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setStatus(opt)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${status === opt ? "border-[#4caf50]" : "border-[#e8e8e8]"}`}
                  >
                    {status === opt && <div className="w-2 h-2 rounded-full bg-[#4caf50]" />}
                  </div>
                  <span className="text-[13px] text-[#0a0a0a]">
                    {opt === "Active" ? "Active — visible on store" : opt === "Draft" ? "Draft — hidden from store" : "Archived"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
