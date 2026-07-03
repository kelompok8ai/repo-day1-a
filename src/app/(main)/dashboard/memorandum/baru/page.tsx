"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { MemorandumPdfUpload } from "@/components/memorandum/MemorandumPdfUpload";

export default function NewMemorandumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
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
    const res = await fetch("/api/memorandum", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/memorandum/${data.id}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal upload memorandum.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        title="Upload Memorandum PDF"
        subtitle="Corporate Secretary — upload file PDF untuk analisa AI via SMD & regulasi"
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Perihal *</label>
                <input
                  name="title"
                  required
                  placeholder="Contoh: Usulan Perubahan Suku Bunga Deposito"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    No. Memorandum
                  </label>
                  <input
                    name="number"
                    placeholder="Auto-generate jika kosong"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
                  <input
                    name="memoDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Divisi Pengusul *
                </label>
                <input
                  name="proposerDivisi"
                  required
                  placeholder="Contoh: Divisi IT & Digital Banking"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Urgensi</label>
                <select
                  name="urgency"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Tinggi</option>
                  <option value="low">Rendah</option>
                </select>
              </div>

              <MemorandumPdfUpload onFileChange={setPdfFile} />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  name="content"
                  rows={3}
                  placeholder="Catatan tambahan selain isi PDF..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !pdfFile}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Mengupload PDF..." : "Upload Memorandum PDF"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
