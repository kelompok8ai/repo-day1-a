"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Save, Send } from "lucide-react";

type Props = {
  id: number;
  status: string;
  initialSummary: string;
  initialRisk: number | null;
  initialCompliance: number | null;
  role?: string;
};

export function AiReviewEditor({
  id,
  status,
  initialSummary,
  initialRisk,
  initialCompliance,
  role,
}: Props) {
  const router = useRouter();
  const [summary, setSummary] = useState(initialSummary);
  const [risk, setRisk] = useState(initialRisk ?? 30);
  const [compliance, setCompliance] = useState(initialCompliance ?? 90);
  const [loading, setLoading] = useState<string | null>(null);
  const canEdit =
    role === "corpsec" && ["corpsec_review", "returned_to_corpsec"].includes(status);

  async function saveReview() {
    setLoading("save");
    await fetch(`/api/memorandum/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_ai_review",
        aiSummary: summary,
        aiRiskScore: risk,
        aiComplianceScore: compliance,
      }),
    });
    router.refresh();
    setLoading(null);
  }

  async function sendToPimpinan() {
    setLoading("send");
    await fetch(`/api/memorandum/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send_to_pimpinan" }),
    });
    router.refresh();
    setLoading(null);
  }

  function downloadReview() {
    window.open(`/api/memorandum/${id}/download`, "_blank");
  }

  async function handleReupload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading("upload");
    const form = new FormData();
    form.append("file", file);
    await fetch(`/api/memorandum/${id}/reupload-review`, {
      method: "POST",
      body: form,
    });
    router.refresh();
    setLoading(null);
  }

  if (!canEdit && !summary) return null;

  return (
    <div className="space-y-4">
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        readOnly={!canEdit}
        rows={12}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-brand-500 disabled:bg-slate-50"
      />

      {canEdit && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Risk Score (0-100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Compliance Score (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={compliance}
              onChange={(e) => setCompliance(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <>
            <button
              type="button"
              onClick={saveReview}
              disabled={!!loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading === "save" ? "Menyimpan..." : "Simpan Edit"}
            </button>
            <button
              type="button"
              onClick={sendToPimpinan}
              disabled={!!loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading === "send" ? "Mengirim..." : "Submit ke Pimpinan Bidang"}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={downloadReview}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Download Review
        </button>
        {canEdit && (
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            Upload Review (.txt)
            <input
              type="file"
              accept=".txt,.md"
              className="hidden"
              onChange={handleReupload}
            />
          </label>
        )}
      </div>
    </div>
  );
}
