"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download, Upload, Database, CheckCircle, AlertCircle, Loader2, Save,
  RefreshCw, FileJson, Settings, Activity, HardDrive, Cloud, Bell, X,
  ShieldAlert, Zap, ArrowDown
} from "lucide-react";

interface QuotaData {
  supabase: {
    db: { usedMB: number; limitMB: number; percent: number; estimated?: boolean };
    storage: { usedMB: number; limitMB: number; percent: number };
  };
  cloudinary: {
    storage?: { usedMB: number; limitMB: number; percent: number };
    credits?: number;
    bandwidthMB?: number;
    configured: boolean;
  };
  status: "ok" | "warning" | "critical";
  thresholds: { warning: number; critical: number };
  checkedAt: string;
  setupNote?: string;
}

interface Toast {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}

function UsageBar({ label, used, limit, percent, estimated, color = "blue" }: {
  label: string; used: number; limit: number; percent: number; estimated?: boolean; color?: string;
}) {
  const isWarning = percent >= 80 && percent < 90;
  const isCritical = percent >= 90;
  const barColor = isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : color === "green" ? "bg-emerald-500" : "bg-[#1195db]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 flex items-center gap-2">
          {label}
          {estimated && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">estimate</span>}
        </span>
        <span className={`font-semibold ${isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-gray-600"}`}>
          {percent}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-400">
        {used} MB / {limit} MB
      </div>
    </div>
  );
}

type StorageProvider = "cloudinary" | "supabase";

export default function BackupPage() {
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [configStatus, setConfigStatus] = useState<{ configured: boolean; message: string } | null>(null);
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState<{ timestamp: string; triggered: boolean } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [storageProvider, setStorageProvider] = useState<StorageProvider>("cloudinary");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoTriggeredRef = useRef(false);

  const addToast = useCallback((type: Toast["type"], title: string, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  async function fetchQuota(retry = 0) {
    setQuotaLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch("/api/quota", { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        setQuota(data);
        setError("");
        // Auto-backup trigger at 90%
        if (data.status === "critical" && !autoTriggeredRef.current) {
          autoTriggeredRef.current = true;
          addToast("warning", "Critical Usage Detected", "Auto-backup triggered due to high storage usage.");
          await runAutoBackup();
        }
      } else {
        setError(data.error || "Quota check failed");
      }
    } catch (err: any) {
      if (retry < 1 && err?.name !== "AbortError") {
        setTimeout(() => fetchQuota(retry + 1), 3000);
        return;
      }
      console.error("Quota fetch error:", err?.message || err);
    } finally {
      setQuotaLoading(false);
    }
  }

  async function runAutoBackup() {
    try {
      setBackingUp(true);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggered: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastBackup({ timestamp: data.timestamp, triggered: true });
        addToast("success", "Auto-Backup Complete", `Backup saved at ${new Date(data.timestamp).toLocaleString()}`);
        // Keep the result for download
        setResult(data);
      } else {
        addToast("error", "Auto-Backup Failed", data.error || "Could not create backup");
      }
    } catch (err: any) {
      addToast("error", "Auto-Backup Failed", err.message);
    } finally {
      setBackingUp(false);
    }
  }

  // Load storage provider preference
  useEffect(() => {
    const saved = localStorage.getItem("lena_storage_provider") as StorageProvider;
    if (saved && (saved === "cloudinary" || saved === "supabase")) {
      setStorageProvider(saved);
    }
  }, []);

  const handleProviderChange = (provider: StorageProvider) => {
    setStorageProvider(provider);
    localStorage.setItem("lena_storage_provider", provider);
    addToast("info", "Storage Provider Changed", `Images will now upload to ${provider === "supabase" ? "Supabase Storage" : "Cloudinary"}`);
  };

  useEffect(() => {
    fetch("/api/backup")
      .then((r) => r.json())
      .then((data) => setConfigStatus(data))
      .catch(() => setConfigStatus({ configured: false, message: "Could not check config" }));
    fetchQuota();
    // Poll every 60 minutes to avoid free-tier rate limits
    const interval = setInterval(() => fetchQuota(), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleBackup() {
    setBackingUp(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Backup failed");

      setResult(data);
      setLastBackup({ timestamp: data.timestamp, triggered: false });
      addToast("success", "Backup Created", "Your backup is ready for download.");

      // Auto-download JSON
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lena_backup_${data.timestamp.replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
      addToast("error", "Backup Failed", err.message);
    } finally {
      setBackingUp(false);
    }
  }

  function downloadLastBackup() {
    if (!result?.data) return;
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lena_backup_${result.timestamp.replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleRestore() {
    if (!backupFile) {
      setError("Please select a backup JSON file");
      return;
    }

    setRestoring(true);
    setError("");
    setResult(null);

    try {
      const text = await backupFile.text();
      const backupData = JSON.parse(text);

      const res = await fetch("/api/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: backupData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");

      setResult(data);
      addToast("success", "Restore Complete", `${data.totalInserted} records restored.`);
    } catch (err: any) {
      setError(err.message);
      addToast("error", "Restore Failed", err.message);
    } finally {
      setRestoring(false);
      setBackupFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isWarning = quota?.status === "warning";
  const isCritical = quota?.status === "critical";

  return (
    <div className="space-y-8 max-w-4xl relative">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white border shadow-lg rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-right fade-in duration-300 max-w-sm ${
              toast.type === "error" ? "border-red-200" : toast.type === "warning" ? "border-amber-200" : "border-gray-100"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              toast.type === "error" ? "bg-red-100 text-red-600" :
              toast.type === "warning" ? "bg-amber-100 text-amber-600" :
              toast.type === "info" ? "bg-blue-100 text-blue-600" :
              "bg-green-100 text-green-600"
            }`}>
              {toast.type === "error" ? <AlertCircle size={16} /> :
               toast.type === "warning" ? <ShieldAlert size={16} /> :
               toast.type === "info" ? <Bell size={16} /> :
               <CheckCircle size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">{toast.title}</div>
              <div className="text-xs text-gray-500">{toast.message}</div>
            </div>
            <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
        <p className="text-gray-500 text-sm mt-1">
          Protect your data with automatic backups and one-click restore.
        </p>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isCritical ? "bg-red-100" : isWarning ? "bg-amber-100" : "bg-[#e6f2f9]"
            }`}>
              <Activity size={20} className={isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-[#1195db]"} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">System Status</h2>
              <p className="text-sm text-gray-500">
                {quotaLoading ? "Checking usage..." :
                 isCritical ? "Critical: Immediate action required" :
                 isWarning ? "Warning: Usage approaching limits" :
                 "All systems healthy"}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchQuota()}
            disabled={quotaLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Refresh quota"
          >
            <RefreshCw size={18} className={quotaLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Status Alerts */}
        {isCritical && (
          <div className="mb-5 flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Critical Usage Alert</p>
              <p className="mt-1">One or more services have exceeded 90% usage. An automatic backup has been triggered.</p>
              {lastBackup?.triggered && (
                <p className="mt-1 text-xs text-red-500">
                  Auto-backup: {new Date(lastBackup.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
        {isWarning && !isCritical && (
          <div className="mb-5 flex items-start gap-3 text-amber-700 text-sm bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <Zap size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Usage Warning</p>
              <p className="mt-1">Usage is above 80%. Consider creating a manual backup or upgrading your plan.</p>
            </div>
          </div>
        )}

        {/* Usage Bars */}
        {quota ? (
          <div className="space-y-5">
            <UsageBar
              label="Supabase Database"
              used={quota.supabase.db.usedMB}
              limit={quota.supabase.db.limitMB}
              percent={quota.supabase.db.percent}
              estimated={quota.supabase.db.estimated}
            />
            <UsageBar
              label="Supabase Storage"
              used={quota.supabase.storage.usedMB}
              limit={quota.supabase.storage.limitMB}
              percent={quota.supabase.storage.percent}
              color="green"
            />
            {quota.cloudinary.configured && quota.cloudinary.storage && (
              <UsageBar
                label="Cloudinary Storage"
                used={quota.cloudinary.storage.usedMB}
                limit={quota.cloudinary.storage.limitMB}
                percent={quota.cloudinary.storage.percent}
              />
            )}
            {!quota.cloudinary.configured && (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <Cloud size={14} />
                Cloudinary quota not configured. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to monitor usage.
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400 py-4 text-center">
            {quotaLoading ? "Loading usage data..." : "Unable to load quota data"}
          </div>
        )}

        {quota?.setupNote && (
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <p className="font-medium mb-1">Setup tip for accurate DB size:</p>
            <code className="block bg-gray-100 rounded p-2 text-[11px] font-mono break-all">
              {quota.setupNote}
            </code>
          </div>
        )}

        {/* Last Backup Info */}
        {lastBackup && (
          <div className="mt-5 pt-4 border-t flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Last backup:</span>{" "}
              <span className="font-medium text-gray-700">
                {new Date(lastBackup.timestamp).toLocaleString()}
              </span>
              {lastBackup.triggered && (
                <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                  Auto-triggered
                </span>
              )}
            </div>
            {result?.data && (
              <button
                onClick={downloadLastBackup}
                className="inline-flex items-center gap-1.5 text-sm text-[#1195db] hover:text-[#0a5480] font-medium transition-colors"
              >
                <ArrowDown size={16} />
                Download
              </button>
            )}
          </div>
        )}
      </div>

      {/* Storage Provider Toggle */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#e6f2f9] flex items-center justify-center">
            <HardDrive size={20} className="text-[#1195db]" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Image Storage Provider</h2>
            <p className="text-sm text-gray-500">Switch where uploaded images are stored</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => handleProviderChange("cloudinary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              storageProvider === "cloudinary"
                ? "bg-white text-[#1195db] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Cloud size={16} />
            Cloudinary
          </button>
          <button
            onClick={() => handleProviderChange("supabase")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              storageProvider === "supabase"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database size={16} />
            Supabase Storage
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          {storageProvider === "cloudinary" ? (
            <>
              <p className="flex items-center gap-1">
                <CheckCircle size={12} className="text-green-500" />
                Images upload to <strong>Cloudinary</strong> with Supabase backup
              </p>
              <p className="text-amber-600">Switch to Supabase if Cloudinary storage is full</p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1">
                <CheckCircle size={12} className="text-green-500" />
                Images upload directly to <strong>Supabase Storage</strong>
              </p>
              <p className="text-amber-600">Cloudinary quota exceeded — using Supabase as primary storage</p>
            </>
          )}
        </div>
      </div>

      {/* Config Status Banner */}
      {configStatus && !configStatus.configured && (
        <div className="flex items-start gap-3 text-amber-700 text-sm bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <Settings size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Setup Required</p>
            <p className="mt-1">{configStatus.message}</p>
            <ol className="mt-2 list-decimal list-inside text-xs space-y-1">
              <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="underline font-medium">Vercel Dashboard</a></li>
              <li>Project → Settings → Environment Variables</li>
              <li>Add: <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code></li>
              <li>Get the key from Supabase → Settings → API → service_role</li>
              <li>Redeploy the project</li>
            </ol>
          </div>
        </div>
      )}

      {/* Status Alert */}
      {error && (
        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result?.success && !error && !lastBackup?.triggered && (
        <div className="flex items-start gap-2 text-green-600 text-sm bg-green-50 p-4 rounded-xl">
          <CheckCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">
              {result.totalInserted !== undefined
                ? `Restore completed: ${result.totalInserted} records inserted`
                : `Backup completed: ${result.timestamp}`}
            </p>
            {result.counts && (
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                {Object.entries(result.counts).map(([table, count]) => (
                  <span key={table} className="text-gray-600">
                    {table}: {count as number}
                  </span>
                ))}
              </div>
            )}
            {result.results && (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                {Object.entries(result.results).map(([table, info]: [string, any]) => (
                  <div key={table} className="flex items-center gap-2">
                    <span className={info.error ? "text-red-500" : "text-green-600"}>
                      {info.error ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    </span>
                    <span>{table}: {info.inserted} rows {info.error ? `(${info.error})` : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backup Section */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#e6f2f9] flex items-center justify-center">
            <Database size={20} className="text-[#1195db]" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Create Backup</h2>
            <p className="text-sm text-gray-500">Export all database tables and download as JSON</p>
          </div>
        </div>

        <button
          onClick={handleBackup}
          disabled={backingUp}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1195db] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0a5480] disabled:opacity-50 transition-colors"
        >
          {backingUp ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {backingUp ? "Backing up..." : "Backup Now"}
        </button>
      </div>

      {/* Restore Section */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#e6f2f9] flex items-center justify-center">
            <RefreshCw size={20} className="text-[#1195db]" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Restore from Backup</h2>
            <p className="text-sm text-gray-500">Upload a backup JSON file to restore data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#1195db] hover:bg-[#1195db]/5 transition-all"
          >
            <FileJson size={32} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">
              {backupFile ? backupFile.name : "Click to select backup JSON file"}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Only .json files exported from this system
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            onClick={handleRestore}
            disabled={restoring || !backupFile}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {restoring ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {restoring ? "Restoring..." : "Restore Now"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">Important Notes:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Backup creates a JSON file with all your database tables</li>
          <li>Images stored in Supabase Storage backups bucket are included</li>
          <li>Restore will generate new IDs for all records (to avoid conflicts)</li>
          <li>Existing data is NOT deleted during restore — new records are appended</li>
          <li>Auto-backup triggers when any quota reaches 90%</li>
          <li>Quota is checked every 30 minutes while this page is open</li>
        </ul>
      </div>
    </div>
  );
}
