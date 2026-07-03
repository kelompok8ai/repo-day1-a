import { NextResponse } from "next/server";
import {
  generateAiSummary,
  updateAiReview,
  sendToPimpinanBidang,
  approveWithSignature,
  rejectWithComment,
  sendToSekdireksi,
  receiveBySekdireksi,
  getMemorandumById,
} from "@/lib/db/queries";

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
      const result = generateAiSummary(memoId);
      return NextResponse.json(result);
    }
    case "update_ai_review": {
      const result = updateAiReview(memoId, {
        aiSummary: body.aiSummary,
        aiRiskScore: body.aiRiskScore,
        aiComplianceScore: body.aiComplianceScore,
      });
      return NextResponse.json(result);
    }
    case "send_to_pimpinan": {
      const result = sendToPimpinanBidang(memoId);
      return NextResponse.json(result);
    }
    case "approve_sign": {
      const result = approveWithSignature(
        memoId,
        body.signatureData,
        body.signedBy ?? "Pemimpin Bidang"
      );
      return NextResponse.json(result);
    }
    case "reject_with_comment": {
      const result = rejectWithComment(memoId, body.comment ?? "");
      return NextResponse.json(result);
    }
    case "send_to_sekdireksi": {
      const result = sendToSekdireksi(memoId);
      return NextResponse.json(result);
    }
    case "terima": {
      const result = receiveBySekdireksi(memoId);
      return NextResponse.json(result);
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(memo);
}
