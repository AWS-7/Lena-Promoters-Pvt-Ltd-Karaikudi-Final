"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, ImageIcon } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

interface Scheme {
  id: string;
  image_url: string;
  title: string | null;
  order: number;
  active: boolean;
  created_at: string;
}

export default function SchemesPage() {
  const [items, setItems] = useState<Scheme[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Scheme | null>(null);
  const [form, setForm] = useState<Partial<Scheme>>({ active: true, order: 0, image_url: "" });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("schemes")
      .select("id, image_url, title, order, active, created_at")
      .order("order", { ascending: true });
    if (data) setItems(data as Scheme[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading || imageUploading) return;

    if (!form.image_url?.trim()) {
      alert("Please upload an image before saving.");
      return;
    }

    setLoading(true);

    const payload = {
      image_url: form.image_url.trim(),
      title: form.title?.trim() || null,
      order: Number(form.order) || 0,
      active: !!form.active,
    };

    let error;
    if (editing) {
      const { error: updateError } = await supabase
        .from("schemes")
        .update(payload)
        .eq("id", editing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("schemes").insert(payload);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      alert("Error saving: " + error.message);
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm({ active: true, order: 0, image_url: "" });
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("schemes").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    load();
  }

  function startEdit(item: Scheme) {
    setEditing(item);
    setForm({
      image_url: item.image_url,
      title: item.title,
      order: item.order,
      active: item.active,
    });
    setShowForm(true);
  }

  function startAdd() {
    setEditing(null);
    setForm({ active: true, order: items.length, image_url: "" });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schemes Management</h1>
          <p className="text-gray-500">Upload scheme posters / images shown on the homepage</p>
        </div>
        <button
          onClick={startAdd}
          className="bg-[#1195db] hover:bg-[#0E6FA3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Scheme Image
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? "Edit Scheme Image" : "Add New Scheme Image"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div>
            <CloudinaryUpload
              value={form.image_url || ""}
              onChange={(url) => setForm({ ...form, image_url: url })}
              onLoadingChange={setImageUploading}
              label="Scheme Image (Portrait recommended, e.g. 800x1200)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional, for alt text)</label>
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., Lucky Buyer Scheme"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                min={0}
                value={form.order ?? 0}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active || false}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 text-[#1195db] rounded focus:ring-[#1195db]"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active (show on website)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="bg-[#1195db] hover:bg-[#0E6FA3] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : imageUploading ? "Uploading image..." : (<><Check size={18} /> Save</>)}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && (
          <div className="col-span-full bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            <ImageIcon className="mx-auto mb-3 text-gray-400" size={36} />
            No scheme images yet. Click "Add Scheme Image" to upload your first one.
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative aspect-[3/4] w-full bg-gray-100">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title || "Scheme"}
                  fill
                  sizes="(max-width: 640px) 90vw, 30vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon size={36} />
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                  #{item.order}
                </span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800 truncate">
                {item.title || "Untitled"}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedId(item.id);
                    setDialogOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          if (selectedId) remove(selectedId);
          setDialogOpen(false);
        }}
        title="Delete Scheme Image"
        message="Are you sure you want to delete this scheme image? This action cannot be undone."
      />
    </div>
  );
}
