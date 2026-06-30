"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1195db] focus:outline-none focus:ring-1 focus:ring-[#1195db]";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showForm) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm]);

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
    setError("");
    setShowForm(true);
  }

  function openEdit(campaign: Campaign) {
    setEditing(campaign);
    setForm(campaign);
    setBenefitsText((campaign.benefits || []).join("\n"));
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setError("");
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
        slug: form.slug?.trim() || slugify(form.title || ""),
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
    closeForm();
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

  const modal = showForm && mounted ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editing ? "Edit Campaign" : "New Campaign"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Public URL: /offers/{form.slug?.trim() || slugify(form.title || "") || "your-slug"}
            </p>
          </div>
          <button type="button" onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto px-6 py-5 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Campaign Title</label>
                <input
                  required
                  value={form.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: editing ? prev.slug : slugify(title),
                    }));
                  }}
                  className={inputClass}
                  placeholder="Pongal Mega Offer 2026"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">URL Slug</label>
                <input
                  required
                  value={form.slug || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  className={inputClass}
                  placeholder="pongal-2026"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Main Headline</label>
              <input
                required
                value={form.headline || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                className={inputClass}
                placeholder="Buy 1 Plot, Get 1 Plot FREE!"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Subtitle</label>
              <textarea
                rows={2}
                value={form.subtitle || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                className={inputClass}
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
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Benefits (one per line)</label>
              <textarea
                rows={4}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                className={inputClass}
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
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={form.end_date || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">WhatsApp Pre-filled Message</label>
              <textarea
                rows={2}
                value={form.whatsapp_message || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Featured Projects</label>
              <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-start gap-2 text-sm cursor-pointer bg-white rounded-lg p-2 border border-gray-100">
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
                  <p className="text-sm text-gray-400 col-span-2">No projects found. Add projects first.</p>
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
          </div>

          <div className="shrink-0 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 bg-white rounded-b-2xl">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
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
  ) : null;

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-[#1195db]" size={24} />
            Festival Campaigns
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create landing pages like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/offers/pongal-2026</code> for ads & WhatsApp.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E6FA3] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#0a5480] shrink-0"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 text-green-700 border border-green-200 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
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
                <tr key={campaign.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{campaign.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">/offers/{campaign.slug}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
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
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/offers/${campaign.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="Preview"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEdit(campaign)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
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
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
                    No campaigns yet. Create your first festival landing page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mounted && modal ? createPortal(modal, document.body) : null}

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
