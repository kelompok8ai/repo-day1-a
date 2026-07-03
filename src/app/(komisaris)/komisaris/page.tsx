import { getSession } from "@/lib/auth";
import { getBoardMemorandumForUser } from "@/lib/db/workflow-queries";
import { MemorandumInbox } from "@/components/memorandum/MemorandumInbox";

export default async function KomisarisPage() {
  const session = await getSession();
  const items = getBoardMemorandumForUser(session!.id);

  return (
    <MemorandumInbox
      title="Komisaris"
      subtitle={`Memorandum menunggu keputusan — ${session!.name}`}
      items={items}
      session={session!}
      detailHrefPrefix="/komisaris"
    />
  );
}
