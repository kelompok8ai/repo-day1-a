import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
});

export const agenda = sqliteTable("agenda", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  status: text("status").notNull().default("scheduled"),
  priority: text("priority").notNull().default("normal"),
  preparationNotes: text("preparation_notes"),
  createdAt: text("created_at").notNull(),
});

export const memorandum = sqliteTable("memorandum", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  proposerDivisi: text("proposer_divisi").notNull(),
  status: text("status").notNull().default("uploaded"),
  urgency: text("urgency").notNull().default("normal"),
  fileName: text("file_name"),
  filePath: text("file_path"),
  fileMimeType: text("file_mime_type"),
  smdDocumentId: text("smd_document_id"),
  regulatoryReferences: text("regulatory_references"),
  aiSummary: text("ai_summary"),
  aiRiskScore: real("ai_risk_score"),
  aiComplianceScore: real("ai_compliance_score"),
  aiConfidence: real("ai_confidence"),
  aiSummaryEdited: integer("ai_summary_edited", { mode: "boolean" }).notNull().default(false),
  rejectionComment: text("rejection_comment"),
  signatureData: text("signature_data"),
  signedBy: text("signed_by"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  submittedAt: text("submitted_at"),
  approvedAt: text("approved_at"),
  signedAt: text("signed_at"),
  createdAt: text("created_at").notNull(),
});

export const mediaArticles = sqliteTable("media_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  source: text("source").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  sentiment: text("sentiment").notNull().default("neutral"),
  publishedAt: text("published_at").notNull(),
});

export const meetings = sqliteTable("meetings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  agenda: text("agenda"),
  minutes: text("minutes"),
  status: text("status").notNull().default("scheduled"),
  createdAt: text("created_at").notNull(),
});

export const meetingFollowups = sqliteTable("meeting_followups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  meetingId: integer("meeting_id")
    .notNull()
    .references(() => meetings.id),
  description: text("description").notNull(),
  assignee: text("assignee").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("open"),
});

export const knowledgeDocuments = sqliteTable("knowledge_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const regulatoryNotifications = sqliteTable("regulatory_notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  regulator: text("regulator").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull().default("info"),
  createdAt: text("created_at").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
});

export const slaRecords = sqliteTable("sla_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memorandumId: integer("memorandum_id")
    .notNull()
    .references(() => memorandum.id),
  targetHours: integer("target_hours").notNull(),
  actualHours: integer("actual_hours"),
  status: text("status").notNull().default("on_track"),
  createdAt: text("created_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type Agenda = typeof agenda.$inferSelect;
export type Memorandum = typeof memorandum.$inferSelect;
export type MediaArticle = typeof mediaArticles.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type MeetingFollowup = typeof meetingFollowups.$inferSelect;
export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;
export type RegulatoryNotification = typeof regulatoryNotifications.$inferSelect;
export type SlaRecord = typeof slaRecords.$inferSelect;
