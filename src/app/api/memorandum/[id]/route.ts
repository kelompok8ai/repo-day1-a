import { NextResponse } from "next/server";
import {
  generateAiSummary,
  updateAiReview,
  sendToPimpinanBidang,
  approveWithSignature,
  rejectWithComment,
  getMemorandumById,
} from "@/lib/db/queries";
import {
  sendToSecretariat,
  receiveBySecretariat,
  forwardToBoard,
  boardMemberDecision,
  sekReturnToCorpsec,
  returnToPengusul,
  finalizeToPengusul,
} from "@/lib/db/workflow-queries";
import { requireApiRole, isErrorResponse } from "@/lib/api-auth";
import type { RouteType } from "@/lib/workflow";
import type { UserRole } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action } = body;
  const memoId = Number(id);

  switch (action) {
    case "generate_ai": {
      const session = await requireApiRole("corpsec");
      if (isErrorResponse(session)) return session;
      const result = await generateAiSummary(memoId);
      return NextResponse.json(result);
    }
    case "update_ai_review": {
      const session = await requireApiRole("corpsec");
      if (isErrorResponse(session)) return session;
      const result = updateAiReview(memoId, {
        aiSummary: body.aiSummary,
        aiRiskScore: body.aiRiskScore,
        aiComplianceScore: body.aiComplianceScore,
      });
      return NextResponse.json(result);
    }
    case "send_to_pimpinan": {
      const session = await requireApiRole("corpsec");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(sendToPimpinanBidang(memoId));
    }
    case "return_to_pengusul": {
      const session = await requireApiRole("corpsec");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(returnToPengusul(memoId, body.comment ?? ""));
    }
    case "finalize_to_pengusul": {
      const session = await requireApiRole("corpsec");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(
        finalizeToPengusul(memoId, body.comment ?? "", !!body.approved)
      );
    }
    case "approve_sign": {
      const session = await requireApiRole("pimpinan_bidang");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(
        approveWithSignature(memoId, body.signatureData, body.signedBy ?? session.name)
      );
    }
    case "reject_with_comment": {
      const session = await requireApiRole("pimpinan_bidang");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(rejectWithComment(memoId, body.comment ?? ""));
    }
    case "send_to_secretariat": {
      const session = await requireApiRole("pimpinan_bidang", "corpsec");
      if (isErrorResponse(session)) return session;
      const routeType = body.routeType as RouteType;
      if (!routeType || !["direksi", "komisaris"].includes(routeType)) {
        return NextResponse.json({ error: "routeType wajib direksi atau komisaris" }, { status: 400 });
      }
      return NextResponse.json(
        sendToSecretariat(
          memoId,
          routeType,
          session.role === "pimpinan_bidang" ? "pimpinan_bidang" : "corpsec"
        )
      );
    }
    case "terima": {
      const session = await requireApiRole("sekdireksi", "sekretaris_komisaris");
      if (isErrorResponse(session)) return session;
      const routeType: RouteType =
        session.role === "sekdireksi" ? "direksi" : "komisaris";
      return NextResponse.json(receiveBySecretariat(memoId, routeType));
    }
    case "forward_to_board": {
      const session = await requireApiRole("sekdireksi", "sekretaris_komisaris");
      if (isErrorResponse(session)) return session;
      const routeType: RouteType =
        session.role === "sekdireksi" ? "direksi" : "komisaris";
      const targetUserIds = (body.targetUserIds as number[]) ?? [];
      if (!targetUserIds.length) {
        return NextResponse.json({ error: "Pilih minimal 1 direksi/komisaris" }, { status: 400 });
      }
      return NextResponse.json(forwardToBoard(memoId, targetUserIds, routeType));
    }
    case "board_decision": {
      const session = await requireApiRole("direksi", "komisaris");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(
        boardMemberDecision(memoId, session.id, {
          decision: body.decision,
          comment: body.comment,
          disposition: body.disposition,
          signatureData: body.signatureData,
        })
      );
    }
    case "sek_return_corpsec": {
      const session = await requireApiRole("sekdireksi", "sekretaris_komisaris");
      if (isErrorResponse(session)) return session;
      const routeType: RouteType =
        session.role === "sekdireksi" ? "direksi" : "komisaris";
      return NextResponse.json(sekReturnToCorpsec(memoId, body.comment ?? "", routeType));
    }
    // legacy
    case "send_to_sekdireksi": {
      const session = await requireApiRole("corpsec", "pimpinan_bidang");
      if (isErrorResponse(session)) return session;
      return NextResponse.json(sendToSecretariat(memoId, "direksi", "corpsec"));
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiRole(
    "corpsec",
    "pimpinan_bidang",
    "sekdireksi",
    "sekretaris_komisaris",
    "direksi",
    "komisaris",
    "pengusul"
  );
  if (isErrorResponse(session)) return session;

  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.role === "pengusul" && memo.submittedByUserId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(memo);
}
