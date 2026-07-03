import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { ReadIndicator } from "@/components/memorandum/ReadIndicator";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import type { Memorandum } from "@/lib/db/schema";
import type { SessionUser } from "@/lib/auth";

export function MemorandumInbox({
  title,
  subtitle,
  items,
  session,
  detailHrefPrefix,
}: {
  title: string;
  subtitle: string;
  items: Memorandum[];
  session: SessionUser;
  detailHrefPrefix: string;
}) {
  return (
    <>
      <Header title={title} subtitle={subtitle} session={session} />
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Divisi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Urgensi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada memorandum.
                  </td>
                </tr>
              )}
              {items.map((memo) => {
                const st = MEMORANDUM_STATUS[memo.status];
                return (
                  <tr key={memo.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <ReadIndicator isRead={memo.isRead} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`${detailHrefPrefix}/${memo.id}`}
                        className="font-mono text-xs text-brand-600 hover:underline"
                      >
                        {memo.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`${detailHrefPrefix}/${memo.id}`} className="font-medium hover:text-brand-600">
                        {memo.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{memo.proposerDivisi}</td>
                    <td className="px-4 py-3">
                      <Badge className={st?.color}>{st?.label ?? memo.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={URGENCY[memo.urgency]?.color}>
                        {URGENCY[memo.urgency]?.label}
                      </Badge>
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
