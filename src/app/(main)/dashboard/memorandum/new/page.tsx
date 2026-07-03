"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { MemorandumPdfUpload } from "@/components/memorandum/MemorandumPdfUpload";

export default function MemorandumNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pdfFile) {
      setError("File PDF memorandum wajib diupload untuk analisa AI.");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    form.set("file", pdfFile);
    form.set("autoAnalyze", "true");

    if (!form.get("proposerDivisi")) {
      form.set("proposerDivisi", "Corporate Secretary");
    }

    try {
      const res = await fetch("/api/memorandum", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan memorandum.");
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
    <>
      <Header
        title="Buat Memorandum Baru"
        subtitle="Buat memorandum baru untuk disubmit ke Direksi"
      />
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Subjek *
                </label>
                <input
                  name="title"
                  required
                  placeholder="Subjek singkat"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Urgensi
                </label>
                <select
                  name="urgency"
                  defaultValue="normal"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="low">Rendah</option>
                  <option value="normal">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>

              <MemorandumPdfUpload onFileChange={setPdfFile} />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Isi Memorandum
                </label>
                <textarea
                  name="content"
                  rows={8}
                  placeholder="Tuliskan isi memorandum. Cantumkan referensi SK, SE, Instruksi Direksi, dan regulasi terkait."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Opsional jika sudah upload PDF — teks PDF akan diekstrak otomatis untuk analisa AI.
                </p>
              </div>

              <input type="hidden" name="proposerDivisi" value="Corporate Secretary" />

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !pdfFile}
                  className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {loading ? "Mengupload & Menganalisa..." : "Simpan Draft"}
                </button>
                <Link
                  href="/dashboard/memorandum"
                  className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
