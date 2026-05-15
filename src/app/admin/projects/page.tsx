"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Check, Landmark, Building2, Home } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

const categoryOptions = [
  { key: "government", label: "Government Approved", subtitle: "DTCP & RERA", color: "bg-[#1195db]", icon: Landmark },
  { key: "local", label: "Local Body Approved", subtitle: "Panchayat", color: "bg-emerald-600", icon: Building2 },
  { key: "ready", label: "Ready to Build", subtitle: "House Projects", color: "bg-amber-500", icon: Home },
] as const;

type CategoryKey = typeof categoryOptions[number]["key"];

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({ featured: false, category: "government" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryKey | "all">("all");

  async function load() {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);

    // Build clean payload: strip Supabase-managed fields, set empty string defaults
    const { id, created_at, ...payloadRaw } = form as any;
    const payload = {
      title: payloadRaw.title?.trim() || "",
      location: payloadRaw.location?.trim() || "",
      price: payloadRaw.price?.trim() || "",
      area_size: payloadRaw.area_size?.trim() || "",
      approval_status: payloadRaw.approval_status?.trim() || "",
      image_url: payloadRaw.image_url?.trim() || "",
      description: payloadRaw.description?.trim() || "",
      featured: !!payloadRaw.featured,
      category: payloadRaw.category || "government",
    };

    let error;
    if (editing) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert([payload])
        .select()
        .single();
      error = insertError;
    }

    if (error) {
      console.error("Save failed:", error);
      alert(`Save failed: ${error.message}\n\nCheck console for details. Make sure Row Level Security (RLS) policies allow insert/update.`);
      setLoading(false);
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm({ featured: false, category: "government" });
    await load();
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Delete failed:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }
    await load();
  }

  const filtered = activeTab === "all" ? items : items.filter((i) => i.category === activeTab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => { setEditing(null); setForm({ featured: false, category: "government" }); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Projects
        </button>
        {categoryOptions.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === cat.key
                ? `${cat.color} text-white`
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Project" : "Add Project"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border px-3 py-2 text-sm focus:border-[#0E6FA3] focus:outline-none focus:ring-1 focus:ring-[#0E6FA3]" />
            <input required placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border px-3 py-2 text-sm focus:border-[#0E6FA3] focus:outline-none focus:ring-1 focus:ring-[#0E6FA3]" />
            <input required placeholder="Price (e.g., 8.5 Lakhs)" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border px-3 py-2 text-sm focus:border-[#0E6FA3] focus:outline-none focus:ring-1 focus:ring-[#0E6FA3]" />
            <input placeholder="Approval Status" value={form.approval_status || ""} onChange={(e) => setForm({ ...form, approval_status: e.target.value })} className="rounded-lg border px-3 py-2 text-sm focus:border-[#0E6FA3] focus:outline-none focus:ring-1 focus:ring-[#0E6FA3]" />
            {/* Cloudinary Image Upload */}
            <div className="md:col-span-2">
              <CloudinaryUpload
                value={form.image_url || ""}
                onChange={(url) => setForm({ ...form, image_url: url })}
                label="Project Image"
              />
            </div>
            {/* Category Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Project Category</label>
              <div className="grid grid-cols-3 gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.key })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.category === cat.key
                        ? `border-[#1195db] bg-[#1195db]/5 text-[#1195db]`
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <cat.icon size={18} />
                    <div className="text-left">
                      <div>{cat.label}</div>
                      <div className="text-xs opacity-70">{cat.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <textarea required placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm mb-4 focus:border-[#0E6FA3] focus:outline-none focus:ring-1 focus:ring-[#0E6FA3]" rows={3} />
          <label className="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on Homepage
          </label>
          <button type="submit" disabled={loading} className="rounded-lg bg-[#0E6FA3] text-white px-5 py-2 text-sm font-medium hover:bg-[#0a5480] disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Image</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Title</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Category</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Location</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Price</th>
              <th className="text-left font-medium text-gray-500 px-5 py-3">Featured</th>
              <th className="text-right font-medium text-gray-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const cat = categoryOptions.find((c) => c.key === item.category);
              return (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    {item.image_url ? (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-5 py-3">
                    {cat && (
                      <span className={`inline-flex items-center gap-1 ${cat.color} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
                        <cat.icon size={12} />
                        {cat.subtitle}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{item.location}</td>
                  <td className="px-5 py-3 text-gray-600 font-medium">{item.price}</td>
                  <td className="px-5 py-3">{item.featured ? <Check size={16} className="text-green-600" /> : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} className="text-gray-500 hover:text-[#0E6FA3] mr-3"><Pencil size={16} /></button>
                    <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No projects in this category</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
