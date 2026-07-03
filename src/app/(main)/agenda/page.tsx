import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllAgenda } from "@/lib/db/queries";
import { getSession } from "@/lib/auth";
import { URGENCY } from "@/lib/constants";
import { formatDate, formatTimeRange } from "@/lib/utils";

export default async function AgendaPage() {
  const session = await getSession();
  const items = getAllAgenda();

  return (
    <>
      <Header
        title="Manajemen Agenda Direksi"
        subtitle="Kelola jadwal dan persiapan kegiatan Direksi"
        session={session ?? undefined}
      />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{items.length} agenda terdaftar</p>
          <Link
            href="/agenda/baru"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-800"
          >
            <Plus className="h-4 w-4" />
            Buat Jadwal & Agenda Direksi
          </Link>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <Badge className={URGENCY[item.priority]?.color}>
                      {URGENCY[item.priority]?.label}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>📅 {formatDate(item.date)}</span>
                    <span>🕐 {formatTimeRange(item.startTime, item.endTime)}</span>
                    <span>📍 {item.location}</span>
                  </div>
                  {item.preparationNotes && (
                    <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      <strong>Persiapan:</strong> {item.preparationNotes}
                    </div>
                  )}
                </div>
                <Badge
                  className={
                    item.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-brand-100 text-brand-600"
                  }
                >
                  {item.status === "scheduled" ? "Terjadwal" : item.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
