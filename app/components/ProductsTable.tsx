import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number | string;
  vendor: string;
  status: "ACTIVE" | "INACTIVE";
  image?: string;
}

interface ProductsTableProps {
  products?: Product[];
}

const statusStyles = {
  ACTIVE: "bg-(--primary) text-white",
  INACTIVE: "border border-gray-300 text-gray-700 bg-white",
};

export default function ProductsTable({
  products = [
    {
      id: "1",
      name: "Bliss Chocolates",
      category: "Bliss Products",
      price: 89,
      stock: 124,
      vendor: "Bliss Products",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Juna Shea Cream",
      category: "Juna Shea",
      price: 249,
      stock: 42,
      vendor: "Juna Shea",
      status: "ACTIVE",
    },
    {
      id: "3",
      name: "Juna Shea Butter",
      category: "Juna Shea",
      price: 35,
      stock: 318,
      vendor: "Juna Shea",
      status: "ACTIVE",
    },
    {
      id: "4",
      name: "Fresh Tomatoes",
      category: "Akwaaba Foods",
      price: 145,
      stock: 67,
      vendor: "Akwaaba Foods",
      status: "ACTIVE",
    },
    {
      id: "5",
      name: "Bliss Coffee",
      category: "Bliss Products",
      price: 220,
      stock: 18,
      vendor: "Bliss Products",
      status: "INACTIVE",
    },
    {
      id: "6",
      name: "Secret Springs Bottle",
      category: "Secret Springs",
      price: 55,
      stock: 94,
      vendor: "Secret Springs",
      status: "ACTIVE",
    },
    {
      id: "7",
      name: "Mineral Water",
      category: "Secret Springs",
      price: 389,
      stock: "Out",
      vendor: "Secret Springs",
      status: "INACTIVE",
    },
    {
      id: "8",
      name: "Akwaaba Farms",
      category: "Akwaaba Farms",
      price: 180,
      stock: 28,
      vendor: "Akwaaba Farms",
      status: "ACTIVE",
    },
  ],
}: ProductsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Price
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Stock
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Vendor
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
                    <p className="font-semibold text-gray-900">{product.name}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{product.category}</td>
                <td className="py-4 px-6 font-semibold text-gray-900">${product.price}</td>
                <td className="py-4 px-6 text-gray-600">
                  {typeof product.stock === "string" ? product.stock : product.stock}
                </td>
                <td className="py-4 px-6 text-gray-600">{product.vendor}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <Link href="#" className="text-(--primary) font-medium hover:underline">
                      Edit
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-red-500 transition">
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
