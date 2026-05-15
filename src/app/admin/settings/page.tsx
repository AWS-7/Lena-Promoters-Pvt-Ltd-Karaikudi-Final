"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("*").single().then(({ data }) => {
      if (data) setForm(data);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (form.id) {
      await supabase.from("settings").update(form).eq("id", form.id);
    } else {
      await supabase.from("settings").insert([form]);
    }
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Settings</h1>

      {saved && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl p-4 mb-6">
          <CheckCircle size={18} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={save} className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Contact Details</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">WhatsApp</label>
            <input value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-4">Social Links</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Facebook</label>
            <input value={form.facebook || ""} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Instagram</label>
            <input value={form.instagram || ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">YouTube</label>
            <input value={form.youtube || ""} onChange={(e) => setForm({ ...form, youtube: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-4">SEO Settings</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meta Title</label>
            <input value={form.meta_title || ""} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meta Description</label>
            <input value={form.meta_description || ""} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">OG Image URL</label>
          <input value={form.og_image || ""} onChange={(e) => setForm({ ...form, og_image: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Logo URL</label>
          <input value={form.logo_url || ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>

        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0a5480] disabled:opacity-50">
          <Save size={16} /> {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
