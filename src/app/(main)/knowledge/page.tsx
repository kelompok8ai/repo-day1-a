import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllKnowledge } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { BookOpen, Globe } from "lucide-react";

export default function KnowledgePage() {
  const docs = getAllKnowledge();
  const internal = docs.filter((d) => d.category === "internal");
  const external = docs.filter((d) => d.category === "external");

  return (
    <>
      <Header
        title="Knowledge Management"
        subtitle="Basis pengetahuan internal dan regulasi eksternal untuk AI RAG"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="rounded-lg bg-brand-50 p-3">
                <BookOpen className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{internal.length}</p>
                <p className="text-sm text-slate-500">Dokumen Internal</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{external.length}</p>
                <p className="text-sm text-slate-500">Regulasi Eksternal</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {[
          { title: "Dokumen Internal", items: internal, icon: BookOpen },
          { title: "Regulasi Eksternal", items: external, icon: Globe },
        ].map(({ title, items, icon: Icon }) => (
          <div key={title}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Icon className="h-5 w-5 text-brand-600" />
              {title}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((doc) => (
                <Card key={doc.id}>
                  <CardContent>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-slate-900">{doc.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{doc.content}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          Diperbarui: {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                      <Badge
                        className={
                          doc.category === "internal"
                            ? "bg-brand-100 text-brand-600"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {doc.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-slate-500">
              AI Governance: Knowledge Base diperbarui melalui proses review Corporate Secretary
              dan AI Knowledge Manager. AI tidak belajar otomatis dari seluruh memorandum.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
