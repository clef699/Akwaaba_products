"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { getMe, updateProfile, getStoredUser, type User } from "@/lib/auth";
import { uploadImage } from "@/lib/uploads";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function toForm(user: User): Partial<FormState> {
  const parts = user.name.trim().split(" ");
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    email: user.email,
    phone: user.phone ?? "",
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        setForm((prev) => ({ ...prev, ...toForm(u) }));
      })
      .catch((err) => setLoadError(err.message ?? "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, ...toForm(user) }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveSuccess(false);
  };

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const updated = await updateProfile({
        name: name || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      setUser(updated);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveError((err as Error).message ?? "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      const url = await uploadImage(file);
      const updated = await updateProfile({ avatarUrl: url });
      setUser(updated);
    } catch (err) {
      setAvatarError((err as Error).message);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  }

  function handleCancel() {
    if (user) setForm((prev) => ({ ...prev, ...toForm(user) }));
    setSaveError(null);
    setSaveSuccess(false);
  }

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const joinedLabel = user?.joinedAt
    ? `Customer since ${new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    : "Customer";

  if (loadError) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-3xl font-bold text-(--dark)">My Profile</h1>
        <p className="text-gray-400 text-sm">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-3xl">
        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 object-cover rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-gray-500">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-(--primary) rounded-full flex items-center justify-center shadow disabled:opacity-50"
            >
              <Camera size={13} className="text-white" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-(--dark)">
              {loading ? <span className="inline-block w-32 h-5 bg-gray-100 rounded animate-pulse" /> : user?.name}
            </h2>
            <p className="text-gray-400 text-sm">{joinedLabel}</p>
          </div>
        </div>

        {/* Feedback banners */}
        {saveSuccess && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Profile updated successfully.
          </div>
        )}
        {saveError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {saveError}
          </div>
        )}
        {avatarError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Avatar upload failed: {avatarError}
          </div>
        )}

        {/* Personal info */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="+233 24 000 0000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary) disabled:opacity-50"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 my-6" />

        {/* Change password */}
        <h3 className="text-base font-bold text-(--dark) mb-5">Change Password</h3>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)"
          />
        </div>
        <div className="grid grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-(--primary) text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="border border-gray-200 text-(--dark) font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
