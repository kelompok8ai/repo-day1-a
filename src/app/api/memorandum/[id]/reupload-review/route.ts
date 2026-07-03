import { NextResponse } from "next/server";
import { getMemorandumById, updateAiReview } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memoId = Number(id);
  const memo = getMemorandumById(memoId);
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  const text = await file.text();
  const result = updateAiReview(memoId, {
    aiSummary: text,
    aiRiskScore: memo.aiRiskScore ?? undefined,
    aiComplianceScore: memo.aiComplianceScore ?? undefined,
  });

  return NextResponse.json(result);
}
