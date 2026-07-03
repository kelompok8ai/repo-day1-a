import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";
import { createMemorandum } from "@/lib/db/queries";
import { saveMemorandumPdf } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let session: SessionUser;
  try {
    session = JSON.parse(raw) as SessionUser;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "pengusul") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const number = form.get("number") as string;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "File PDF wajib diupload" }, { status: 400 });
  }

  const pdfError = validatePdfFile(file);
  if (pdfError) {
    return NextResponse.json({ error: pdfError }, { status: 400 });
  }

  const saved = await saveMemorandumPdf(file, number);
  const note = (form.get("content") as string)?.trim();
  const content = saved.extractedText || note || `[Memorandum PDF: ${saved.fileName}]`;

  const item = createMemorandum({
    number,
    title: form.get("title") as string,
    content,
    memoDate: form.get("memoDate") as string,
    proposerDivisi: session.divisi ?? "Divisi Pengusul",
    submittedByUserId: session.id,
    status: "uploaded",
    urgency: "normal",
    fileName: saved.fileName,
    filePath: saved.filePath,
    fileMimeType: saved.fileMimeType,
    isRead: false,
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(item, { status: 201 });
}
