export function ReadIndicator({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
        isRead ? "bg-emerald-500" : "bg-red-500"
      }`}
      title={isRead ? "Sudah dibaca" : "Belum dibaca"}
      aria-label={isRead ? "Sudah dibaca" : "Belum dibaca"}
    />
  );
}
