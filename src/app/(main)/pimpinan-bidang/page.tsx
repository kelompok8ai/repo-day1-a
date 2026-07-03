import Link from "next/link";
import { UserCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReadIndicator } from "@/components/memorandum/ReadIndicator";
import { MemorandumActions } from "@/components/memorandum/MemorandumActions";
import { getPimpinanMemorandum } from "@/lib/db/queries";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import { formatDate, daysSince } from "@/lib/utils";

import { getSession } from "@/lib/auth";

export default async function PimpinanBidangPage() {
  const session = await getSession();
  const items = getPimpinanMemorandum();
  const unreadCount = items.filter((m) => !m.isRead).length;

  return (
    <>
      <Header
        title="Menu Pimpinan Bidang"
        subtitle="Review, approve dengan tanda tangan digital, atau tolak dengan komentar revisi"
        session={session ?? undefined}
      />
      <div className="p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-lg bg-amber-50 p-2">
                <UserCheck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{items.length}</p>
                <p className="text-xs text-slate-500">Menunggu Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <ReadIndicator isRead={false} />
              <div>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-xs text-slate-500">Belum Dibaca</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <ReadIndicator isRead={true} />
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {items.length - unreadCount}
                </p>
                <p className="text-xs text-slate-500">Sudah Dibaca</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UserCheck className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                Tidak ada memorandum menunggu review Pimpinan Bidang.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((memo) => {
              const aging = daysSince(memo.submittedAt);
              const statusInfo = MEMORANDUM_STATUS[memo.status];
              return (
                <Card
                  key={memo.id}
                  className={!memo.isRead ? "border-red-200 bg-red-50/20" : ""}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <ReadIndicator isRead={memo.isRead} />
                        <div>
                          <CardTitle>{memo.title}</CardTitle>
                          <p className="mt-1 font-mono text-xs text-slate-500">
                            {memo.number} · {memo.proposerDivisi}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                        <Badge className={URGENCY[memo.urgency]?.color}>
                          {URGENCY[memo.urgency]?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {memo.aiSummary && (
                      <div className="rounded-lg bg-purple-50 p-3">
                        <p className="mb-1 flex items-center gap-1 text-xs font-medium text-purple-700">
                          <Sparkles className="h-3 w-3" />
                          Ringkasan AI (Confidence: {memo.aiConfidence}%)
                        </p>
                        <p className="line-clamp-3 text-sm text-slate-700">
                          {memo.aiSummary.slice(0, 300)}...
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-slate-500">
                        {aging !== null && `Aging: ${aging} hari · `}
                        {memo.submittedAt && `Diajukan ${formatDate(memo.submittedAt)}`}
                      </div>
                      <Link
                        href={`/memorandum/${memo.id}`}
                        className="text-xs font-medium text-emerald-700 hover:underline"
                      >
                        Lihat detail →
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="mb-2 text-xs font-medium text-slate-600">
                        Aksi Pimpinan Bidang:
                      </p>
                      <MemorandumActions
                        id={memo.id}
                        status={memo.status}
                        hasAiSummary={!!memo.aiSummary}
                        role="pimpinan_bidang"
                        pimpinanDecision={memo.pimpinanDecision}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
