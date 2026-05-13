import Link from "next/link";

export interface Vendor {
  id: string;
  businessName: string;
  email: string;
  commission: number;
  products: number;
  status: "ACTIVE" | "INACTIVE";
  joined: string;
}

interface VendorsTableProps {
  vendors?: Vendor[];
}

const statusStyles = {
  ACTIVE: "bg-(--primary) text-white",
  INACTIVE: "border border-gray-300 text-gray-700 bg-white",
};

export default function VendorsTable({
  vendors = [
    {
      id: "1",
      businessName: "Secret Springs",
      email: "contact@secretsprings.com",
      commission: 12,
      products: 48,
      status: "ACTIVE",
      joined: "May 2024",
    },
    {
      id: "2",
      businessName: "Akwaaba Foods",
      email: "sales@akwaaba.gh",
      commission: 10,
      products: 127,
      status: "ACTIVE",
      joined: "Jan 2023",
    },
    {
      id: "3",
      businessName: "Juna Shea",
      email: "hello@junashea.com",
      commission: 15,
      products: 62,
      status: "ACTIVE",
      joined: "Aug 2023",
    },
    {
      id: "4",
      businessName: "Akwaaba Farms",
      email: "info@akwafarms.com",
      commission: 12,
      products: 83,
      status: "ACTIVE",
      joined: "Mar 2024",
    },
    {
      id: "5",
      businessName: "Bliss Coffee",
      email: "order@blisscoffee.com",
      commission: 10,
      products: 24,
      status: "INACTIVE",
      joined: "Nov 2024",
    },
    {
      id: "6",
      businessName: "Bliss Tea",
      email: "team@blisstea.com",
      commission: 15,
      products: 56,
      status: "ACTIVE",
      joined: "Jun 2024",
    },
    {
      id: "7",
      businessName: "Bliss Chocolates",
      email: "studio@bamako.ml",
      commission: 12,
      products: 31,
      status: "ACTIVE",
      joined: "Feb 2025",
    },
  ],
}: VendorsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Business Name
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Commission
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Products
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-semibold text-gray-900">
                  {vendor.businessName}
                </td>
                <td className="py-4 px-6 text-gray-600">{vendor.email}</td>
                <td className="py-4 px-6 text-gray-900 font-semibold">
                  {vendor.commission}%
                </td>
                <td className="py-4 px-6 text-gray-600">{vendor.products}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${statusStyles[vendor.status]}`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{vendor.joined}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <Link href="#" className="text-(--primary) font-medium hover:underline">
                      Edit
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-red-500 transition">
                      Suspend
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
