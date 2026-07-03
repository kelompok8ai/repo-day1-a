import { getSession } from "@/lib/auth";
import { getSekkomMemorandum } from "@/lib/db/workflow-queries";
import { MemorandumInbox } from "@/components/memorandum/MemorandumInbox";

export default async function SekkomPage() {
  const session = await getSession();
  const items = getSekkomMemorandum();

  return (
    <MemorandumInbox
      title="Sekretaris Komisaris"
      subtitle="Terima, filter, dan teruskan memorandum ke Komisaris (3 komisaris)"
      items={items}
      session={session!}
      detailHrefPrefix="/sekretaris-komisaris"
    />
  );
}
