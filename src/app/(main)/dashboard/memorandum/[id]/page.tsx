import { getSession } from "@/lib/auth";
import { MemorandumDetailView } from "@/components/memorandum/MemorandumDetailView";
import { MarkAsRead } from "@/components/memorandum/WorkflowStepper";

export default async function MemorandumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  return (
    <>
      <MarkAsRead id={Number(id)} />
      <MemorandumDetailView
        id={Number(id)}
        session={session!}
        backHref="/dashboard/memorandum"
      />
    </>
  );
}
