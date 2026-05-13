"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getUser, patchUserRole, type AdminUser } from "@/lib/admin";

const ROLES = ["customer", "vendor", "admin"];
const DIVISIONS = [
  "division_catalog",
  "division_orders",
  "division_finance",
  "division_logistics",
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getUser(id)
      .then((u) => {
        setUser(u);
        setSelectedRole(u.role);
        setSelectedDivision(u.division ?? "");
      })
      .catch((err) => setError(err.message ?? "Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSaveRole() {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await patchUserRole(
        user.id,
        selectedRole,
        selectedRole === "admin" ? selectedDivision : undefined
      );
      setUser(updated);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveError((err as Error).message ?? "Failed to update role");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error ?? "User not found"}
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Users
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Detail</h1>

      {/* Profile card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-(--primary) rounded-full flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <span
            className={`ml-auto px-3 py-1 text-xs font-bold rounded-full ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {user.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Role</p>
            <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
          </div>
          {user.division && (
            <div>
              <p className="text-gray-500 mb-0.5">Division</p>
              <p className="font-semibold text-gray-900">{user.division}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 mb-0.5">Joined</p>
            <p className="font-semibold text-gray-900">
              {new Date(user.joinedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {user.ordersCount !== undefined && (
            <div>
              <p className="text-gray-500 mb-0.5">Orders</p>
              <p className="font-semibold text-gray-900">{user.ordersCount}</p>
            </div>
          )}
          {user.totalSpent !== undefined && (
            <div>
              <p className="text-gray-500 mb-0.5">Total Spent</p>
              <p className="font-semibold text-gray-900">${user.totalSpent.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Role change */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Change Role</h3>

        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Role updated successfully.
          </div>
        )}
        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {saveError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {selectedRole === "admin" && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
              >
                <option value="">— None —</option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d.replace("division_", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={handleSaveRole}
              disabled={saving}
              className="bg-(--primary) text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
