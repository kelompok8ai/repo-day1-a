import { NextResponse } from "next/server";
import { createMemorandum } from "@/lib/db/queries";
import { saveMemorandumFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  const memoNumber = `MEM/${year}/${random}`;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    let fileMeta = { fileName: null as string | null, filePath: null as string | null, fileMimeType: null as string | null };

    if (file && file.size > 0) {
      const saved = await saveMemorandumFile(file, memoNumber);
      fileMeta = saved;
    }

    const content =
      (form.get("content") as string) ||
      (fileMeta.fileName ? `[Dokumen upload: ${fileMeta.fileName}]` : "");

    const item = createMemorandum({
      number: memoNumber,
      title: form.get("title") as string,
      content,
      proposerDivisi: form.get("proposerDivisi") as string,
      status: "uploaded",
      urgency: (form.get("urgency") as string) || "normal",
      fileName: fileMeta.fileName,
      filePath: fileMeta.filePath,
      fileMimeType: fileMeta.fileMimeType,
      isRead: false,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json(item, { status: 201 });
  }

  const body = await request.json();
  const item = createMemorandum({
    number: memoNumber,
    title: body.title,
    content: body.content,
    proposerDivisi: body.proposerDivisi,
    status: "uploaded",
    urgency: body.urgency || "normal",
    isRead: false,
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json(item, { status: 201 });
}
