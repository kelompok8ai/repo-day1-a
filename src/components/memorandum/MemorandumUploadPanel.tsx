"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MemorandumPdfUpload } from "./MemorandumPdfUpload";

export function MemorandumUploadPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pdfFile) {
      setError("Silakan pilih file PDF memorandum terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    form.set("file", pdfFile);
    form.set("autoAnalyze", "true");

    try {
      const res = await fetch("/api/memorandum", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal upload memorandum PDF.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/dashboard/memorandum/${data.id}`);
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div id="upload-memorandum">
    <Card className="overflow-hidden border-brand-200 shadow-md">
      <div className="h-1.5 gradient-brand-accent" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy-900">
          <Upload className="h-5 w-5" />
          Upload Memorandum PDF untuk Analisa AI
        </CardTitle>
        <p className="text-sm text-slate-600">
          Upload file PDF memorandum. Sistem akan mengekstrak teks dan menjalankan analisa AI
          otomatis via SMD &amp; referensi regulasi.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Perihal *</label>
              <input
                name="title"
                required
                placeholder="Contoh: Usulan Perubahan Suku Bunga Deposito"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                No. Memorandum
              </label>
              <input
                name="number"
                placeholder="Auto-generate jika kosong"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
              <input
                name="memoDate"
                type="date"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Divisi Pengusul *
              </label>
              <input
                name="proposerDivisi"
                required
                placeholder="Contoh: Divisi IT & Digital Banking"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Urgensi</label>
              <select
                name="urgency"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              >
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="low">Rendah</option>
              </select>
            </div>
          </div>

          <MemorandumPdfUpload onFileChange={setPdfFile} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Catatan Tambahan (opsional)
            </label>
            <textarea
              name="content"
              rows={2}
              placeholder="Catatan tambahan selain isi PDF..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pdfFile}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Mengupload &amp; Menganalisa PDF...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload PDF &amp; Analisa AI
              </>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
