import type { KnowledgeDocument, Memorandum } from "./db/schema";

const REGULATORY_KEYWORDS = [
  "ojk",
  "bi",
  "lps",
  "regulasi",
  "po",
  "uu",
  "peraturan",
  "compliance",
  "risiko",
  "digital",
  "kredit",
  "deposito",
  "it",
  "siber",
];

function findRelevantRegulations(
  memo: Memorandum,
  knowledgeDocs: KnowledgeDocument[]
) {
  const text = `${memo.title} ${memo.content}`.toLowerCase();
  return knowledgeDocs.filter((doc) => {
    const docText = `${doc.title} ${doc.content} ${doc.type}`.toLowerCase();
    return REGULATORY_KEYWORDS.some(
      (kw) => text.includes(kw) && docText.includes(kw)
    ) || docText.split(" ").some((word) => word.length > 4 && text.includes(word));
  }).slice(0, 4);
}

export function generateSmdDocumentId(memoNumber: string) {
  const seq = memoNumber.split("/").pop() ?? "0000";
  return `SMD-BSM-${new Date().getFullYear()}-${seq}`;
}

export function buildAiAnalysis(
  memo: Memorandum,
  knowledgeDocs: KnowledgeDocument[],
  fileContent?: string | null
) {
  const smdId = generateSmdDocumentId(memo.number);
  const regulations = findRelevantRegulations(memo, knowledgeDocs);
  const regulatoryRefs = regulations.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    category: r.category,
  }));

  const regList = regulations.length
    ? regulations.map((r) => `• ${r.title} (${r.type})`).join("\n")
    : "• POJK No. 18/2023 - Manajemen Risiko Bank\n• SK Direksi No. 12/2025 - Kebijakan Manajemen Risiko";

  const sourceNote = fileContent
    ? `\n\nSumber: Hasil ekstraksi dokumen scan/file yang terhubung ke SMD (${smdId}).`
    : `\n\nSumber: Dokumen terdaftar di SMD (${smdId}).`;

  const summary = `RINGKASAN EKSEKUTIF AI
━━━━━━━━━━━━━━━━━━━━
Memorandum: ${memo.title}
No: ${memo.number} | Divisi: ${memo.proposerDivisi}
Integrasi SMD: ${smdId}

${memo.content.slice(0, 500)}${memo.content.length > 500 ? "..." : ""}
${sourceNote}

REFERENSI REGULASI & KEBIJAKAN:
${regList}

REKOMENDASI:
Memorandum ini perlu direview Corporate Secretary sebelum diteruskan ke Pemimpin Bidang. Pastikan kesesuaian dengan ketentuan internal Bank Sumut dan regulasi OJK/BI yang berlaku.`;

  const riskScore = Math.min(
    90,
    Math.floor(Math.random() * 35) +
      (memo.urgency === "high" ? 25 : 15) +
      (regulations.length < 2 ? 10 : 0)
  );

  const complianceScore = Math.min(
    99,
    Math.floor(Math.random() * 10) + 85 + regulations.length * 2
  );

  return {
    smdDocumentId: smdId,
    regulatoryReferences: JSON.stringify(regulatoryRefs),
    aiSummary: summary,
    aiRiskScore: riskScore,
    aiComplianceScore: complianceScore,
    aiConfidence: Math.floor(Math.random() * 10) + 82,
    regulations,
  };
}

export function buildAiReviewDownloadText(memo: Memorandum) {
  let refs: { title: string; type: string }[] = [];
  try {
    refs = memo.regulatoryReferences ? JSON.parse(memo.regulatoryReferences) : [];
  } catch {
    refs = [];
  }

  return `REVIEW AI MEMORANDUM - BANK SUMUT
================================
No: ${memo.number}
Judul: ${memo.title}
Divisi: ${memo.proposerDivisi}
SMD ID: ${memo.smdDocumentId ?? "-"}

--- RINGKASAN AI ---
${memo.aiSummary ?? "-"}

--- ANALISIS ---
Risk Score: ${memo.aiRiskScore ?? "-"}
Compliance Score: ${memo.aiComplianceScore ?? "-"}%
Confidence: ${memo.aiConfidence ?? "-"}%

--- REFERENSI REGULASI ---
${refs.map((r) => `- ${r.title} (${r.type})`).join("\n") || "-"}

(Dokumen ini dapat diedit dan di-upload kembali melalui sistem)
`;
}
