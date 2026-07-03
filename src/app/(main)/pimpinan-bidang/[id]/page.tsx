import { getSession } from "@/lib/auth";
import { MemorandumDetailView } from "@/components/memorandum/MemorandumDetailView";

export default async function PimpinanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  return (
    <MemorandumDetailView
      id={Number(id)}
      session={session!}
      backHref="/pimpinan-bidang"
    />
  );
}
