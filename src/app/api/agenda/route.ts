import { NextResponse } from "next/server";
import { createAgenda } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const item = createAgenda({
    title: body.title,
    description: body.description || null,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    location: body.location || null,
    status: "scheduled",
    priority: body.priority || "normal",
    preparationNotes: body.preparationNotes || null,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json(item, { status: 201 });
}
