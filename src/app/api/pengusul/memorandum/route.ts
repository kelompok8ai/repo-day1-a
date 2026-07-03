import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";
import { createMemorandum } from "@/lib/db/queries";
import { saveMemorandumFile } from "@/lib/storage";

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
  let fileMeta = { fileName: null as string | null, filePath: null as string | null, fileMimeType: null as string | null };

  if (file && file.size > 0) {
    fileMeta = await saveMemorandumFile(file, number);
  }

  const item = createMemorandum({
    number,
    title: form.get("title") as string,
    content: (form.get("content") as string) || `[Scan memorandum: ${fileMeta.fileName}]`,
    memoDate: form.get("memoDate") as string,
    proposerDivisi: session.divisi ?? "Divisi Pengusul",
    submittedByUserId: session.id,
    status: "uploaded",
    urgency: "normal",
    fileName: fileMeta.fileName,
    filePath: fileMeta.filePath,
    fileMimeType: fileMeta.fileMimeType,
    isRead: false,
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(item, { status: 201 });
}
