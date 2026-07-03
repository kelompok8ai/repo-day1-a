import { getSession } from "@/lib/auth";
import { getSekdireksiMemorandum, getBoardMembers } from "@/lib/db/workflow-queries";
import { MemorandumInbox } from "@/components/memorandum/MemorandumInbox";

export default async function SekdireksiPage() {
  const session = await getSession();
  const items = getSekdireksiMemorandum();

  return (
    <MemorandumInbox
      title="Sekretaris Direksi"
      subtitle="Terima, filter, dan teruskan memorandum ke Direksi (5 direksi)"
      items={items}
      session={session!}
      detailHrefPrefix="/sekdireksi"
    />
  );
}
