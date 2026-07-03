export function PdfViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <iframe
        src={url}
        title={title}
        className="h-[480px] w-full"
      />
    </div>
  );
}
