import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  AlertTriangle,
  FileText,
  Link2,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MemorandumActions } from "@/components/memorandum/MemorandumActions";
import { AiReviewEditor } from "@/components/memorandum/AiReviewEditor";
import { WorkflowStepper, MarkAsRead } from "@/components/memorandum/WorkflowStepper";
import { ReadIndicator } from "@/components/memorandum/ReadIndicator";
import { getMemorandumById } from "@/lib/db/queries";
import { getSession } from "@/lib/auth";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";

function parseRegulatoryRefs(json: string | null) {
  if (!json) return [];
  try {
    return JSON.parse(json) as { title: string; type: string; category: string }[];
  } catch {
    return [];
  }
}

export default async function MemorandumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo) notFound();
  const session = await getSession();
  if (!session) notFound();

  const statusInfo = MEMORANDUM_STATUS[memo.status];
  const regulatoryRefs = parseRegulatoryRefs(memo.regulatoryReferences);

  return (
    <>
      <MarkAsRead id={memo.id} />
      <Header title={memo.title} subtitle={memo.number} session={session} />
      <div className="space-y-6 p-6">
        <Link
          href="/memorandum"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <ReadIndicator isRead={memo.isRead} />
          <span className="text-xs text-slate-500">
            {memo.isRead ? "Sudah dibaca" : "Belum dibaca"}
          </span>
          <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
          <Badge className={URGENCY[memo.urgency]?.color}>
            Urgensi: {URGENCY[memo.urgency]?.label}
          </Badge>
          {memo.aiSummaryEdited && (
            <Badge className="bg-blue-100 text-blue-700">Review AI Diedit</Badge>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* File upload info */}
            {memo.fileName && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dokumen Memorandum (Scan/File)
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{memo.fileName}</p>
                    {memo.smdDocumentId && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                        <Link2 className="h-3 w-3" />
                        SMD: {memo.smdDocumentId}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/api/memorandum/${memo.id}/file`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Download File
                  </a>
                </CardContent>
              </Card>
            )}

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

            {/* Rejection comment */}
            {memo.rejectionComment && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">
                    Komentar Revisi dari Pimpinan Bidang
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-900">{memo.rejectionComment}</p>
                </CardContent>
              </Card>
            )}

            {/* AI Review - editable */}
            {(memo.aiSummary || ["corpsec_review", "returned_to_corpsec"].includes(memo.status)) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Executive Summary
                    {memo.aiSummaryEdited && (
                      <span className="text-xs font-normal text-blue-600">(diedit)</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AiReviewEditor
                    id={memo.id}
                    status={memo.status}
                    initialSummary={memo.aiSummary ?? ""}
                    initialRisk={memo.aiRiskScore}
                    initialCompliance={memo.aiComplianceScore}
                    role={session.role}
                  />
                  {memo.aiConfidence && (
                    <p className="mt-3 text-xs text-slate-400">
                      Confidence Score: {memo.aiConfidence}% · Human-in-the-loop review
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Regulatory references */}
            {regulatoryRefs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Referensi Regulasi & Kebijakan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {regulatoryRefs.map((ref, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-slate-100 p-2 text-sm"
                      >
                        <Badge
                          className={
                            ref.category === "internal"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {ref.type}
                        </Badge>
                        <span className="text-slate-700">{ref.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Digital signature display */}
            {memo.signatureData && (
              <Card>
                <CardHeader>
                  <CardTitle>Tanda Tangan Digital</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={memo.signatureData}
                    alt="Tanda tangan digital"
                    className="max-h-24 rounded border border-slate-200 bg-white p-2"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Ditandatangani oleh: {memo.signedBy} · {memo.signedAt && formatDateTime(memo.signedAt)}
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
                  role={session.role}
                  pimpinanDecision={memo.pimpinanDecision}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alur Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepper status={memo.status} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
