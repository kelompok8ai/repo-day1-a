import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/Card";
import {
  ReportTrendChart,
  DivisiChart,
  SentimentChart,
} from "@/components/charts/ReportCharts";
import { MemorandumStatusChart } from "@/components/charts/MemorandumStatusChart";
import { getReportData, getDashboardStats } from "@/lib/db/queries";

export default function LaporanPage() {
  const report = getReportData();
  const dashboard = getDashboardStats();

  return (
    <>
      <Header
        title="Reporting"
        subtitle="Laporan statistik memorandum, rapat, SLA, dan media monitoring"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Memorandum"
            value={dashboard.memoStats.total}
            icon={<span className="text-lg">📄</span>}
            accent="emerald"
          />
          <StatCard
            title="Rapat"
            value={report.meetingStats.total}
            subtitle={`${report.meetingStats.completed} selesai`}
            icon={<span className="text-lg">👥</span>}
            accent="blue"
          />
          <StatCard
            title="SLA Compliance"
            value={`${dashboard.slaCompliance}%`}
            icon={<span className="text-lg">⏱️</span>}
            accent="purple"
          />
          <StatCard
            title="Disetujui"
            value={dashboard.memoStats.approved}
            subtitle={`${dashboard.memoStats.rejected} ditolak`}
            icon={<span className="text-lg">✅</span>}
            accent="emerald"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tren Bulanan — Memorandum & Rapat</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTrendChart data={report.monthlyTrend} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Memorandum per Status</CardTitle>
            </CardHeader>
            <CardContent>
              <MemorandumStatusChart
                data={report.memoByStatus.map((s, i) => ({
                  name: s.status,
                  value: s.count,
                  fill: ["#94a3b8", "#a855f7", "#f59e0b", "#10b981", "#ef4444"][i],
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sentimen Media Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentChart data={report.mediaSentiment} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Memorandum per Divisi Pengusul</CardTitle>
          </CardHeader>
          <CardContent>
            <DivisiChart data={report.memoByDivisi} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPI Success Metrics (PRD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">KPI</th>
                    <th className="pb-2 pr-4 font-medium">Target</th>
                    <th className="pb-2 font-medium">Status Saat Ini</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kpi: "Resume AI", target: "<5 menit", current: "Simulasi ~2 menit" },
                    { kpi: "Approval", target: "-50% waktu", current: "Dalam monitoring" },
                    { kpi: "Penggunaan kertas", target: "-90%", current: "Digitalisasi aktif" },
                    { kpi: "Agenda terdokumentasi", target: "100%", current: "100%" },
                    { kpi: "SLA memorandum", target: "≥95%", current: `${dashboard.slaCompliance}%` },
                    { kpi: "Memorandum terlambat", target: "0", current: `${dashboard.memoStats.pending} pending` },
                  ].map((row) => (
                    <tr key={row.kpi} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{row.kpi}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{row.target}</td>
                      <td className="py-2.5 text-emerald-700">{row.current}</td>
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
