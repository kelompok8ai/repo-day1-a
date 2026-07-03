import fs from "fs";
import path from "path";
import { extractPdfText, isPdfFile } from "./pdf";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

export async function saveMemorandumPdf(file: File, memoNumber: string) {
  ensureUploadDir();
  const ext = ".pdf";
  const safeName = `${memoNumber.replace(/\//g, "-")}-${Date.now()}${ext}`;
  const fullPath = path.join(UPLOAD_DIR, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(fullPath, buffer);

  let extractedText = "";
  try {
    extractedText = await extractPdfText(buffer);
  } catch {
    extractedText = "";
  }

  return {
    fileName: file.name,
    filePath: safeName,
    fileMimeType: "application/pdf",
    extractedText,
  };
}

/** @deprecated use saveMemorandumPdf for new uploads */
export async function saveMemorandumFile(file: File, memoNumber: string) {
  if (isPdfFile(file)) {
    return saveMemorandumPdf(file, memoNumber);
  }
  ensureUploadDir();
  const ext = path.extname(file.name) || ".pdf";
  const safeName = `${memoNumber.replace(/\//g, "-")}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return {
    fileName: file.name,
    filePath: safeName,
    fileMimeType: file.type || "application/octet-stream",
    extractedText: "",
  };
}

export function getMemorandumFilePath(storedName: string) {
  return path.join(ensureUploadDir(), storedName);
}

export async function readMemorandumFileAsText(storedName: string): Promise<string | null> {
  const fullPath = getMemorandumFilePath(storedName);
  if (!fs.existsSync(fullPath)) return null;
  const ext = path.extname(storedName).toLowerCase();
  if (ext === ".pdf") {
    try {
      const buffer = fs.readFileSync(fullPath);
      const text = await extractPdfText(buffer);
      return text || `[Dokumen PDF: ${storedName}]`;
    } catch {
      return `[Dokumen PDF: ${storedName}]`;
    }
  }
  if ([".txt", ".md"].includes(ext)) {
    return fs.readFileSync(fullPath, "utf-8");
  }
  return `[Dokumen file: ${storedName}]`;
}
