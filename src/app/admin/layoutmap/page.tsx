"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ProjectPlot } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Check, MapPin, Save, LayoutGrid, Upload, Image as ImageIcon } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusColors: Record<string, string> = {
  available: "bg-green-500",
  sold: "bg-red-500",
  reserved: "bg-amber-500",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  reserved: "Reserved",
};

export default function LayoutMapAdmin() {
  const [plots, setPlots] = useState<ProjectPlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProjectPlot | null>(null);
  const [form, setForm] = useState<Partial<ProjectPlot>>({ status: "available", facing: "East" });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("project_plots").select("*").order("plot_number", { ascending: true });
    if (data) setPlots(data);
  }

  useEffect(() => { load(); }, []);

  async function uploadImage(file: File): Promise<string | null> {
    try {
      console.log("Uploading image:", file.name);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `layout-maps/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      console.log("Image uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Skip image upload for now (bucket doesn't exist)
      let imageUrl = form.image_url;
      
      // Clean up payload - remove undefined values
      const payload: any = {
        plot_number: form.plot_number,
        sqft: form.sqft,
        price: form.price,
        facing: form.facing,
        status: form.status,
        x: form.x || 0,
        y: form.y || 0,
        width: form.width || 80,
        height: form.height || 60,
      };
      
      // Only include layout_id if it's a valid UUID
      if (form.layout_id && form.layout_id !== '1') {
        payload.layout_id = form.layout_id;
      }
      
      // Only include image_url if it exists
      if (imageUrl) {
        payload.image_url = imageUrl;
      }
      
      console.log("Saving plot with payload:", payload);
      
      if (editing) {
        const { error } = await supabase.from("project_plots").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("project_plots").insert([payload]);
        if (error) throw error;
      }
      
      setShowForm(false);
      setEditing(null);
      setForm({ status: "available", facing: "East" });
      setImageFile(null);
      setImagePreview(null);
      await load();
    } catch (error) {
      console.error("Error saving plot:", error);
      alert("Error saving plot. Please check console for details.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function askRemove(id: string) {
    setSelectedId(id);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedId) return;
    await supabase.from("project_plots").delete().eq("id", selectedId);
    setDialogOpen(false);
    setSelectedId(null);
    await load();
  }

  async function quickStatusChange(id: string, newStatus: string) {
    await supabase.from("project_plots").update({ status: newStatus }).eq("id", id);
    await load();
  }

  const counts = {
    available: plots.filter((p) => p.status === "available").length,
    sold: plots.filter((p) => p.status === "sold").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plot Layout Map</h1>
          <p className="text-gray-500 text-sm mt-1">Manage plot positions, status, and details on the interactive layout map.</p>
        </div>
        <button
          onClick={() => { 
            setEditing(null); 
            setForm({ status: "available", facing: "East" }); 
            setImageFile(null);
            setImagePreview(null);
            setShowForm(true); 
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1195db] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]"
        >
          <Plus size={16} /> Add Plot
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${statusColors[status]} flex items-center justify-center`}>
              <LayoutGrid size={18} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500 capitalize">{statusLabels[status]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Plot" : "Add New Plot"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Plot Number</label>
              <input required placeholder="P-101" value={form.plot_number || ""} onChange={(e) => setForm({ ...form, plot_number: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Area (sqft)</label>
              <input required type="number" placeholder="1200" value={form.sqft || ""} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Price</label>
              <input required placeholder="8.5 Lakhs" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Facing</label>
              <select value={form.facing || "East"} onChange={(e) => setForm({ ...form, facing: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]">
                <option>East</option>
                <option>West</option>
                <option>North</option>
                <option>South</option>
                <option>North-East</option>
                <option>North-West</option>
                <option>South-East</option>
                <option>South-West</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <select value={form.status || "available"} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]">
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Width</label>
              <input type="number" placeholder="80" value={form.width || ""} onChange={(e) => setForm({ ...form, width: Number(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Height</label>
              <input type="number" placeholder="60" value={form.height || ""} onChange={(e) => setForm({ ...form, height: Number(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Plot Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {(imagePreview || form.image_url) ? (
                <div className="relative">
                  <img 
                    src={imagePreview || form.image_url} 
                    alt="Plot preview" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setForm({ ...form, image_url: undefined });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <button type="submit" disabled={loading} className="rounded-lg bg-[#1195db] text-white px-5 py-2 text-sm font-medium hover:bg-[#0a5480] disabled:opacity-50">
            {loading ? "Saving..." : "Save Plot"}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Plot #</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Area</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Facing</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Price</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Position</th>
              <th className="text-right font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plots.map((plot) => (
              <tr key={plot.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{plot.plot_number}</td>
                <td className="px-4 py-3">
                  <select
                    value={plot.status}
                    onChange={(e) => quickStatusChange(plot.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                      plot.status === "available" ? "bg-green-100 text-green-700" :
                      plot.status === "sold" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-600">{plot.sqft} sqft</td>
                <td className="px-4 py-3 text-gray-600">{plot.facing}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{plot.price}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">x:{plot.x} y:{plot.y} ({plot.width}x{plot.height})</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { 
                    setEditing(plot); 
                    setForm(plot); 
                    setImagePreview(plot.image_url || null);
                    setShowForm(true); 
                  }} className="text-gray-500 hover:text-[#1195db] mr-3"><Pencil size={16} /></button>
                  <button onClick={() => askRemove(plot.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {plots.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No plots yet. Add your first plot.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={dialogOpen}
        title="Delete Plot"
        message="Are you sure you want to delete this plot? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDialogOpen(false); setSelectedId(null); }}
      />
    </div>
  );
}
