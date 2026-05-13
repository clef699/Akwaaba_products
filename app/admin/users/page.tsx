"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import UsersTable, { type User } from "@/app/components/UsersTable";
import Pagination from "@/app/components/Pagination";
import { getUsers } from "@/lib/admin";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { value: "all", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "admin", label: "Admin" },
  ];

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    getUsers({ page, search: searchQuery || undefined, role })
      .then((res) => {
        const mapped: User[] = res.users.map((u) => ({
          id: u.id,
          initials: u.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          name: u.name,
          email: u.email,
          role: u.role.toUpperCase() as User["role"],
          joined: new Date(u.joinedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          status: u.status === "active" ? "Active" : "Suspended",
        }));
        setUsers(mapped);
        setTotalPages(Math.max(1, Math.ceil(res.total / res.pageSize)));
      })
      .catch((err) => setError(err.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
  }, [page, searchQuery, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, role]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">All registered users on the platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) bg-white cursor-pointer"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 animate-pulse">
          Loading users…
        </div>
      ) : (
        <UsersTable users={users} />
      )}

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
