import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SlaTrendChart } from "@/components/charts/SlaTrendChart";
import { getSlaData, getDashboardStats } from "@/lib/db/queries";
import { SLA_STATUS } from "@/lib/constants";

export default function SlaPage() {
  const { records, onTrack, breached, compliance, total } = getSlaData();
  const dashboard = getDashboardStats();

  return (
    <>
      <Header
        title="SLA Monitoring"
        subtitle="Pemantauan Service Level Agreement memorandum — target ≥95%"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="SLA Compliance"
            value={`${compliance}%`}
            subtitle="Target ≥95%"
            icon={<span className="text-lg">📊</span>}
            accent={compliance >= 95 ? "emerald" : "amber"}
          />
          <StatCard
            title="On Track"
            value={onTrack}
            subtitle={`dari ${total} memorandum`}
            icon={<span className="text-lg">✅</span>}
            accent="emerald"
          />
          <StatCard
            title="Terlambat"
            value={breached}
            subtitle="SLA breached"
            icon={<span className="text-lg">⚠️</span>}
            accent="red"
          />
          <StatCard
            title="Memorandum Terlambat"
            value={0}
            subtitle="Target: 0"
            icon={<span className="text-lg">🎯</span>}
            accent="blue"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tren SLA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <SlaTrendChart data={dashboard.slaTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail SLA per Memorandum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">No. Memo</th>
                    <th className="pb-2 pr-4 font-medium">Judul</th>
                    <th className="pb-2 pr-4 font-medium">Target (jam)</th>
                    <th className="pb-2 pr-4 font-medium">Aktual (jam)</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const pct = r.actualHours
                      ? Math.round((r.actualHours / r.targetHours) * 100)
                      : 0;
                    return (
                      <tr key={r.id} className="border-b border-slate-50">
                        <td className="py-2.5 pr-4 font-mono text-xs">{r.memoNumber}</td>
                        <td className="py-2.5 pr-4 font-medium text-slate-900">{r.memoTitle}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{r.targetHours}h</td>
                        <td className="py-2.5 pr-4 text-slate-600">
                          {r.actualHours ?? "—"}h
                          {r.actualHours && (
                            <span className="ml-1 text-xs text-slate-400">({pct}%)</span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <Badge className={SLA_STATUS[r.status]?.color}>
                            {SLA_STATUS[r.status]?.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
