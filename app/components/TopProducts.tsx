interface Product {
  name: string;
  vendor: string;
  unitsSold: number;
  revenue: number;
}

interface TopProductsProps {
  products?: Product[];
}

export default function TopProducts({
  products = [
    {
      name: "Secret Springs Bottle Water",
      vendor: "Secret Springs",
      unitsSold: 1245,
      revenue: 309750,
    },
    {
      name: "Akwaaba Grains",
      vendor: "Akwaaba Foods",
      unitsSold: 987,
      revenue: 87843,
    },
    {
      name: "Juna Shea Butter",
      vendor: "Juna Shea",
      unitsSold: 842,
      revenue: 29470,
    },
    {
      name: "Akwaaba Tomatoes",
      vendor: "Akwaaba Farms",
      unitsSold: 612,
      revenue: 88740,
    },
    {
      name: "Bliss Coffee",
      vendor: "Bliss Products",
      unitsSold: 498,
      revenue: 109560,
    },
  ],
}: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Vendor
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                Units Sold
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
                <td className="py-4 px-4 text-gray-600">{product.vendor}</td>
                <td className="py-4 px-4 text-gray-600">
                  {product.unitsSold.toLocaleString()}
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
