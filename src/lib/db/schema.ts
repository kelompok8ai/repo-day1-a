import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  divisi: text("divisi"),
  boardPosition: text("board_position"),
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
  memoDate: text("memo_date"),
  proposerDivisi: text("proposer_divisi").notNull(),
  submittedByUserId: integer("submitted_by_user_id").references(() => users.id),
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
  pimpinanDecision: text("pimpinan_decision"),
  signatureData: text("signature_data"),
  signedBy: text("signed_by"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  submittedAt: text("submitted_at"),
  approvedAt: text("approved_at"),
  signedAt: text("signed_at"),
  sentToSekdireksiAt: text("sent_to_sekdireksi_at"),
  receivedBySekdireksiAt: text("received_by_sekdireksi_at"),
  sentToSekkomAt: text("sent_to_sekkom_at"),
  receivedBySekkomAt: text("received_by_sekkom_at"),
  routeType: text("route_type"),
  targetMemberIds: text("target_member_ids"),
  boardDecision: text("board_decision"),
  disposition: text("disposition"),
  returnToPengusulComment: text("return_to_pengusul_comment"),
  returnedToPengusulAt: text("returned_to_pengusul_at"),
  createdAt: text("created_at").notNull(),
});

export const memorandumApprovals = sqliteTable("memorandum_approvals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memorandumId: integer("memorandum_id")
    .notNull()
    .references(() => memorandum.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(),
  stage: text("stage").notNull(),
  decision: text("decision"),
  comment: text("comment"),
  disposition: text("disposition"),
  signatureData: text("signature_data"),
  actedAt: text("acted_at"),
  createdAt: text("created_at").notNull(),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  memorandumId: integer("memorandum_id").references(() => memorandum.id),
  type: text("type").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
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
export type Notification = typeof notifications.$inferSelect;
export type Agenda = typeof agenda.$inferSelect;
export type Memorandum = typeof memorandum.$inferSelect;
export type MediaArticle = typeof mediaArticles.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type MeetingFollowup = typeof meetingFollowups.$inferSelect;
export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;
export type RegulatoryNotification = typeof regulatoryNotifications.$inferSelect;
export type SlaRecord = typeof slaRecords.$inferSelect;

export type MemorandumApproval = typeof memorandumApprovals.$inferSelect;
export type UserRole =
  | "pengusul"
  | "corpsec"
  | "pimpinan_bidang"
  | "sekdireksi"
  | "sekretaris_komisaris"
  | "direksi"
  | "komisaris";
