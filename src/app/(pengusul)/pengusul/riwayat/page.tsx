import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/auth";
import { getMemorandumByUserId } from "@/lib/db/queries";
import { MEMORANDUM_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function PengusulRiwayatPage() {
  const session = await getSession();
  if (!session) return null;
  const items = getMemorandumByUserId(session.id);

  return (
    <>
      <Header title="Riwayat Pengiriman" subtitle="Memorandum yang Anda kirim ke Corporate Secretary" session={session} />
      <div className="p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Belum ada memorandum yang dikirim.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-4 py-3 font-medium">No. Memo</th>
                  <th className="px-4 py-3 font-medium">Perihal</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-mono text-xs">{m.number}</td>
                    <td className="px-4 py-3 font-medium">{m.title}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {m.memoDate ? formatDate(m.memoDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={MEMORANDUM_STATUS[m.status]?.color}>
                        {MEMORANDUM_STATUS[m.status]?.label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
