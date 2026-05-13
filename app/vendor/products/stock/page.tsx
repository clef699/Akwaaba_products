import Link from "next/link";

const variants = [
  { sku: "AKW-FUFU-750-REG", size: "750g", price: "$8.99", stock: 145, status: "Active" },
  { sku: "AKW-FUFU-1500-LRG", size: "1.5kg", price: "$16.50", stock: 63, status: "Active" },
  { sku: "AKW-FUFU-250-SM", size: "250g", price: "$3.50", stock: 8, status: "Low Stock" },
];

const stockHistory = [
  { date: "May 1, 2026", action: "Restock", qty: "+200", notes: "Monthly restock — 750g variant" },
  { date: "Apr 28, 2026", action: "Sale", qty: "-12", notes: "Order #AKW-0412 fulfilled" },
  { date: "Apr 27, 2026", action: "Sale", qty: "-8", notes: "Order #AKW-0408 fulfilled" },
  { date: "Apr 22, 2026", action: "Adjustment", qty: "-3", notes: "Damaged units written off" },
  { date: "Apr 15, 2026", action: "Restock", qty: "+150", notes: "Emergency restock — 250g variant" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-[#4caf50] text-white",
  "Low Stock": "bg-[#0a0a0a] text-white",
  "Out of Stock": "border border-[#d1d1d1] text-[#3f3f3f]",
};

export default function StockVariantsPage() {
  return (
    <div className="p-9">
      <div className="flex items-center gap-4 mb-1">
        <Link
          href="/vendor/products"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#efefef] rounded-[8px] text-[16px] hover:bg-[#f9f9f9] transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-[24px] font-bold text-[#0a0a0a]">Stock &amp; Variants</h1>
          <p className="text-[13px] text-[#888] mt-0.5">Manage inventory across product variants</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#efefef] rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
            + Add Variant
          </button>
          <button className="h-[39px] px-4 text-[13px] font-semibold text-[#0a0a0a] bg-[#4caf50] rounded-[8px] hover:bg-[#43a047] transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Product selector */}
      <div className="mt-5 mb-6 bg-white border border-[#efefef] rounded-[12px] p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-[8px] bg-gradient-to-br from-[#f4f4f4] to-[#e6e6e6] flex-shrink-0" />
        <div>
          <p className="text-[15px] font-bold text-[#0a0a0a]">Akwaaba Fufu</p>
          <p className="text-[12px] text-[#888]">PRD-001 · Staple Foods · 3 variants</p>
        </div>
        <div className="ml-auto">
          <button className="h-[34px] px-4 text-[13px] font-semibold text-[#888] bg-[#f9f9f9] border border-[#efefef] rounded-[6px] hover:text-[#0a0a0a] transition-colors">
            Change Product ▾
          </button>
        </div>
      </div>

      {/* Variants Table */}
      <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-[#efefef]">
          <h3 className="text-[15px] font-bold text-[#0a0a0a]">Product Variants</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
              {["SKU", "SIZE", "PRICE", "STOCK QTY", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.sku} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                <td className="px-5 py-4 text-[13px] font-bold text-[#4caf50]">{v.sku}</td>
                <td className="px-5 py-4 text-[14px] font-semibold text-[#0a0a0a]">{v.size}</td>
                <td className="px-5 py-4 text-[14px] font-bold text-[#0a0a0a]">{v.price}</td>
                <td className="px-5 py-4">
                  <input
                    type="number"
                    defaultValue={v.stock}
                    className="w-20 h-9 px-3 bg-[#f9f9f9] border border-[#e8e8e8] rounded-[6px] text-[14px] text-center outline-none focus:border-[#4caf50]"
                  />
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${statusStyles[v.status]}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="px-3 py-1.5 text-[13px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock History */}
      <div className="bg-white border border-[#efefef] rounded-[12px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#efefef]">
          <h3 className="text-[15px] font-bold text-[#0a0a0a]">Stock History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e6e6e6]">
              {["DATE", "ACTION", "QTY CHANGE", "NOTES"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-[#0a0a0a] tracking-[0.4px] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((h, i) => (
              <tr key={i} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                <td className="px-5 py-4 text-[14px] text-[#0a0a0a]">{h.date}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.3px] ${
                    h.action === "Restock" ? "bg-[#4caf50] text-white" :
                    h.action === "Sale" ? "bg-[#0a0a0a] text-white" :
                    "bg-[#efefef] text-[#555]"
                  }`}>
                    {h.action}
                  </span>
                </td>
                <td className={`px-5 py-4 text-[14px] font-bold ${h.qty.startsWith("+") ? "text-[#3d9140]" : "text-[#0a0a0a]"}`}>
                  {h.qty}
                </td>
                <td className="px-5 py-4 text-[14px] text-[#888]">{h.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
