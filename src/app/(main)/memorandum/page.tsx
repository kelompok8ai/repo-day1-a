import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { ReadIndicator } from "@/components/memorandum/ReadIndicator";
import { getAllMemorandum } from "@/lib/db/queries";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import { formatDate, daysSince } from "@/lib/utils";

export default function MemorandumPage() {
  const items = getAllMemorandum();
  const unreadCount = items.filter((m) => !m.isRead).length;

  return (
    <>
      <Header
        title="Manajemen Memorandum"
        subtitle="Kelola memorandum, analisa AI, dan alur persetujuan"
      />
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ReadIndicator isRead={false} /> Belum dibaca ({unreadCount})
          </span>
          <span className="flex items-center gap-1.5">
            <ReadIndicator isRead={true} /> Sudah dibaca
          </span>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">{items.length} memorandum terdaftar</p>
          <Link
            href="/memorandum/baru"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" />
            Upload Memorandum
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-4 py-3 font-medium w-8"></th>
                <th className="px-4 py-3 font-medium">No. Memorandum</th>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Divisi</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urgensi</th>
                <th className="px-4 py-3 font-medium">AI / SMD</th>
                <th className="px-4 py-3 font-medium">Aging</th>
              </tr>
            </thead>
            <tbody>
              {items.map((memo) => {
                const aging = daysSince(memo.submittedAt);
                const statusInfo = MEMORANDUM_STATUS[memo.status];
                return (
                  <tr
                    key={memo.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/50 ${
                      !memo.isRead ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <ReadIndicator isRead={memo.isRead} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/memorandum/${memo.id}`}
                        className="font-mono text-xs font-medium text-emerald-700 hover:underline"
                      >
                        {memo.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/memorandum/${memo.id}`}
                        className={`hover:text-emerald-700 ${
                          !memo.isRead ? "font-bold text-slate-900" : "font-medium text-slate-900"
                        }`}
                      >
                        {memo.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{memo.proposerDivisi}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={URGENCY[memo.urgency]?.color}>
                        {URGENCY[memo.urgency]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {memo.aiSummary ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <Sparkles className="h-3 w-3" />
                          {memo.aiConfidence}%
                        </span>
                      ) : memo.smdDocumentId ? (
                        <span className="text-xs text-blue-600">{memo.smdDocumentId}</span>
                      ) : (
                        <span className="text-xs text-slate-400">Belum</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {aging !== null ? `${aging} hari` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
