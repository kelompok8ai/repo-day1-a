"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";

export default function NewMemorandumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/memorandum", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/memorandum/${data.id}`);
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        title="Upload Memorandum"
        subtitle="Corporate Secretary — upload scan/file untuk analisa AI via SMD & regulasi"
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Judul</label>
                <input
                  name="title"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Divisi Pengusul
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Upload Scan/File Memorandum *
                </label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-8 transition hover:border-emerald-400 hover:bg-emerald-50">
                  {fileName ? (
                    <>
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">{fileName}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Klik untuk upload file
                      </span>
                      <span className="text-xs text-slate-500">
                        PDF, DOC, DOCX, TXT, JPG, PNG
                      </span>
                    </>
                  )}
                  <input
                    name="file"
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
                <p className="mt-2 text-xs text-slate-500">
                  File akan terhubung ke Sistem Manajemen Dokumen (SMD) saat analisa AI.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  name="content"
                  rows={3}
                  placeholder="Catatan atau ringkasan singkat memorandum..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Mengupload..." : "Upload Memorandum"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
