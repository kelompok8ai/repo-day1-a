"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MemorandumPdfUpload } from "@/components/memorandum/MemorandumPdfUpload";

export default function PengusulKirimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pdfFile) {
      setError("Silakan upload file PDF memorandum.");
      return;
    }
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    form.set("file", pdfFile);
    const res = await fetch("/api/pengusul/memorandum", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/pengusul/riwayat"), 1500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal mengirim memorandum.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        title="Kirim Memorandum PDF"
        subtitle="Upload file PDF memorandum ke Corporate Secretary"
      />
      <div className="mx-auto max-w-2xl p-6">
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-semibold text-emerald-800">Memorandum PDF berhasil dikirim!</p>
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Perihal *</label>
              <input
                name="title"
                required
                placeholder="Contoh: Usulan Perubahan Suku Bunga Deposito"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <MemorandumPdfUpload onFileChange={setPdfFile} />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Catatan (opsional)
              </label>
              <textarea
                name="content"
                rows={2}
                placeholder="Catatan jika hardcopy sudah diserahkan ke CorpSec..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !pdfFile}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Mengirim PDF..." : "Submit PDF ke Corporate Secretary"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
