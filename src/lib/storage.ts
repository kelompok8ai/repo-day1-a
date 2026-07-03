import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

export async function saveMemorandumFile(file: File, memoNumber: string) {
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
  };
}

export function getMemorandumFilePath(storedName: string) {
  return path.join(ensureUploadDir(), storedName);
}

export function readMemorandumFileAsText(storedName: string): string | null {
  const fullPath = getMemorandumFilePath(storedName);
  if (!fs.existsSync(fullPath)) return null;
  const ext = path.extname(storedName).toLowerCase();
  if ([".txt", ".md"].includes(ext)) {
    return fs.readFileSync(fullPath, "utf-8");
  }
  return `[Dokumen scan/file: ${storedName}]`;
}
