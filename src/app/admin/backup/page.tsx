"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Database, CheckCircle, AlertCircle, Loader2, Save, RefreshCw, FileJson, Settings } from "lucide-react";

export default function BackupPage() {
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [configStatus, setConfigStatus] = useState<{ configured: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/backup")
      .then((r) => r.json())
      .then((data) => setConfigStatus(data))
      .catch(() => setConfigStatus({ configured: false, message: "Could not check config" }));
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
    } finally {
      setBackingUp(false);
    }
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRestoring(false);
      setBackupFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
        <p className="text-gray-500 text-sm mt-1">
          Protect your data with automatic backups and one-click restore.
        </p>
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

      {result?.success && !error && (
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
        </ul>
      </div>
    </div>
  );
}
