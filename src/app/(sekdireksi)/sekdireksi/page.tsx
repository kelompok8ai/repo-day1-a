import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SekdireksiTerimaButton } from "@/components/memorandum/SekdireksiTerimaButton";
import { getSession } from "@/lib/auth";
import { getSekdireksiMemorandum } from "@/lib/db/queries";
import { MEMORANDUM_STATUS } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Inbox, Sparkles } from "lucide-react";

export default async function SekdireksiPage() {
  const session = await getSession();
  if (!session) return null;
  const items = getSekdireksiMemorandum();
  const pending = items.filter((m) => m.status === "sent_to_sekdireksi");
  const received = items.filter((m) => m.status === "received_sekdireksi");

  return (
    <>
      <Header
        title="Dokumen Memorandum"
        subtitle="Scan dokumen & review AI yang disetujui Pimpinan Bidang"
        session={session}
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Inbox className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{pending.length}</p>
                <p className="text-xs text-slate-500">Menunggu Diterima</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Inbox className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{received.length}</p>
                <p className="text-xs text-slate-500">Sudah Diterima</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-slate-500">
              Belum ada dokumen memorandum yang dikirim Corporate Secretary.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((memo) => {
              const isReceived = memo.status === "received_sekdireksi";
              return (
                <Card key={memo.id} className={!isReceived ? "border-amber-200" : "border-emerald-200"}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle>{memo.title}</CardTitle>
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {memo.number} · {memo.proposerDivisi}
                        </p>
                      </div>
                      <Badge className={MEMORANDUM_STATUS[memo.status]?.color}>
                        {MEMORANDUM_STATUS[memo.status]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                      <span>Tanggal: {memo.memoDate ? formatDate(memo.memoDate) : "—"}</span>
                      <span>Dikirim: {memo.sentToSekdireksiAt ? formatDateTime(memo.sentToSekdireksiAt) : "—"}</span>
                      {memo.fileName && <span>File: {memo.fileName}</span>}
                    </div>

                    {memo.aiSummary && (
                      <div className="rounded-lg bg-purple-50 p-3">
                        <p className="mb-1 flex items-center gap-1 text-xs font-medium text-purple-700">
                          <Sparkles className="h-3 w-3" />
                          Review AI (Disetujui Pimpinan Bidang)
                        </p>
                        <p className="line-clamp-4 text-sm text-slate-700">{memo.aiSummary}</p>
                      </div>
                    )}

                    <SekdireksiTerimaButton
                      id={memo.id}
                      alreadyReceived={isReceived}
                    />
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
