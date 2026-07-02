"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";

export default function NewMemorandumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/memorandum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
        proposerDivisi: form.get("proposerDivisi"),
        urgency: form.get("urgency"),
      }),
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
      <Header title="Buat Memorandum" subtitle="Ajukan memorandum baru untuk persetujuan Direksi" />
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Divisi Pengusul</label>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Isi Memorandum</label>
                <textarea
                  name="content"
                  required
                  rows={6}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Mengajukan..." : "Ajukan Memorandum"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
