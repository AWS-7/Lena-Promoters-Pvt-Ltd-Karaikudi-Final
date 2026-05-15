"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>({ rating: 5 });

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await supabase.from("testimonials").update(form).eq("id", editing.id);
    } else {
      await supabase.from("testimonials").insert([form]);
    }
    setShowForm(false); setEditing(null); setForm({ rating: 5 }); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={() => { setEditing(null); setForm({ rating: 5 }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit" : "Add"} Testimonial</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required type="number" min={1} max={5} placeholder="Rating" value={form.rating || 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
          </div>
          <textarea required placeholder="Message" value={form.message || ""} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm mb-4" rows={3} />
          <button type="submit" className="rounded-lg bg-[#0E6FA3] text-white px-5 py-2 text-sm font-medium hover:bg-[#0a5480]">Save</button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left font-medium text-gray-500 px-5 py-3">Name</th><th className="text-left font-medium text-gray-500 px-5 py-3">Location</th><th className="text-left font-medium text-gray-500 px-5 py-3">Rating</th><th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-5 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-5 py-3 text-gray-600">{item.location}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} className="text-gray-500 hover:text-[#0E6FA3] mr-3"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No testimonials yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
