import { NextResponse } from "next/server";
import { markMemorandumRead } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = markMemorandumRead(Number(id));
  return NextResponse.json(result);
}
