import Link from "next/link";
import {
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Newspaper,
  Bell,
  ListTodo,
  TrendingUp,
  Upload,
  Plus,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { DashboardHero } from "@/components/brand/DashboardHero";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MemorandumStatusChart } from "@/components/charts/MemorandumStatusChart";
import { MemorandumTrendChart } from "@/components/charts/MemorandumTrendChart";
import { SlaTrendChart } from "@/components/charts/SlaTrendChart";
import { getDashboardStats, getNotificationsForUser, getReturnedToCorpsecMemos } from "@/lib/db/queries";
import { getSession } from "@/lib/auth";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import { formatDate, formatTimeRange, daysSince } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  const data = getDashboardStats();
  const notifications = session ? getNotificationsForUser(session.id) : [];
  const returnedMemos = getReturnedToCorpsecMemos();
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <>
      <Header
        title="Dashboard Corporate Secretary"
        subtitle="Ringkasan agenda, memorandum, dan notifikasi keputusan Pimpinan Bidang"
        session={session ?? undefined}
      />
      <DashboardHero
        title="Selamat Datang di CorpSec Bank Sumut"
        subtitle="Kelola memorandum, agenda Direksi, dan alur persetujuan dalam satu platform terintegrasi."
      />
      <div className="space-y-6 p-6">
        {/* Aksi Cepat CorpSec */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/memorandum/new">
            <Card className="h-full border-brand-200 transition hover:border-brand-400 hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="rounded-xl bg-brand-100 p-3">
                  <Upload className="h-7 w-7 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Upload Memorandum</p>
                  <p className="text-sm text-slate-500">
                    Upload scan/file memorandum untuk analisa AI
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/agenda/baru">
            <Card className="h-full border-navy-200 transition hover:border-navy-400 hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="rounded-xl bg-navy-100 p-3">
                  <Plus className="h-7 w-7 text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Buat Jadwal & Agenda Direksi</p>
                  <p className="text-sm text-slate-500">
                    Tambah kegiatan dan jadwal rapat Direksi
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {(unreadNotifs.length > 0 || returnedMemos.length > 0) && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Bell className="h-4 w-4" />
                Notifikasi Keputusan Pimpinan Bidang
                {unreadNotifs.length > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadNotifs.length} baru</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {returnedMemos.map((memo) => (
                <Link
                  key={memo.id}
                  href={`/dashboard/memorandum/${memo.id}`}
                  className="block rounded-lg border border-orange-200 bg-white p-3 transition hover:border-brand-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{memo.title}</p>
                      <p className="text-xs text-slate-500">{memo.number}</p>
                    </div>
                    <Badge
                      className={
                        memo.pimpinanDecision === "approved"
                          ? "bg-brand-100 text-navy-800"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {memo.pimpinanDecision === "approved" ? "DISETUJUI" : "DITOLAK"}
                    </Badge>
                  </div>
                  {memo.rejectionComment && (
                    <p className="mt-2 text-xs text-orange-800">
                      Komentar: {memo.rejectionComment}
                    </p>
                  )}
                </Link>
              ))}
              {unreadNotifs.slice(0, 3).map((n) => (
                <p key={n.id} className="text-xs text-slate-600">{n.message}</p>
              ))}
            </CardContent>
          </Card>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Agenda Hari Ini"
            value={data.todayAgenda.length}
            subtitle={`${data.weekAgenda.length} agenda minggu ini`}
            icon={<Calendar className="h-5 w-5" />}
            accent="brand"
          />
          <StatCard
            title="Menunggu Keputusan"
            value={data.pendingMemos.length}
            subtitle={`${data.highUrgencyMemos.length} urgensi tinggi`}
            icon={<FileText className="h-5 w-5" />}
            accent="amber"
          />
          <StatCard
            title="SLA Compliance"
            value={`${data.slaCompliance}%`}
            subtitle="Target ≥95%"
            trend={data.slaCompliance >= 95 ? "✓ Target tercapai" : "⚠ Di bawah target"}
            icon={<TrendingUp className="h-5 w-5" />}
            accent="blue"
          />
          <StatCard
            title="Notifikasi Regulator"
            value={data.regulatoryNotifs.length}
            subtitle="Belum dibaca"
            icon={<Bell className="h-5 w-5" />}
            accent="red"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Statistik Memorandum</CardTitle>
            </CardHeader>
            <CardContent>
              <MemorandumStatusChart data={data.memoByStatus} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Tren Memorandum Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <MemorandumTrendChart data={data.memoByMonth} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>SLA Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SlaTrendChart data={data.slaTrend} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Agenda Hari Ini</CardTitle>
              <Link href="/agenda" className="text-xs font-medium text-brand-600 hover:underline">
                Lihat semua →
              </Link>
            </CardHeader>
            <CardContent>
              {data.todayAgenda.length === 0 ? (
                <p className="text-sm text-slate-500">Tidak ada agenda hari ini.</p>
              ) : (
                <ul className="space-y-3">
                  {data.todayAgenda.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-100 p-3"
                    >
                      <div className="mt-0.5 rounded bg-brand-50 p-2">
                        <Calendar className="h-4 w-4 text-brand-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          {formatTimeRange(item.startTime, item.endTime)} · {item.location}
                        </p>
                        {item.preparationNotes && (
                          <p className="mt-1 text-xs text-amber-700">
                            Persiapan: {item.preparationNotes}
                          </p>
                        )}
                      </div>
                      <Badge className={URGENCY[item.priority]?.color}>
                        {URGENCY[item.priority]?.label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Memorandum Menunggu Keputusan</CardTitle>
              <Link href="/dashboard/memorandum" className="text-xs font-medium text-brand-600 hover:underline">
                Lihat semua →
              </Link>
            </CardHeader>
            <CardContent>
              {data.pendingMemos.length === 0 ? (
                <p className="text-sm text-slate-500">Tidak ada memorandum menunggu.</p>
              ) : (
                <ul className="space-y-3">
                  {data.pendingMemos.map((memo) => {
                    const aging = daysSince(memo.submittedAt);
                    return (
                      <li key={memo.id}>
                        <Link
                          href={`/dashboard/memorandum/${memo.id}`}
                          className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/50"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900">{memo.title}</p>
                            <p className="text-xs text-slate-500">
                              {memo.number} · {memo.proposerDivisi}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={URGENCY[memo.urgency]?.color}>
                              {URGENCY[memo.urgency]?.label}
                            </Badge>
                            {aging !== null && (
                              <span className="text-xs text-slate-400">{aging} hari</span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Urgensi Tinggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.highUrgencyMemos.length === 0 ? (
                <p className="text-sm text-slate-500">Tidak ada memorandum urgensi tinggi.</p>
              ) : (
                <ul className="space-y-2">
                  {data.highUrgencyMemos.map((m) => (
                    <li key={m.id} className="text-sm">
                      <Link href={`/dashboard/memorandum/${m.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {m.title}
                      </Link>
                      <p className="text-xs text-slate-500">{m.number}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Belum di-Resume AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.aiReviewMemos.length === 0 ? (
                <p className="text-sm text-slate-500">Semua memorandum sudah di-resume.</p>
              ) : (
                <ul className="space-y-2">
                  {data.aiReviewMemos.map((m) => (
                    <li key={m.id} className="text-sm">
                      <Link href={`/dashboard/memorandum/${m.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {m.title}
                      </Link>
                      <Badge className={`${MEMORANDUM_STATUS.ai_review.color} ml-2`}>
                        Review AI
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-blue-500" />
                Tindak Lanjut Rapat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.followups.slice(0, 4).map((f) => (
                  <li key={f.id} className="rounded border border-slate-100 p-2 text-sm">
                    <p className="font-medium text-slate-900">{f.description}</p>
                    <p className="text-xs text-slate-500">
                      {f.assignee} · Jatuh tempo {formatDate(f.dueDate)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Berita Bank Sumut
              </CardTitle>
              <Link href="/media" className="text-xs font-medium text-brand-600 hover:underline">
                Media monitoring →
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.bankNews.map((article) => (
                  <li key={article.id} className="border-b border-slate-50 pb-3 last:border-0">
                    <p className="font-medium text-slate-900">{article.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {article.source} · {formatDate(article.publishedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifikasi Regulator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.regulatoryNotifs.map((notif) => (
                  <li
                    key={notif.id}
                    className={`rounded-lg border p-3 ${
                      notif.severity === "critical"
                        ? "border-red-200 bg-red-50"
                        : notif.severity === "warning"
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{notif.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{notif.description}</p>
                      </div>
                      <Badge
                        className={
                          notif.regulator === "OJK"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-brand-100 text-brand-600"
                        }
                      >
                        {notif.regulator}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-600" />
              Agenda Minggu Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">Tanggal</th>
                    <th className="pb-2 pr-4 font-medium">Kegiatan</th>
                    <th className="pb-2 pr-4 font-medium">Waktu</th>
                    <th className="pb-2 font-medium">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.weekAgenda.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 text-slate-600">{formatDate(item.date)}</td>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{item.title}</td>
                      <td className="py-2.5 pr-4 text-slate-600">
                        {formatTimeRange(item.startTime, item.endTime)}
                      </td>
                      <td className="py-2.5 text-slate-600">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
