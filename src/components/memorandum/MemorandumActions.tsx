"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DigitalSignaturePad } from "./DigitalSignaturePad";
import type { UserRole } from "@/lib/db/schema";

const PIMPINAN_STATUSES = ["pimpinan_review", "pending_approval"];

export function MemorandumActions({
  id,
  status,
  hasAiSummary,
  role,
  pimpinanDecision,
}: {
  id: number;
  status: string;
  hasAiSummary: boolean;
  role: UserRole;
  pimpinanDecision?: string | null;
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

  if (role === "pengusul" || role === "sekdireksi") {
    return <p className="text-xs text-slate-500">Tidak ada aksi tersedia.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* CORPSEC: Submit AI */}
      {role === "corpsec" && (status === "uploaded" || status === "ai_review") && (
        <button
          type="button"
          onClick={() => action("generate_ai")}
          disabled={!!loading}
          className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {loading === "generate_ai" ? "Menganalisa..." : "Submit untuk Analisa AI"}
        </button>
      )}

      {/* CORPSEC: Send to Pimpinan */}
      {role === "corpsec" &&
        hasAiSummary &&
        ["corpsec_review", "returned_to_corpsec"].includes(status) &&
        pimpinanDecision !== "approved" && (
          <button
            type="button"
            onClick={() => action("send_to_pimpinan")}
            disabled={!!loading}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {loading === "send_to_pimpinan" ? "Mengirim..." : "Submit / Send ke Pimpinan Bidang"}
          </button>
        )}

      {/* CORPSEC: Send to Sekdireksi after pimpinan approved */}
      {role === "corpsec" &&
        status === "returned_to_corpsec" &&
        pimpinanDecision === "approved" && (
          <button
            type="button"
            onClick={() => action("send_to_sekdireksi")}
            disabled={!!loading}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading === "send_to_sekdireksi" ? "Mengirim..." : "Submit / Send ke Sekretaris Direksi"}
          </button>
        )}

      {/* PIMPINAN: Approve / Reject */}
      {role === "pimpinan_bidang" && PIMPINAN_STATUSES.includes(status) && (
        <>
          {!showSign && !showReject && (
            <>
              <button
                type="button"
                onClick={() => setShowSign(true)}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
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
                placeholder="Contoh: Bagian analisis risiko perlu diperjelas..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => action("reject_with_comment", { comment: rejectComment })}
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

      {role === "corpsec" &&
        status === "returned_to_corpsec" &&
        pimpinanDecision === "rejected" && (
          <p className="text-xs text-orange-700">
            Memorandum ditolak Pimpinan Bidang. Edit review AI lalu kirim ulang ke Pimpinan Bidang.
          </p>
        )}

      {role === "corpsec" &&
        status === "returned_to_corpsec" &&
        pimpinanDecision === "approved" && (
          <p className="text-xs text-brand-600">
            Disetujui Pimpinan Bidang. Kirim ke Sekretaris Direksi untuk diterima.
          </p>
        )}
    </div>
  );
}
