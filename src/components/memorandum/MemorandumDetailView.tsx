import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PdfViewer } from "@/components/memorandum/PdfViewer";
import { MemorandumWorkflowPanel } from "@/components/memorandum/MemorandumWorkflowPanel";
import { WorkflowStepper } from "@/components/memorandum/WorkflowStepper";
import { AiReviewEditor } from "@/components/memorandum/AiReviewEditor";
import { getMemorandumById } from "@/lib/db/queries";
import {
  getApprovalsForMemo,
  getBoardMembers,
} from "@/lib/db/workflow-queries";
import { MEMORANDUM_STATUS, URGENCY } from "@/lib/constants";
import type { SessionUser } from "@/lib/auth";
import type { RouteType } from "@/lib/workflow";

export async function MemorandumDetailView({
  id,
  session,
  backHref,
}: {
  id: number;
  session: SessionUser;
  backHref: string;
}) {
  const memo = getMemorandumById(id);
  if (!memo) notFound();

  const routeType = (memo.routeType as RouteType | null) ?? "direksi";
  const boardMembers = getBoardMembers(routeType).map((m) => ({
    id: m.id,
    name: m.name,
    boardPosition: m.boardPosition,
  }));
  const approvals = getApprovalsForMemo(id);
  const statusInfo = MEMORANDUM_STATUS[memo.status];
  const isPdf = memo.fileMimeType === "application/pdf" || !!memo.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <Header title={memo.title} subtitle={memo.number} session={session} />
      <div className="space-y-6 p-6">
        <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="flex flex-wrap gap-2">
          <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
          <Badge className={URGENCY[memo.urgency]?.color}>{URGENCY[memo.urgency]?.label}</Badge>
        </div>

        <WorkflowStepper status={memo.status} />

        {memo.fileName && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Dokumen PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm font-medium">{memo.fileName}</p>
              {isPdf && memo.filePath && (
                <PdfViewer url={`/api/memorandum/${memo.id}/file`} title={memo.fileName} />
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Isi Memorandum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700">{memo.content}</p>
          </CardContent>
        </Card>

        {(memo.aiSummary || session.role === "corpsec") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" /> AI Executive Summary
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
            </CardContent>
          </Card>
        )}

        {memo.rejectionComment && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-orange-900">Komentar Revisi</p>
              <p className="text-sm text-orange-800">{memo.rejectionComment}</p>
            </CardContent>
          </Card>
        )}

        {memo.returnToPengusulComment && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-rose-900">Keputusan untuk Pengusul</p>
              <p className="text-sm text-rose-800">{memo.returnToPengusulComment}</p>
            </CardContent>
          </Card>
        )}

        {approvals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Keputusan Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {approvals.map((a) => (
                <div key={a.id} className="rounded border p-2 text-sm">
                  <span className="font-medium">{a.role}</span> — {a.decision ?? "pending"}
                  {a.comment && <p className="text-slate-600">{a.comment}</p>}
                  {a.disposition && <p className="text-xs text-slate-500">Disposisi: {a.disposition}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Aksi Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <MemorandumWorkflowPanel
              id={memo.id}
              status={memo.status}
              hasAiSummary={!!memo.aiSummary}
              role={session.role}
              pimpinanDecision={memo.pimpinanDecision}
              routeType={memo.routeType}
              boardMembers={boardMembers}
              userName={session.name}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
