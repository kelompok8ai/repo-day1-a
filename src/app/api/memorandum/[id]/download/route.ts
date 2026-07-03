import { NextResponse } from "next/server";
import { getMemorandumById, updateAiReview } from "@/lib/db/queries";
import { buildAiReviewDownloadText } from "@/lib/ai-analysis";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const text = buildAiReviewDownloadText(memo);
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="review-ai-${memo.number.replace(/\//g, "-")}.txt"`,
    },
  });
}
