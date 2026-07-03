import Image from "next/image";
import Link from "next/link";
import { Upload, FileText, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { getMemorandumByUserId } from "@/lib/db/queries";
import { MEMORANDUM_STATUS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { BRAND } from "@/lib/brand";

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

      {/* Hero banner */}
      <div className="relative mx-6 mt-6 overflow-hidden rounded-2xl shadow-md">
        <div className="relative h-40">
          <Image
            src={BRAND.images.corporate}
            alt="Bank Sumut"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 to-navy-900/50" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Divisi Pengusul
              </p>
              <p className="mt-1 text-xl font-bold text-white">
                Kirim Memorandum Digital ke Corporate Secretary
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/pengusul/kirim">
            <Card className="card-brand border-brand-200 hover:border-brand-400">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl bg-brand-100 p-3">
                  <Upload className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Kirim Memorandum</p>
                  <p className="text-sm text-slate-500">Upload PDF ke Corporate Secretary</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/pengusul/riwayat">
            <Card className="card-brand border-navy-200 hover:border-navy-400">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl bg-navy-100 p-3">
                  <FileText className="h-6 w-6 text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Riwayat & Keputusan</p>
                  <p className="text-sm text-slate-500">{riwayat.length} memorandum</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="border-brand-100 bg-brand-50/40">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-navy-900">Petunjuk Penggunaan</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                  <li>Upload memorandum dalam format PDF</li>
                  <li>Isi subjek dan catatan pendukung</li>
                  <li>Memorandum akan dianalisa AI oleh Corporate Secretary</li>
                  <li>Anda akan menerima notifikasi keputusan akhir</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {riwayat.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <p className="mb-3 text-sm font-semibold text-navy-900">Pengiriman Terbaru</p>
              <ul className="space-y-2">
                {riwayat.slice(0, 3).map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 text-sm"
                  >
                    <span className="font-medium text-navy-900">{m.title}</span>
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
