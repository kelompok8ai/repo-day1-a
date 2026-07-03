import { NextResponse } from "next/server";
import { getMemorandumById } from "@/lib/db/queries";
import { getMemorandumFilePath } from "@/lib/storage";
import fs from "fs";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memo = getMemorandumById(Number(id));
  if (!memo?.filePath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fullPath = getMemorandumFilePath(memo.filePath);
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(fullPath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": memo.fileMimeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${memo.fileName ?? "memorandum"}"`,
    },
  });
}
