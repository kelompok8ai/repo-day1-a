import { PDFParse } from "pdf-parse";

export const PDF_MIME_TYPES = ["application/pdf"];
export const PDF_MAX_SIZE_MB = 20;

export function isPdfFile(file: File | { name: string; type: string }) {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

export function validatePdfFile(file: File): string | null {
  if (!isPdfFile(file)) {
    return "Hanya file PDF yang diperbolehkan (.pdf)";
  }
  if (file.size > PDF_MAX_SIZE_MB * 1024 * 1024) {
    return `Ukuran file maksimal ${PDF_MAX_SIZE_MB} MB`;
  }
  if (file.size === 0) {
    return "File PDF kosong";
  }
  return null;
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text?.trim() ?? "";
  } finally {
    await parser.destroy();
  }
}
