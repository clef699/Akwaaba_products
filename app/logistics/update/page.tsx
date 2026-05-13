import Link from "next/link";

export default function UpdateStatusPage() {
  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0a0a0a] tracking-[-0.5px]">Update Shipment Status</h1>
          <p className="text-[14px] text-[#6b6b6b] mt-1">Change the dispatch state of a shipment</p>
        </div>
      </div>

      <div className="max-w-[560px]">
        <div className="bg-white border border-[#e6e6e6] rounded-[10px] p-8 space-y-6">
          {/* Shipment ID lookup */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Shipment ID</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="#SHP-9821"
                className="flex-1 h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors placeholder:text-[#b0b0b0]"
              />
              <button className="h-[44px] px-5 text-[14px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors flex-shrink-0">
                Find
              </button>
            </div>
          </div>

          {/* Current shipment preview */}
          <div className="bg-[#f9f9f9] border border-[#e6e6e6] rounded-[8px] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-bold text-[#0a0a0a]">#SHP-9821</p>
              <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-[0.3px] bg-[#0a0a0a] text-white">
                In Transit
              </span>
            </div>
            <p className="text-[12px] text-[#6b6b6b]">14 Independence Ave, Accra · Linked to <span className="text-[#4caf50] font-semibold">#AKW-0418</span></p>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">New Status</label>
            <select className="w-full h-[44px] px-4 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors">
              <option value="">Select new status...</option>
              <option value="created">Created</option>
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[13px] font-medium text-[#3f3f3f] mb-2">Add a note</label>
            <textarea
              placeholder="Optional — add any notes about this status update"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[#e6e6e6] rounded-[6px] text-[14px] text-[#0a0a0a] outline-none focus:border-[#4caf50] transition-colors resize-none placeholder:text-[#b0b0b0]"
            />
          </div>

          {/* Notify checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#4caf50] cursor-pointer"
            />
            <span className="text-[14px] text-[#0a0a0a]">Notify customer by email</span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button className="flex-1 h-[53px] text-[15px] font-semibold text-white bg-[#4caf50] rounded-[6px] hover:bg-[#43a047] transition-colors">
              Confirm Update
            </button>
            <Link
              href="/logistics/shipments"
              className="flex-1 h-[53px] text-[15px] font-semibold text-[#0a0a0a] bg-white border border-[#e6e6e6] rounded-[6px] hover:bg-[#f9f9f9] transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
