"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { validatePdfFile } from "@/lib/pdf";

type Props = {
  onFileChange?: (file: File | null) => void;
};

export function MemorandumPdfUpload({ onFileChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (selected: File | null) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setError(null);

      if (!selected) {
        setFile(null);
        onFileChange?.(null);
        return;
      }

      const validationError = validatePdfFile(selected);
      if (validationError) {
        setError(validationError);
        setFile(null);
        onFileChange?.(null);
        return;
      }

      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      onFileChange?.(selected);
    },
    [onFileChange, previewUrl]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }

  function removeFile() {
    handleFile(null);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Upload Memorandum (PDF) *
      </label>

      {!file ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 transition ${
            dragOver
              ? "border-emerald-500 bg-emerald-50"
              : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
        >
          <Upload className="h-10 w-10 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">
            Klik atau drag & drop file PDF
          </span>
          <span className="text-xs text-slate-500">Format: .pdf — Maks. 20 MB</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-50 p-2">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">
                  PDF · {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Hapus file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {previewUrl && (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <iframe
                src={previewUrl}
                title="Preview PDF"
                className="h-72 w-full bg-slate-50"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Memorandum wajib diupload dalam format PDF. Teks PDF akan diekstrak otomatis untuk analisa AI.
      </p>
    </div>
  );
}
