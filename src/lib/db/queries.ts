import { eq, and, gte, lte, desc, count, sql } from "drizzle-orm";
import { getDb } from "./index";
import * as schema from "./schema";
import { getToday, getWeekRange } from "../utils";

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
    .where(eq(schema.memorandum.status, "pending_approval"))
    .orderBy(desc(schema.memorandum.submittedAt))
    .all();

  const highUrgencyMemos = db
    .select()
    .from(schema.memorandum)
    .where(
      and(
        eq(schema.memorandum.urgency, "high"),
        sql`${schema.memorandum.status} NOT IN ('approved', 'rejected', 'signed')`
      )
    )
    .all();

  const aiReviewMemos = db
    .select()
    .from(schema.memorandum)
    .where(eq(schema.memorandum.status, "ai_review"))
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
    pending: allMemos.filter((m) => m.status === "pending_approval").length,
    approved: allMemos.filter((m) => m.status === "approved").length,
    rejected: allMemos.filter((m) => m.status === "rejected").length,
    aiReview: allMemos.filter((m) => m.status === "ai_review").length,
    highUrgency: allMemos.filter((m) => m.urgency === "high").length,
  };

  const slaOnTrack = slaRecords.filter((s) => s.status === "on_track").length;
  const slaCompliance = slaRecords.length
    ? Math.round((slaOnTrack / slaRecords.length) * 100)
    : 100;

  const memoByStatus = [
    { name: "Menunggu", value: memoStats.pending, fill: "#f59e0b" },
    { name: "Review AI", value: memoStats.aiReview, fill: "#a855f7" },
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

export function getMemorandumById(id: number) {
  const db = getDb();
  return db.select().from(schema.memorandum).where(eq(schema.memorandum.id, id)).get();
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
      { status: "Draft", count: memos.filter((m) => m.status === "draft").length },
      { status: "Review AI", count: memos.filter((m) => m.status === "ai_review").length },
      { status: "Menunggu", count: memos.filter((m) => m.status === "pending_approval").length },
      { status: "Disetujui", count: memos.filter((m) => m.status === "approved").length },
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

export function updateMemorandumStatus(id: number, status: string) {
  const db = getDb();
  const updates: Partial<typeof schema.memorandum.$inferInsert> = { status };
  if (status === "approved") updates.approvedAt = new Date().toISOString();
  if (status === "signed") updates.signedAt = new Date().toISOString();
  return db.update(schema.memorandum).set(updates).where(eq(schema.memorandum.id, id)).returning().get();
}

export function generateAiSummary(id: number) {
  const db = getDb();
  const memo = getMemorandumById(id);
  if (!memo) return null;

  const summary = `Ringkasan AI: ${memo.title}. Divisi pengusul: ${memo.proposerDivisi}. Analisis menunjukkan memorandum ini memerlui review compliance terhadap regulasi OJK dan kebijakan internal Bank Sumut. Confidence score: 85%.`;
  const riskScore = Math.floor(Math.random() * 40) + 20;
  const complianceScore = Math.floor(Math.random() * 15) + 80;

  return db
    .update(schema.memorandum)
    .set({
      aiSummary: summary,
      aiRiskScore: riskScore,
      aiComplianceScore: complianceScore,
      aiConfidence: 85,
      status: "pending_approval",
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

export function getUsers() {
  const db = getDb();
  return db.select().from(schema.users).all();
}
