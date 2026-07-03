"use client";

import { useRef, useState } from "react";

export function DigitalSignaturePad({
  onSign,
  onCancel,
  loading,
}: {
  onSign: (signatureData: string) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#065f46";
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    setDrawing(false);
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function submit() {
    const canvas = canvasRef.current!;
    onSign(canvas.toDataURL("image/png"));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Gambar tanda tangan digital di bawah:</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-white touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Hapus
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Approve & Tanda Tangan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
