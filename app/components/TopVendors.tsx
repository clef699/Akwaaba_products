interface Vendor {
  name: string;
  totalSales: number;
}

interface TopVendorsProps {
  vendors?: Vendor[];
}

export default function TopVendors({
  vendors = [
    { name: "TechHub GH", totalSales: 412820 },
    { name: "Adinkra Crafts", totalSales: 187420 },
    { name: "Lagos Style Co.", totalSales: 142180 },
    { name: "Nuru Beauty", totalSales: 88420 },
  ],
}: TopVendorsProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Top Vendors</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Vendor
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Total Sales
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-4 px-4 font-semibold text-gray-900">
                  {vendor.name}
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">
                  ${vendor.totalSales.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
