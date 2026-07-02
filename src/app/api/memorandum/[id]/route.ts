import { NextResponse } from "next/server";
import { generateAiSummary, updateMemorandumStatus } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action } = await request.json();
  const memoId = Number(id);

  switch (action) {
    case "generate_ai": {
      const result = generateAiSummary(memoId);
      return NextResponse.json(result);
    }
    case "approve": {
      const result = updateMemorandumStatus(memoId, "approved");
      return NextResponse.json(result);
    }
    case "reject": {
      const result = updateMemorandumStatus(memoId, "rejected");
      return NextResponse.json(result);
    }
    case "sign": {
      const result = updateMemorandumStatus(memoId, "signed");
      return NextResponse.json(result);
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
