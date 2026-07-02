import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MemorandumActions } from "@/components/memorandum/MemorandumActions";
import { getMemorandumById } from "@/lib/db/queries";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function MemorandumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo) notFound();

  const statusInfo = MEMORANDUM_STATUS[memo.status];

  return (
    <>
      <Header title={memo.title} subtitle={memo.number} />
      <div className="space-y-6 p-6">
        <Link
          href="/memorandum"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>

        <div className="flex flex-wrap gap-2">
          <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
          <Badge className={URGENCY[memo.urgency]?.color}>
            Urgensi: {URGENCY[memo.urgency]?.label}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Isi Memorandum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-700">{memo.content}</p>
                <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                  <span>Divisi Pengusul: {memo.proposerDivisi}</span>
                  {memo.submittedAt && (
                    <span>Diajukan: {formatDateTime(memo.submittedAt)}</span>
                  )}
                  {memo.approvedAt && (
                    <span>Disetujui: {formatDateTime(memo.approvedAt)}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {memo.aiSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-700">{memo.aiSummary}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    Confidence Score: {memo.aiConfidence}% · Human-in-the-loop review diperlukan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analisis AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Risk Score</span>
                  </div>
                  <span className="text-lg font-bold text-red-700">
                    {memo.aiRiskScore ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">Compliance</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-700">
                    {memo.aiComplianceScore ? `${memo.aiComplianceScore}%` : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent>
                <MemorandumActions
                  id={memo.id}
                  status={memo.status}
                  hasAiSummary={!!memo.aiSummary}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alur Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-xs text-slate-600">
                  {[
                    "Divisi Pengusul",
                    "Bidang Informasi & Data",
                    "Corporate Secretary",
                    "AI Resume",
                    "Review CorpSec",
                    "Pemimpin Bidang",
                    "Sekretaris Direksi",
                    "Direksi Approve/Reject",
                    "Digital Signature",
                    "Arsip & Feedback AI",
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
