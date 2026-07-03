import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllMedia } from "@/lib/db/queries";
import { SENTIMENT } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function MediaPage() {
  const articles = getAllMedia();

  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <>
      <Header
        title="Media Monitoring"
        subtitle="Pantau berita Bank Sumut, regulasi, dan industri perbankan"
      />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat} className="bg-slate-100 text-slate-700">
              {cat} ({articles.filter((a) => a.category === cat).length})
            </Badge>
          ))}
        </div>

        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{article.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {article.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{article.source}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <Badge className="bg-brand-100 text-brand-600">{article.category}</Badge>
                    <span className={`text-xs font-medium ${SENTIMENT[article.sentiment]?.color}`}>
                      {SENTIMENT[article.sentiment]?.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
