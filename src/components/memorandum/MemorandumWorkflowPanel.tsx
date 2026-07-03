"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DigitalSignaturePad } from "./DigitalSignaturePad";
import type { UserRole } from "@/lib/db/schema";

type BoardMember = { id: number; name: string; boardPosition: string | null };

type Props = {
  id: number;
  status: string;
  hasAiSummary: boolean;
  role: UserRole;
  pimpinanDecision?: string | null;
  routeType?: string | null;
  boardMembers?: BoardMember[];
  userName?: string;
};

export function MemorandumWorkflowPanel({
  id,
  status,
  hasAiSummary,
  role,
  pimpinanDecision,
  routeType,
  boardMembers = [],
  userName,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSign, setShowSign] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [comment, setComment] = useState("");
  const [disposition, setDisposition] = useState("");
  const [route, setRoute] = useState<"direksi" | "komisaris">("direksi");
  const [selectedTargets, setSelectedTargets] = useState<number[]>([]);

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

  function toggleTarget(userId: number) {
    setSelectedTargets((prev) =>
      prev.includes(userId) ? prev.filter((x) => x !== userId) : [...prev, userId]
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* CORPSEC */}
      {role === "corpsec" && (status === "uploaded" || status === "ai_review") && (
        <button
          type="button"
          onClick={() => action("generate_ai")}
          disabled={!!loading}
          className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {loading === "generate_ai" ? "Menganalisa..." : "Submit Analisa AI"}
        </button>
      )}

      {role === "corpsec" &&
        hasAiSummary &&
        ["corpsec_review", "returned_to_corpsec"].includes(status) &&
        pimpinanDecision !== "approved" && (
          <button
            type="button"
            onClick={() => action("send_to_pimpinan")}
            disabled={!!loading}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white"
          >
            Kirim ke Pimpinan Bidang
          </button>
        )}

      {role === "corpsec" && status === "returned_to_corpsec" && pimpinanDecision === "approved" && (
        <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-900">Teruskan ke Sekretariat</p>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value as "direksi" | "komisaris")}
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="direksi">Sekretaris Direksi → Direksi</option>
            <option value="komisaris">Sekretaris Komisaris → Komisaris</option>
          </select>
          <button
            type="button"
            onClick={() => action("send_to_secretariat", { routeType: route })}
            disabled={!!loading}
            className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white"
          >
            Kirim ke Sekretariat
          </button>
        </div>
      )}

      {role === "corpsec" && status === "returned_to_corpsec_board" && (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Catatan untuk Divisi Pengusul..."
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => action("finalize_to_pengusul", { comment, approved: true })}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
            >
              Setujui &amp; Kembalikan ke Pengusul
            </button>
            <button
              type="button"
              onClick={() => action("finalize_to_pengusul", { comment, approved: false })}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
            >
              Tolak &amp; Kembalikan ke Pengusul
            </button>
          </div>
        </div>
      )}

      {role === "corpsec" &&
        ["uploaded", "corpsec_review", "returned_to_corpsec"].includes(status) &&
        pimpinanDecision === "rejected" && (
          <button
            type="button"
            onClick={() => action("return_to_pengusul", { comment: comment || "Perlu revisi" })}
            className="rounded-lg border border-orange-300 px-4 py-2 text-sm text-orange-800"
          >
            Kembalikan ke Divisi Pengusul
          </button>
        )}

      {/* PIMPINAN BIDANG */}
      {role === "pimpinan_bidang" && ["pimpinan_review", "pending_approval"].includes(status) && (
        <>
          {!showSign && !showReject && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowSign(true)}
                className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
              >
                Setujui + Tanda Tangan Digital
              </button>
              <button
                type="button"
                onClick={() => setShowReject(true)}
                className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700"
              >
                Tolak + Komentar Revisi ke CorpSec
              </button>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="mb-2 text-xs font-medium">Atau teruskan langsung ke:</p>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value as "direksi" | "komisaris")}
                  className="mb-2 w-full rounded border px-2 py-1.5 text-sm"
                >
                  <option value="direksi">Sekretaris Direksi</option>
                  <option value="komisaris">Sekretaris Komisaris</option>
                </select>
                <button
                  type="button"
                  onClick={() => action("send_to_secretariat", { routeType: route })}
                  className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm text-white"
                >
                  Teruskan ke Sekretariat
                </button>
              </div>
            </div>
          )}
          {showSign && (
            <DigitalSignaturePad
              loading={loading === "approve_sign"}
              onCancel={() => setShowSign(false)}
              onSign={(signatureData) =>
                action("approve_sign", { signatureData, signedBy: userName })
              }
            />
          )}
          {showReject && (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Komentar revisi..."
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => action("reject_with_comment", { comment })}
                disabled={!comment.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Kirim ke CorpSec
              </button>
            </div>
          )}
        </>
      )}

      {/* SEKRETARIS DIREKSI / KOMISARIS */}
      {(role === "sekdireksi" || role === "sekretaris_komisaris") &&
        ["sent_to_sekdireksi", "sent_to_sekkom"].includes(status) && (
          <button
            type="button"
            onClick={() => action("terima")}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
          >
            Terima Memorandum
          </button>
        )}

      {(role === "sekdireksi" || role === "sekretaris_komisaris") &&
        ["received_sekdireksi", "received_sekkom"].includes(status) && (
          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-700">
              Pilih {role === "sekdireksi" ? "Direksi" : "Komisaris"} tujuan (bisa lebih dari 1):
            </p>
            {boardMembers.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTargets.includes(m.id)}
                  onChange={() => toggleTarget(m.id)}
                />
                {m.name}
              </label>
            ))}
            <button
              type="button"
              onClick={() => action("forward_to_board", { targetUserIds: selectedTargets })}
              disabled={!selectedTargets.length || !!loading}
              className="w-full rounded-lg bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Teruskan ke {role === "sekdireksi" ? "Direksi" : "Komisaris"}
            </button>
          </div>
        )}

      {(role === "sekdireksi" || role === "sekretaris_komisaris") &&
        status === "returned_to_corpsec_board" && (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Komentar untuk CorpSec..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => action("sek_return_corpsec", { comment })}
              className="rounded-lg bg-orange-700 px-4 py-2 text-sm text-white"
            >
              Kembalikan ke Corporate Secretary
            </button>
          </div>
        )}

      {/* DIREKSI / KOMISARIS */}
      {(role === "direksi" || role === "komisaris") && status === "board_review" && (
        <>
          {!showSign && !showReject && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowSign(true)}
                className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
              >
                Setujui + Tanda Tangan Digital
              </button>
              <button
                type="button"
                onClick={() => setShowReject(true)}
                className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700"
              >
                Tolak + Disposisi
              </button>
            </div>
          )}
          {showSign && (
            <DigitalSignaturePad
              loading={loading === "board_decision"}
              onCancel={() => setShowSign(false)}
              onSign={(signatureData) =>
                action("board_decision", {
                  decision: "approved",
                  signatureData,
                  comment,
                })
              }
            />
          )}
          {showReject && (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Komentar..."
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                placeholder="Disposisi (opsional)"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  action("board_decision", {
                    decision: "rejected",
                    comment,
                    disposition,
                  })
                }
                disabled={!comment.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Tolak &amp; Kembalikan ke Sekretariat
              </button>
            </div>
          )}
        </>
      )}

      {routeType && (
        <p className="text-xs text-slate-500">
          Rute: {routeType === "direksi" ? "Direksi" : "Komisaris"}
        </p>
      )}
    </div>
  );
}
