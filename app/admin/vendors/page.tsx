"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import VendorsTable from "@/app/components/VendorsTable";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Approved sellers on the marketplace</p>
        </div>
        <Link
          href="#"
          className="bg-(--primary) text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
        >
          + Add Vendor
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white cursor-pointer"
        >
          {statuses.map((stat) => (
            <option key={stat.value} value={stat.value}>
              {stat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Vendors Table */}
      <VendorsTable />
    </div>
  );
}
