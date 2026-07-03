"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function PengusulKirimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/pengusul/memorandum", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/pengusul/riwayat"), 1500);
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        title="Kirim Memorandum"
        subtitle="Upload scan/file memorandum ke Corporate Secretary"
      />
      <div className="mx-auto max-w-2xl p-6">
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-semibold text-emerald-800">Memorandum berhasil dikirim!</p>
            <p className="mt-1 text-sm text-emerald-600">Mengalihkan ke riwayat...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  No. Memorandum *
                </label>
                <input
                  name="number"
                  required
                  placeholder="MEM/2026/0001"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tanggal Memorandum *
                </label>
                <input
                  name="memoDate"
                  type="date"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Perihal *
              </label>
              <input
                name="title"
                required
                placeholder="Contoh: Usulan Perubahan Suku Bunga Deposito"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Upload Scan/File Memorandum *
              </label>
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-8 hover:border-emerald-400">
                {fileName ? (
                  <>
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">{fileName}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Klik untuk upload scan</span>
                    <span className="text-xs text-slate-500">PDF, DOC, JPG, PNG</span>
                  </>
                )}
                <input
                  name="file"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Catatan (opsional)
              </label>
              <textarea
                name="content"
                rows={2}
                placeholder="Catatan tambahan jika hardcopy sudah diserahkan ke CorpSec..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Mengirim..." : "Submit ke Corporate Secretary"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
