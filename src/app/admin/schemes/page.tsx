"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, Gift, BadgePercent, Percent } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Scheme {
  id: string;
  title: string;
  tag: string;
  icon: string;
  discount: string;
  description: string;
  benefits: string[];
  valid_till: string;
  cta: string;
  color: string;
  bg_color: string;
  icon_color: string;
  active: boolean;
  order: number;
  created_at: string;
}

const iconOptions = [
  { key: "BadgePercent", label: "Badge Percent", icon: BadgePercent },
  { key: "Gift", label: "Gift", icon: Gift },
  { key: "Percent", label: "Percent", icon: Percent },
];

const colorOptions = [
  { key: "emerald", label: "Emerald", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "blue", label: "Blue", color: "from-[#1195db] to-[#0E6FA3]", bg: "bg-[#e6f2f9]", iconColor: "text-[#0E6FA3]" },
  { key: "amber", label: "Amber", color: "from-amber-500 to-orange-600", bg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "violet", label: "Violet", color: "from-violet-500 to-purple-600", bg: "bg-violet-50", iconColor: "text-violet-600" },
  { key: "rose", label: "Rose", color: "from-rose-500 to-pink-600", bg: "bg-rose-50", iconColor: "text-rose-600" },
];

export default function SchemesPage() {
  const [items, setItems] = useState<Scheme[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Scheme | null>(null);
  const [form, setForm] = useState<Partial<Scheme>>({ active: true, benefits: [] });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [benefitInput, setBenefitInput] = useState("");

  async function load() {
    const { data } = await supabase.from("schemes").select("*").order("order", { ascending: true });
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  function addBenefit() {
    if (benefitInput.trim()) {
      setForm({ ...form, benefits: [...(form.benefits || []), benefitInput.trim()] });
      setBenefitInput("");
    }
  }

  function removeBenefit(index: number) {
    const newBenefits = form.benefits?.filter((_, i) => i !== index) || [];
    setForm({ ...form, benefits: newBenefits });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const { id, created_at, ...payloadRaw } = form as any;
    const selectedColor = colorOptions.find(c => c.key === payloadRaw.color_theme) || colorOptions[0];
    
    const payload = {
      title: payloadRaw.title?.trim() || "",
      tag: payloadRaw.tag?.trim() || "Limited Offer",
      icon: payloadRaw.icon || "BadgePercent",
      discount: payloadRaw.discount?.trim() || "",
      description: payloadRaw.description?.trim() || "",
      benefits: payloadRaw.benefits || [],
      valid_till: payloadRaw.valid_till?.trim() || "",
      cta: payloadRaw.cta?.trim() || "Avail Offer",
      color: selectedColor.color,
      bg_color: selectedColor.bg,
      icon_color: selectedColor.iconColor,
      active: !!payloadRaw.active,
      order: payloadRaw.order || 0,
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
    setForm({ active: true, benefits: [] });
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("schemes").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    load();
  }

  function startEdit(item: Scheme) {
    setEditing(item);
    const colorKey = colorOptions.find(c => c.color === item.color)?.key || "emerald";
    setForm({
      ...item,
      color_theme: colorKey,
    } as any);
    setShowForm(true);
  }

  function startAdd() {
    setEditing(null);
    setForm({ active: true, benefits: [], color_theme: "emerald" } as any);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schemes Management</h1>
          <p className="text-gray-500">Manage special offers and referral programs</p>
        </div>
        <button
          onClick={startAdd}
          className="bg-[#1195db] hover:bg-[#0E6FA3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Scheme
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? "Edit Scheme" : "Add New Scheme"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., Early Bird Discount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <input
                type="text"
                value={form.tag || ""}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., Limited Offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount/Offer</label>
              <input
                type="text"
                required
                value={form.discount || ""}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., 10% Off or ₹10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
              <input
                type="text"
                value={form.valid_till || ""}
                onChange={(e) => setForm({ ...form, valid_till: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., Valid till December 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={form.cta || ""}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="e.g., Avail Offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
              <select
                value={(form as any).color_theme || "emerald"}
                onChange={(e) => setForm({ ...form, color_theme: e.target.value } as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
              >
                {colorOptions.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
              rows={3}
              placeholder="Describe the scheme..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1195db] focus:border-transparent"
                placeholder="Add a benefit and press Enter"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.benefits?.map((benefit, index) => (
                <span key={index} className="bg-[#e6f2f9] text-[#0E6FA3] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {benefit}
                  <button type="button" onClick={() => removeBenefit(index)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
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
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
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
              disabled={loading}
              className="bg-[#1195db] hover:bg-[#0E6FA3] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : <><Check size={18} /> Save</>}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${item.bg_color} rounded-xl flex items-center justify-center shrink-0`}>
                  {item.icon === "Gift" && <Gift size={24} className={item.icon_color} />}
                  {item.icon === "BadgePercent" && <BadgePercent size={24} className={item.icon_color} />}
                  {item.icon === "Percent" && <Percent size={24} className={item.icon_color} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-0.5 bg-[#e6f2f9] text-[#0E6FA3] rounded-full text-xs">{item.tag}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.benefits.map((benefit, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-[#1195db]">{item.discount}</span> • {item.valid_till}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => { setSelectedId(item.id); setDialogOpen(true); }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => { if (selectedId) remove(selectedId); setDialogOpen(false); }}
        title="Delete Scheme"
        message="Are you sure you want to delete this scheme? This action cannot be undone."
      />
    </div>
  );
}
