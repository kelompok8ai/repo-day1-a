import { NextResponse } from "next/server";
import { createMemorandum } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  const item = createMemorandum({
    number: `MEM/${year}/${random}`,
    title: body.title,
    content: body.content,
    proposerDivisi: body.proposerDivisi,
    status: "ai_review",
    urgency: body.urgency || "normal",
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json(item, { status: 201 });
}
