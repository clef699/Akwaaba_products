interface Product {
  name: string;
  units: number;
  revenue: number;
}

interface TopSellingProductsProps {
  products?: Product[];
}

export default function TopSellingProducts({
  products = [
    { name: "Wireless Earbuds Pro", units: 1245, revenue: 309750 },
    { name: "Kente Tote Bag", units: 987, revenue: 87843 },
    { name: "Shea Butter Set", units: 842, revenue: 29470 },
    { name: "Ankara Print Dress", units: 612, revenue: 88740 },
  ],
}: TopSellingProductsProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Units
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-4 px-4 font-semibold text-gray-900">
                  {product.name}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {product.units.toLocaleString()}
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">
                  ${product.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
