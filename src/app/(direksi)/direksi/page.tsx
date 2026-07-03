import { getSession } from "@/lib/auth";
import { getBoardMemorandumForUser } from "@/lib/db/workflow-queries";
import { MemorandumInbox } from "@/components/memorandum/MemorandumInbox";

export default async function DireksiPage() {
  const session = await getSession();
  const items = getBoardMemorandumForUser(session!.id);

  return (
    <MemorandumInbox
      title="Direksi"
      subtitle={`Memorandum menunggu keputusan — ${session!.name}`}
      items={items}
      session={session!}
      detailHrefPrefix="/direksi"
    />
  );
}
