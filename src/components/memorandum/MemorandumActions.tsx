"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DigitalSignaturePad } from "./DigitalSignaturePad";

const PIMPINAN_STATUSES = ["pimpinan_review", "pending_approval"];

export function MemorandumActions({
  id,
  status,
  hasAiSummary,
  role = "corpsec",
}: {
  id: number;
  status: string;
  hasAiSummary: boolean;
  role?: "corpsec" | "pimpinan";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSign, setShowSign] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  async function action(type: string, payload?: Record<string, unknown>) {
    setLoading(type);
    await fetch(`/api/memorandum/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: type, ...payload }),
    });
    router.refresh();
    setLoading(null);
    setShowSign(false);
    setShowReject(false);
  }

  const isPimpinan = role === "pimpinan" || PIMPINAN_STATUSES.includes(status);

  return (
    <div className="flex flex-col gap-3">
      {/* Upload / AI Analysis */}
      {(status === "uploaded" || status === "ai_review") && role === "corpsec" && (
        <button
          type="button"
          onClick={() => action("generate_ai")}
          disabled={!!loading}
          className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {loading === "generate_ai" ? "Menganalisa..." : "Submit untuk Analisa AI"}
        </button>
      )}

      {/* Pimpinan Bidang: Approve with signature */}
      {isPimpinan && PIMPINAN_STATUSES.includes(status) && (
        <>
          {!showSign && !showReject && (
            <>
              <button
                type="button"
                onClick={() => setShowSign(true)}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Approve + Tanda Tangan Digital
              </button>
              <button
                type="button"
                onClick={() => setShowReject(true)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Tolak + Komentar Revisi
              </button>
            </>
          )}

          {showSign && (
            <DigitalSignaturePad
              loading={loading === "approve_sign"}
              onCancel={() => setShowSign(false)}
              onSign={(signatureData) =>
                action("approve_sign", {
                  signatureData,
                  signedBy: "Pemimpin Bidang Corporate Secretary",
                })
              }
            />
          )}

          {showReject && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">
                Komentar revisi (bagian mana perlu diperbaiki):
              </label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={4}
                placeholder="Contoh: Bagian analisis risiko kredit perlu diperjelas..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    action("reject_with_comment", { comment: rejectComment })
                  }
                  disabled={!rejectComment.trim() || !!loading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {loading === "reject_with_comment" ? "Mengirim..." : "Submit ke CorpSec"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Returned to CorpSec - can re-send to pimpinan after edit */}
      {status === "returned_to_corpsec" && role === "corpsec" && hasAiSummary && (
        <button
          type="button"
          onClick={() => action("send_to_pimpinan")}
          disabled={!!loading}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading === "send_to_pimpinan" ? "Mengirim..." : "Kirim Ulang ke Pimpinan Bidang"}
        </button>
      )}

      {status === "approved" && (
        <p className="text-xs text-emerald-700">✓ Memorandum disetujui dengan tanda tangan digital.</p>
      )}

      {!["uploaded", "ai_review", "corpsec_review", "returned_to_corpsec", ...PIMPINAN_STATUSES, "approved"].includes(status) && (
        <p className="text-xs text-slate-500">Tidak ada aksi tersedia untuk status ini.</p>
      )}
    </div>
  );
}
