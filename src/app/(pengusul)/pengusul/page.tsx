import Link from "next/link";
import { Upload, FileText, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { getMemorandumByUserId } from "@/lib/db/queries";
import { MEMORANDUM_STATUS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default async function PengusulHomePage() {
  const session = await getSession();
  if (!session) return null;
  const riwayat = getMemorandumByUserId(session.id);

  return (
    <>
      <Header
        title="Beranda Divisi Pengusul"
        subtitle={`Selamat datang, ${session.name}`}
        session={session}
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/pengusul/kirim">
            <Card className="transition hover:border-emerald-300 hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Upload className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Kirim Memorandum</p>
                  <p className="text-sm text-slate-500">
                    Upload scan/file ke Corporate Secretary
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/pengusul/riwayat">
            <Card className="transition hover:border-emerald-300 hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl bg-blue-100 p-3">
                  <FileText className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Riwayat Pengiriman</p>
                  <p className="text-sm text-slate-500">{riwayat.length} memorandum dikirim</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Petunjuk Penggunaan</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                  <li>Upload memorandum dalam format PDF</li>
                  <li>Isi subjek dan catatan pendukung</li>
                  <li>Setelah submit, memorandum diteruskan ke Corporate Secretary untuk analisa AI</li>
                  <li>Anda akan menerima notifikasi keputusan akhir (disetujui/ditolak)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {riwayat.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">Pengiriman Terbaru</p>
              <ul className="space-y-2">
                {riwayat.slice(0, 3).map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm">
                    <span className="font-medium">{m.title}</span>
                    <Badge className={MEMORANDUM_STATUS[m.status]?.color}>
                      {MEMORANDUM_STATUS[m.status]?.label}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
