"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Save, ExternalLink, Sparkles } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { supabase } from "@/lib/supabase";
import type { Campaign, Project } from "@/lib/types";

const emptyForm: Partial<Campaign> = {
  slug: "",
  title: "",
  headline: "",
  subtitle: "",
  offer_text: "",
  banner_url: "",
  benefits: [],
  project_ids: [],
  start_date: "",
  end_date: "",
  whatsapp_message: "",
  active: true,
};

export default function CampaignsAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<Partial<Campaign>>(emptyForm);
  const [benefitsText, setBenefitsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function loadCampaigns() {
    const res = await fetch("/api/admin/campaigns");
    if (res.ok) {
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    }
  }

  async function loadProjects() {
    const { data } = await supabase.from("projects").select("id, title, location, price").order("title");
    if (data) setProjects(data as Project[]);
  }

  useEffect(() => {
    loadCampaigns();
    loadProjects();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setBenefitsText("");
    setShowForm(true);
  }

  function openEdit(campaign: Campaign) {
    setEditing(campaign);
    setForm(campaign);
    setBenefitsText((campaign.benefits || []).join("\n"));
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: editing?.id,
        benefits: benefitsText.split("\n").map((line) => line.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    setMessage("Campaign saved successfully!");
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setBenefitsText("");
    await loadCampaigns();
    setTimeout(() => setMessage(""), 3000);
  }

  function askRemove(id: string) {
    setSelectedId(id);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedId) return;
    await fetch(`/api/admin/campaigns?id=${selectedId}`, { method: "DELETE" });
    setDialogOpen(false);
    setSelectedId(null);
    await loadCampaigns();
  }

  function toggleProject(projectId: string) {
    const current = form.project_ids || [];
    const next = current.includes(projectId)
      ? current.filter((id) => id !== projectId)
      : [...current, projectId];
    setForm((prev) => ({ ...prev, project_ids: next }));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-[#1195db]" size={24} />
            Festival Campaigns
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create landing pages like <code className="bg-gray-100 px-1 rounded">/offers/pongal-2026</code> for ads & WhatsApp.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-4 py-2 text-sm font-medium hover:bg-[#0a5480]"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 text-green-700 border border-green-200 px-4 py-3 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Campaign</th>
              <th className="text-left px-5 py-3 font-medium">Dates</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-t border-gray-100">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{campaign.title}</div>
                  <div className="text-xs text-gray-500">/offers/{campaign.slug}</div>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {campaign.start_date || "—"} → {campaign.end_date || "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      campaign.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {campaign.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/offers/${campaign.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      title="Preview"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button
                      onClick={() => openEdit(campaign)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => askRemove(campaign.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                  No campaigns yet. Create your first festival landing page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Campaign" : "New Campaign"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={save} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Campaign Title</label>
                  <input
                    required
                    value={form.title || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Pongal Mega Offer 2026"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">URL Slug</label>
                  <input
                    required
                    value={form.slug || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="pongal-2026"
                  />
                  <p className="text-xs text-gray-400 mt-1">Page URL: /offers/{form.slug || "your-slug"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Main Headline</label>
                <input
                  required
                  value={form.headline || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Buy 1 Plot, Get 1 Plot FREE!"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Subtitle</label>
                <textarea
                  rows={2}
                  value={form.subtitle || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <CloudinaryUpload
                label="Banner Image"
                value={form.banner_url || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, banner_url: url }))}
              />

              <div>
                <label className="text-sm font-medium text-gray-700">Offer Details</label>
                <textarea
                  rows={2}
                  value={form.offer_text || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, offer_text: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Benefits (one per line)</label>
                <textarea
                  rows={4}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder={"Free Patta registration\nGold coin gift\nBank loan assistance"}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={form.end_date || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">WhatsApp Pre-filled Message</label>
                <textarea
                  rows={2}
                  value={form.whatsapp_message || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Featured Projects</label>
                <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
                  {projects.map((project) => (
                    <label key={project.id} className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form.project_ids || []).includes(project.id)}
                        onChange={() => toggleProject(project.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-medium text-gray-900">{project.title}</span>
                        <span className="block text-xs text-gray-500">{project.location}</span>
                      </span>
                    </label>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-gray-400">No projects found. Add projects first.</p>
                  )}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active !== false}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                />
                Campaign is active (visible on public site)
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1195db] text-white text-sm font-medium hover:bg-[#0a5480] disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={dialogOpen}
        title="Delete Campaign"
        message="Are you sure you want to delete this festival campaign? The landing page URL will stop working."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
