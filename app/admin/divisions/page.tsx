"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, X, Check } from "lucide-react";
import {
  getDivisions,
  createDivision,
  updateDivision,
  type AdminDivision,
  type CreateDivisionPayload,
} from "@/lib/admin";

interface FormState {
  name: string;
  code: string;
  description: string;
}

const emptyForm: FormState = { name: "", code: "", description: "" };

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<AdminDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function loadDivisions() {
    setLoading(true);
    setError(null);
    getDivisions()
      .then(setDivisions)
      .catch((err) => setError(err.message ?? "Failed to load divisions"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDivisions();
  }, []);

  async function handleCreate() {
    setCreating(true);
    setCreateError(null);
    try {
      const payload: CreateDivisionPayload = {
        name: createForm.name.trim(),
        code: createForm.code.trim(),
        description: createForm.description.trim() || undefined,
      };
      const created = await createDivision(payload);
      setDivisions((prev) => [...prev, created]);
      setCreateForm(emptyForm);
      setShowCreate(false);
    } catch (err: unknown) {
      setCreateError((err as Error).message ?? "Failed to create division");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(division: AdminDivision) {
    setEditingId(division.id);
    setEditForm({
      name: division.name,
      code: division.code,
      description: division.description ?? "",
    });
    setSaveError(null);
  }

  async function handleSave(id: string) {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateDivision(id, {
        name: editForm.name.trim(),
        code: editForm.code.trim(),
        description: editForm.description.trim() || undefined,
      });
      setDivisions((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setEditingId(null);
    } catch (err: unknown) {
      setSaveError((err as Error).message ?? "Failed to update division");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Divisions</h1>
          <p className="text-gray-500 text-sm">Manage admin divisions and their access scopes</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(emptyForm); setCreateError(null); }}
          className="flex items-center gap-2 bg-(--primary) text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Division
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">New Division</h2>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {createError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Finance"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={createForm.code}
                onChange={(e) => setCreateForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="e.g. division_finance"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={creating || !createForm.name.trim() || !createForm.code.trim()}
              className="bg-(--primary) text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {saveError}
        </div>
      )}

      {/* Divisions table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-6">
                Name
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                Code
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                Description
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                Staff
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 animate-pulse">
                  Loading divisions…
                </td>
              </tr>
            ) : divisions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No divisions found.
                </td>
              </tr>
            ) : (
              divisions.map((division) => (
                <tr key={division.id} className="hover:bg-gray-50">
                  {editingId === division.id ? (
                    <>
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.code}
                          onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value }))}
                          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{division.staffCount}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(division.id)}
                            disabled={saving}
                            className="p-1.5 bg-(--primary) text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                        {division.name}
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {division.code}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {division.description ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{division.staffCount}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => startEdit(division)}
                          className="flex items-center gap-1.5 text-sm font-medium text-(--primary) hover:opacity-70 transition-opacity"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
