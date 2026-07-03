"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Download, FileText } from "lucide-react";

export function SekdireksiTerimaButton({
  id,
  alreadyReceived,
}: {
  id: number;
  alreadyReceived: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState(alreadyReceived);

  async function handleTerima() {
    setLoading(true);
    await fetch(`/api/memorandum/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "terima" }),
    });
    setReceived(true);
    router.refresh();
    setLoading(false);
  }

  if (received) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          Dokumen Diterima
        </span>
        <a
          href={`/api/memorandum/${id}/file`}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
        >
          <Download className="h-3 w-3" />
          Akses File
        </a>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTerima}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
    >
      <FileText className="h-4 w-4" />
      {loading ? "Memproses..." : "Klik Terima"}
    </button>
  );
}
