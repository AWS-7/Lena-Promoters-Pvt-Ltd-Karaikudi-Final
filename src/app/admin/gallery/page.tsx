"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryImage } from "@/lib/types";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState<Partial<GalleryImage>>({ order: 0 });

  async function load() {
    const { data } = await supabase.from("gallery").select("*").order("order", { ascending: true });
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await supabase.from("gallery").update(form).eq("id", editing.id);
    } else {
      await supabase.from("gallery").insert([form]);
    }
    setShowForm(false); setEditing(null); setForm({ order: 0 }); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <button onClick={() => { setEditing(null); setForm({ order: items.length + 1 }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit" : "Add"} Image</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required placeholder="Category" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required type="number" placeholder="Order" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="rounded-lg bg-[#0E6FA3] text-white px-5 py-2 text-sm font-medium hover:bg-[#0a5480]">Save</button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left font-medium text-gray-500 px-5 py-3">Title</th><th className="text-left font-medium text-gray-500 px-5 py-3">Category</th><th className="text-left font-medium text-gray-500 px-5 py-3">Order</th><th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-5 py-3 font-medium text-gray-900">{item.title}</td>
                <td className="px-5 py-3 text-gray-600">{item.category}</td>
                <td className="px-5 py-3 text-gray-600">{item.order}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} className="text-gray-500 hover:text-[#0E6FA3] mr-3"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No gallery items yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
