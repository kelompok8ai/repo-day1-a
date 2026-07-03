import { NextResponse } from "next/server";
import { createMemorandum, generateAiSummary, getMemorandumById } from "@/lib/db/queries";
import { saveMemorandumPdf } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const customNumber = (form.get("number") as string)?.trim();
    const memoNumber = customNumber || `MEM/${year}/${random}`;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "File PDF wajib diupload" }, { status: 400 });
    }

    const pdfError = validatePdfFile(file);
    if (pdfError) {
      return NextResponse.json({ error: pdfError }, { status: 400 });
    }

    const saved = await saveMemorandumPdf(file, memoNumber);
    const note = (form.get("content") as string)?.trim();
    const content =
      saved.extractedText ||
      note ||
      `[Memorandum PDF: ${saved.fileName}]`;

    const item = createMemorandum({
      number: memoNumber,
      title: form.get("title") as string,
      content,
      memoDate: (form.get("memoDate") as string) || null,
      proposerDivisi: form.get("proposerDivisi") as string,
      status: "uploaded",
      urgency: (form.get("urgency") as string) || "normal",
      fileName: saved.fileName,
      filePath: saved.filePath,
      fileMimeType: saved.fileMimeType,
      isRead: false,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const autoAnalyze = form.get("autoAnalyze") === "true";
    if (autoAnalyze) {
      await generateAiSummary(item.id);
      const updated = getMemorandumById(item.id);
      return NextResponse.json(updated ?? item, { status: 201 });
    }

    return NextResponse.json(item, { status: 201 });
  }

  return NextResponse.json({ error: "Gunakan upload file PDF" }, { status: 400 });
}
