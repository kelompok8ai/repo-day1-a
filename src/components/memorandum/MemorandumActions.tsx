"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MemorandumActions({
  id,
  status,
  hasAiSummary,
}: {
  id: number;
  status: string;
  hasAiSummary: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function action(type: string) {
    setLoading(type);
    await fetch(`/api/memorandum/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: type }),
    });
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {status === "ai_review" && (
        <button
          type="button"
          onClick={() => action("generate_ai")}
          disabled={!!loading}
          className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {loading === "generate_ai" ? "Memproses..." : "Generate AI Resume"}
        </button>
      )}
      {(status === "pending_approval" || hasAiSummary) && status !== "approved" && status !== "rejected" && (
        <>
          <button
            type="button"
            onClick={() => action("approve")}
            disabled={!!loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading === "approve" ? "Memproses..." : "Setujui"}
          </button>
          <button
            type="button"
            onClick={() => action("reject")}
            disabled={!!loading}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {loading === "reject" ? "Memproses..." : "Tolak"}
          </button>
        </>
      )}
      {status === "approved" && (
        <button
          type="button"
          onClick={() => action("sign")}
          disabled={!!loading}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading === "sign" ? "Memproses..." : "Tanda Tangan Digital"}
        </button>
      )}
      {!["ai_review", "pending_approval", "approved"].includes(status) && (
        <p className="text-xs text-slate-500">Tidak ada aksi tersedia untuk status ini.</p>
      )}
    </div>
  );
}
