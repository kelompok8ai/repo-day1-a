import { eq, and, gte, lte, desc, count, sql, inArray } from "drizzle-orm";
import { getDb } from "./index";
import * as schema from "./schema";
import { getToday, getWeekRange } from "../utils";
import { buildAiAnalysis } from "../ai-analysis";
import { readMemorandumFileAsText } from "../storage";

const PIMPINAN_STATUSES = ["pimpinan_review", "pending_approval"];
const ACTIVE_STATUSES = sql`${schema.memorandum.status} NOT IN ('approved', 'rejected', 'signed')`;

export function getDashboardStats() {
  const db = getDb();
  const today = getToday();
  const week = getWeekRange();

  const todayAgenda = db
    .select()
    .from(schema.agenda)
    .where(eq(schema.agenda.date, today))
    .orderBy(schema.agenda.startTime)
    .all();

  const weekAgenda = db
    .select()
    .from(schema.agenda)
    .where(and(gte(schema.agenda.date, week.start), lte(schema.agenda.date, week.end)))
    .orderBy(schema.agenda.date, schema.agenda.startTime)
    .all();

  const pendingMemos = db
    .select()
    .from(schema.memorandum)
    .where(inArray(schema.memorandum.status, PIMPINAN_STATUSES))
    .orderBy(desc(schema.memorandum.submittedAt))
    .all();

  const highUrgencyMemos = db
    .select()
    .from(schema.memorandum)
    .where(and(eq(schema.memorandum.urgency, "high"), ACTIVE_STATUSES))
    .all();

  const aiReviewMemos = db
    .select()
    .from(schema.memorandum)
    .where(
      inArray(schema.memorandum.status, ["ai_review", "uploaded"])
    )
    .all();

  const unreadMemos = db
    .select()
    .from(schema.memorandum)
    .where(eq(schema.memorandum.isRead, false))
    .all();

  const bankNews = db
    .select()
    .from(schema.mediaArticles)
    .where(eq(schema.mediaArticles.category, "Bank Sumut"))
    .orderBy(desc(schema.mediaArticles.publishedAt))
    .limit(5)
    .all();

  const mediaSummary = db
    .select()
    .from(schema.mediaArticles)
    .orderBy(desc(schema.mediaArticles.publishedAt))
    .limit(5)
    .all();

  const regulatoryNotifs = db
    .select()
    .from(schema.regulatoryNotifications)
    .where(eq(schema.regulatoryNotifications.isRead, false))
    .orderBy(desc(schema.regulatoryNotifications.createdAt))
    .all();

  const followups = db
    .select({
      id: schema.meetingFollowups.id,
      description: schema.meetingFollowups.description,
      assignee: schema.meetingFollowups.assignee,
      dueDate: schema.meetingFollowups.dueDate,
      status: schema.meetingFollowups.status,
      meetingTitle: schema.meetings.title,
    })
    .from(schema.meetingFollowups)
    .innerJoin(schema.meetings, eq(schema.meetingFollowups.meetingId, schema.meetings.id))
    .where(sql`${schema.meetingFollowups.status} != 'completed'`)
    .orderBy(schema.meetingFollowups.dueDate)
    .all();

  const allMemos = db.select().from(schema.memorandum).all();
  const slaRecords = db.select().from(schema.slaRecords).all();

  const memoStats = {
    total: allMemos.length,
    pending: allMemos.filter((m) => PIMPINAN_STATUSES.includes(m.status)).length,
    approved: allMemos.filter((m) => m.status === "approved" || m.status === "signed").length,
    rejected: allMemos.filter((m) => m.status === "rejected").length,
    aiReview: allMemos.filter((m) => ["ai_review", "uploaded"].includes(m.status)).length,
    highUrgency: allMemos.filter((m) => m.urgency === "high").length,
    unread: unreadMemos.length,
  };

  const slaOnTrack = slaRecords.filter((s) => s.status === "on_track").length;
  const slaCompliance = slaRecords.length
    ? Math.round((slaOnTrack / slaRecords.length) * 100)
    : 100;

  const memoByStatus = [
    { name: "Review Pimpinan", value: memoStats.pending, fill: "#f59e0b" },
    { name: "Analisa AI", value: memoStats.aiReview, fill: "#a855f7" },
    { name: "Disetujui", value: memoStats.approved, fill: "#10b981" },
    { name: "Ditolak", value: memoStats.rejected, fill: "#ef4444" },
  ];

  const memoByMonth = [
    { month: "Jan", jumlah: 8 },
    { month: "Feb", jumlah: 12 },
    { month: "Mar", jumlah: 15 },
    { month: "Apr", jumlah: 11 },
    { month: "Mei", jumlah: 18 },
    { month: "Jun", jumlah: 14 },
  ];

  const slaTrend = [
    { month: "Jan", compliance: 92 },
    { month: "Feb", compliance: 94 },
    { month: "Mar", compliance: 91 },
    { month: "Apr", compliance: 96 },
    { month: "Mei", compliance: 93 },
    { month: "Jun", compliance: slaCompliance },
  ];

  const preparationItems = todayAgenda.filter((a) => a.preparationNotes);

  return {
    todayAgenda,
    weekAgenda,
    pendingMemos,
    highUrgencyMemos,
    aiReviewMemos,
    unreadMemos,
    bankNews,
    mediaSummary,
    regulatoryNotifs,
    followups,
    memoStats,
    slaCompliance,
    memoByStatus,
    memoByMonth,
    slaTrend,
    preparationItems,
  };
}

export function getAllAgenda() {
  const db = getDb();
  return db.select().from(schema.agenda).orderBy(desc(schema.agenda.date)).all();
}

export function getAllMemorandum() {
  const db = getDb();
  return db.select().from(schema.memorandum).orderBy(desc(schema.memorandum.createdAt)).all();
}

export function getPimpinanMemorandum() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(inArray(schema.memorandum.status, PIMPINAN_STATUSES))
    .orderBy(desc(schema.memorandum.submittedAt))
    .all();
}

export function getMemorandumById(id: number) {
  const db = getDb();
  return db.select().from(schema.memorandum).where(eq(schema.memorandum.id, id)).get();
}

export function markMemorandumRead(id: number) {
  const db = getDb();
  return db
    .update(schema.memorandum)
    .set({ isRead: true })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function getAllMeetings() {
  const db = getDb();
  return db.select().from(schema.meetings).orderBy(desc(schema.meetings.date)).all();
}

export function getMeetingFollowups() {
  const db = getDb();
  return db
    .select({
      id: schema.meetingFollowups.id,
      description: schema.meetingFollowups.description,
      assignee: schema.meetingFollowups.assignee,
      dueDate: schema.meetingFollowups.dueDate,
      status: schema.meetingFollowups.status,
      meetingTitle: schema.meetings.title,
    })
    .from(schema.meetingFollowups)
    .innerJoin(schema.meetings, eq(schema.meetingFollowups.meetingId, schema.meetings.id))
    .orderBy(schema.meetingFollowups.dueDate)
    .all();
}

export function getMeetingFollowupsByMeetingId(meetingId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.meetingFollowups)
    .where(eq(schema.meetingFollowups.meetingId, meetingId))
    .all();
}

export function getAllMedia() {
  const db = getDb();
  return db.select().from(schema.mediaArticles).orderBy(desc(schema.mediaArticles.publishedAt)).all();
}

export function getAllKnowledge() {
  const db = getDb();
  return db.select().from(schema.knowledgeDocuments).orderBy(desc(schema.knowledgeDocuments.updatedAt)).all();
}

export function getSlaData() {
  const db = getDb();
  const records = db
    .select({
      id: schema.slaRecords.id,
      targetHours: schema.slaRecords.targetHours,
      actualHours: schema.slaRecords.actualHours,
      status: schema.slaRecords.status,
      createdAt: schema.slaRecords.createdAt,
      memoNumber: schema.memorandum.number,
      memoTitle: schema.memorandum.title,
      urgency: schema.memorandum.urgency,
    })
    .from(schema.slaRecords)
    .innerJoin(schema.memorandum, eq(schema.slaRecords.memorandumId, schema.memorandum.id))
    .orderBy(desc(schema.slaRecords.createdAt))
    .all();

  const onTrack = records.filter((r) => r.status === "on_track").length;
  const breached = records.filter((r) => r.status === "breached").length;
  const compliance = records.length ? Math.round((onTrack / records.length) * 100) : 100;

  return { records, onTrack, breached, compliance, total: records.length };
}

export function getReportData() {
  const db = getDb();
  const memos = db.select().from(schema.memorandum).all();
  const sla = db.select().from(schema.slaRecords).all();
  const meetings = db.select().from(schema.meetings).all();
  const media = db.select().from(schema.mediaArticles).all();

  return {
    memoByStatus: [
      { status: "Upload", count: memos.filter((m) => m.status === "uploaded").length },
      { status: "Analisa AI", count: memos.filter((m) => m.status === "ai_review").length },
      { status: "Review CorpSec", count: memos.filter((m) => ["corpsec_review", "returned_to_corpsec"].includes(m.status)).length },
      { status: "Pimpinan Bidang", count: memos.filter((m) => PIMPINAN_STATUSES.includes(m.status)).length },
      { status: "Disetujui", count: memos.filter((m) => m.status === "approved" || m.status === "signed").length },
      { status: "Ditolak", count: memos.filter((m) => m.status === "rejected").length },
    ],
    memoByDivisi: Object.entries(
      memos.reduce<Record<string, number>>((acc, m) => {
        acc[m.proposerDivisi] = (acc[m.proposerDivisi] || 0) + 1;
        return acc;
      }, {})
    ).map(([divisi, count]) => ({ divisi, count })),
    slaBreakdown: [
      { name: "On Track", value: sla.filter((s) => s.status === "on_track").length },
      { name: "Terlambat", value: sla.filter((s) => s.status === "breached").length },
    ],
    mediaSentiment: [
      { sentiment: "Positif", count: media.filter((m) => m.sentiment === "positive").length },
      { sentiment: "Netral", count: media.filter((m) => m.sentiment === "neutral").length },
      { sentiment: "Negatif", count: media.filter((m) => m.sentiment === "negative").length },
    ],
    meetingStats: {
      total: meetings.length,
      completed: meetings.filter((m) => m.status === "completed").length,
      scheduled: meetings.filter((m) => m.status === "scheduled").length,
    },
    monthlyTrend: [
      { bulan: "Jan", memorandum: 8, rapat: 4, sla: 92 },
      { bulan: "Feb", memorandum: 12, rapat: 5, sla: 94 },
      { bulan: "Mar", memorandum: 15, rapat: 6, sla: 91 },
      { bulan: "Apr", memorandum: 11, rapat: 4, sla: 96 },
      { bulan: "Mei", memorandum: 18, rapat: 7, sla: 93 },
      { bulan: "Jun", memorandum: memos.length, rapat: meetings.length, sla: sla.length ? Math.round((sla.filter((s) => s.status === "on_track").length / sla.length) * 100) : 95 },
    ],
  };
}

export function createAgenda(data: typeof schema.agenda.$inferInsert) {
  const db = getDb();
  return db.insert(schema.agenda).values(data).returning().get();
}

export function createMemorandum(data: typeof schema.memorandum.$inferInsert) {
  const db = getDb();
  return db.insert(schema.memorandum).values(data).returning().get();
}

export function updateMemorandum(id: number, data: Partial<typeof schema.memorandum.$inferInsert>) {
  const db = getDb();
  return db.update(schema.memorandum).set(data).where(eq(schema.memorandum.id, id)).returning().get();
}

export async function generateAiSummary(id: number) {
  const db = getDb();
  const memo = getMemorandumById(id);
  if (!memo) return null;

  const knowledgeDocs = db.select().from(schema.knowledgeDocuments).all();
  const fileContent = memo.filePath
    ? await readMemorandumFileAsText(memo.filePath)
    : null;
  const analysis = buildAiAnalysis(
    memo,
    knowledgeDocs,
    fileContent ?? memo.content
  );

  return db
    .update(schema.memorandum)
    .set({
      aiSummary: analysis.aiSummary,
      aiRiskScore: analysis.aiRiskScore,
      aiComplianceScore: analysis.aiComplianceScore,
      aiConfidence: analysis.aiConfidence,
      smdDocumentId: analysis.smdDocumentId,
      regulatoryReferences: analysis.regulatoryReferences,
      status: "corpsec_review",
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function updateAiReview(
  id: number,
  data: {
    aiSummary: string;
    aiRiskScore?: number;
    aiComplianceScore?: number;
  }
) {
  const db = getDb();
  return db
    .update(schema.memorandum)
    .set({
      aiSummary: data.aiSummary,
      aiRiskScore: data.aiRiskScore,
      aiComplianceScore: data.aiComplianceScore,
      aiSummaryEdited: true,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function sendToPimpinanBidang(id: number) {
  const db = getDb();
  return db
    .update(schema.memorandum)
    .set({ status: "pimpinan_review", isRead: false, pimpinanDecision: null, rejectionComment: null })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

function notifyCorpsec(memorandumId: number, type: string, message: string) {
  const db = getDb();
  const corpsecUsers = db.select().from(schema.users).where(eq(schema.users.role, "corpsec")).all();
  for (const user of corpsecUsers) {
    db.insert(schema.notifications).values({
      userId: user.id,
      memorandumId,
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    }).run();
  }
}

export function approveWithSignature(
  id: number,
  signatureData: string,
  signedBy: string
) {
  const db = getDb();
  const memo = getMemorandumById(id);
  const result = db
    .update(schema.memorandum)
    .set({
      status: "returned_to_corpsec",
      pimpinanDecision: "approved",
      signatureData,
      signedBy,
      approvedAt: new Date().toISOString(),
      signedAt: new Date().toISOString(),
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  if (memo) {
    notifyCorpsec(
      id,
      "pimpinan_approved",
      `Pimpinan Bidang MENYETUJUI memorandum ${memo.number} — ${memo.title}. Silakan review dan teruskan ke Sekretaris Direksi.`
    );
  }
  return result;
}

export function rejectWithComment(id: number, comment: string) {
  const db = getDb();
  const memo = getMemorandumById(id);
  const result = db
    .update(schema.memorandum)
    .set({
      status: "returned_to_corpsec",
      pimpinanDecision: "rejected",
      rejectionComment: comment,
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  if (memo) {
    notifyCorpsec(
      id,
      "pimpinan_rejected",
      `Pimpinan Bidang MENOLAK memorandum ${memo.number} — ${memo.title}. Komentar: ${comment}`
    );
  }
  return result;
}

export function sendToSekdireksi(id: number) {
  const db = getDb();
  return db
    .update(schema.memorandum)
    .set({
      status: "sent_to_sekdireksi",
      sentToSekdireksiAt: new Date().toISOString(),
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function receiveBySekdireksi(id: number) {
  const db = getDb();
  return db
    .update(schema.memorandum)
    .set({
      status: "received_sekdireksi",
      receivedBySekdireksiAt: new Date().toISOString(),
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function authenticateUser(username: string, password: string) {
  const db = getDb();
  return db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.username, username), eq(schema.users.password, password)))
    .get();
}

export function getNotificationsForUser(userId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .all();
}

export function markNotificationRead(id: number) {
  const db = getDb();
  return db
    .update(schema.notifications)
    .set({ isRead: true })
    .where(eq(schema.notifications.id, id))
    .returning()
    .get();
}

export function getMemorandumByUserId(userId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(eq(schema.memorandum.submittedByUserId, userId))
    .orderBy(desc(schema.memorandum.createdAt))
    .all();
}

export function getSekdireksiMemorandum() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(
      inArray(schema.memorandum.status, ["sent_to_sekdireksi", "received_sekdireksi"])
    )
    .orderBy(desc(schema.memorandum.sentToSekdireksiAt))
    .all();
}

export function getReturnedToCorpsecMemos() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(eq(schema.memorandum.status, "returned_to_corpsec"))
    .orderBy(desc(schema.memorandum.approvedAt))
    .all();
}

export function getUsers() {
  const db = getDb();
  return db.select().from(schema.users).all();
}
