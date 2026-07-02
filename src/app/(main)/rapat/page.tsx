import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllMeetings, getMeetingFollowups } from "@/lib/db/queries";
import { formatDate, formatTimeRange } from "@/lib/utils";

export default function RapatPage() {
  const meetings = getAllMeetings();
  const followups = getMeetingFollowups();

  return (
    <>
      <Header
        title="Meeting Management"
        subtitle="Kelola rapat Direksi dan tindak lanjut"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{meeting.title}</CardTitle>
                  <Badge
                    className={
                      meeting.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  >
                    {meeting.status === "completed" ? "Selesai" : "Terjadwal"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>📅 {formatDate(meeting.date)}</span>
                  <span>🕐 {formatTimeRange(meeting.startTime, meeting.endTime)}</span>
                  <span>📍 {meeting.location}</span>
                </div>
                {meeting.agenda && (
                  <div>
                    <p className="text-xs font-medium text-slate-500">Agenda</p>
                    <p className="text-slate-700">{meeting.agenda}</p>
                  </div>
                )}
                {meeting.minutes && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">Notulen</p>
                    <p className="text-slate-700">{meeting.minutes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tindak Lanjut Rapat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">Rapat</th>
                    <th className="pb-2 pr-4 font-medium">Tindak Lanjut</th>
                    <th className="pb-2 pr-4 font-medium">Penanggung Jawab</th>
                    <th className="pb-2 pr-4 font-medium">Jatuh Tempo</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {followups.map((f) => (
                    <tr key={f.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 text-slate-600">{f.meetingTitle}</td>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{f.description}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{f.assignee}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{formatDate(f.dueDate)}</td>
                      <td className="py-2.5">
                        <Badge
                          className={
                            f.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : f.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }
                        >
                          {f.status === "completed"
                            ? "Selesai"
                            : f.status === "in_progress"
                              ? "Proses"
                              : "Terbuka"}
                        </Badge>
                      </td>
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
