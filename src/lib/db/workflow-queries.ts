import { and, desc, eq, inArray } from "drizzle-orm";
import * as schema from "./schema";
import { getDb } from "./index";
import { getMemorandumById } from "./queries";
import { parseTargetIds, stringifyTargetIds, type RouteType } from "../workflow";

function now() {
  return new Date().toISOString();
}

function notifyRole(role: string, memorandumId: number, type: string, message: string) {
  const db = getDb();
  const users = db.select().from(schema.users).where(eq(schema.users.role, role)).all();
  for (const user of users) {
    db.insert(schema.notifications)
      .values({
        userId: user.id,
        memorandumId,
        type,
        message,
        isRead: false,
        createdAt: now(),
      })
      .run();
  }
}

function notifyUser(userId: number, memorandumId: number, type: string, message: string) {
  const db = getDb();
  db.insert(schema.notifications)
    .values({
      userId,
      memorandumId,
      type,
      message,
      isRead: false,
      createdAt: now(),
    })
    .run();
}

function notifyCorpsec(memorandumId: number, type: string, message: string) {
  notifyRole("corpsec", memorandumId, type, message);
}

export function getApprovalsForMemo(memorandumId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandumApprovals)
    .where(eq(schema.memorandumApprovals.memorandumId, memorandumId))
    .orderBy(desc(schema.memorandumApprovals.createdAt))
    .all();
}

export function getBoardMembers(routeType: RouteType) {
  const db = getDb();
  const role = routeType === "direksi" ? "direksi" : "komisaris";
  return db.select().from(schema.users).where(eq(schema.users.role, role)).all();
}

export function getUsersByRole(role: string) {
  const db = getDb();
  return db.select().from(schema.users).where(eq(schema.users.role, role)).all();
}

export function getUserById(id: number) {
  const db = getDb();
  return db.select().from(schema.users).where(eq(schema.users.id, id)).get();
}

/** CorpSec: return memo to pengusul with comment */
export function returnToPengusul(id: number, comment: string) {
  const db = getDb();
  const memo = getMemorandumById(id);
  const result = db
    .update(schema.memorandum)
    .set({
      status: "returned_to_pengusul",
      returnToPengusulComment: comment,
      returnedToPengusulAt: now(),
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  if (memo?.submittedByUserId) {
    notifyUser(
      memo.submittedByUserId,
      id,
      "returned_to_pengusul",
      `Memorandum ${memo.number} dikembalikan CorpSec: ${comment}`
    );
  }
  return result;
}

/** CorpSec: finalize and notify pengusul after board decision */
export function finalizeToPengusul(id: number, comment: string, approved: boolean) {
  const db = getDb();
  const memo = getMemorandumById(id);
  const result = db
    .update(schema.memorandum)
    .set({
      status: approved ? "completed" : "returned_to_pengusul",
      boardDecision: approved ? "approved" : "rejected",
      returnToPengusulComment: comment,
      returnedToPengusulAt: now(),
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  if (memo?.submittedByUserId) {
    notifyUser(
      memo.submittedByUserId,
      id,
      approved ? "completed" : "returned_to_pengusul",
      approved
        ? `Memorandum ${memo.number} DISETUJUI Direksi/Komisaris. ${comment}`
        : `Memorandum ${memo.number} DITOLAK. ${comment}`
    );
  }
  return result;
}

/** Pimpinan/CorpSec: send to sekdireksi or sekkom */
export function sendToSecretariat(
  id: number,
  routeType: RouteType,
  actorRole: "pimpinan_bidang" | "corpsec"
) {
  const db = getDb();
  const status = routeType === "direksi" ? "sent_to_sekdireksi" : "sent_to_sekkom";
  const patch =
    routeType === "direksi"
      ? { sentToSekdireksiAt: now() }
      : { sentToSekkomAt: now() };

  const result = db
    .update(schema.memorandum)
    .set({
      status,
      routeType,
      targetMemberIds: null,
      isRead: false,
      ...patch,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  const memo = getMemorandumById(id);
  if (memo) {
    const targetRole = routeType === "direksi" ? "sekdireksi" : "sekretaris_komisaris";
    notifyRole(
      targetRole,
      id,
      "incoming_memo",
      `Memorandum ${memo.number} dari ${actorRole === "pimpinan_bidang" ? "Pimpinan Bidang" : "CorpSec"}`
    );
  }
  return result;
}

export function receiveBySecretariat(id: number, routeType: RouteType) {
  const db = getDb();
  const status = routeType === "direksi" ? "received_sekdireksi" : "received_sekkom";
  const patch =
    routeType === "direksi"
      ? { receivedBySekdireksiAt: now() }
      : { receivedBySekkomAt: now() };

  return db
    .update(schema.memorandum)
    .set({ status, ...patch })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

/** Sekretariat: assign target board members and forward */
export function forwardToBoard(id: number, targetUserIds: number[], routeType: RouteType) {
  const db = getDb();
  const memo = getMemorandumById(id);
  if (!memo) return null;

  for (const userId of targetUserIds) {
    const user = getUserById(userId);
    if (!user) continue;
    db.insert(schema.memorandumApprovals)
      .values({
        memorandumId: id,
        userId,
        role: user.role,
        stage: "board_review",
        decision: "pending",
        createdAt: now(),
      })
      .run();
    notifyUser(
      userId,
      id,
      "board_review",
      `Memorandum ${memo.number} menunggu keputusan Anda`
    );
  }

  return db
    .update(schema.memorandum)
    .set({
      status: "board_review",
      routeType,
      targetMemberIds: stringifyTargetIds(targetUserIds),
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();
}

/** Board member: approve with signature or reject with disposition */
export function boardMemberDecision(
  memorandumId: number,
  userId: number,
  data: {
    decision: "approved" | "rejected";
    comment?: string;
    disposition?: string;
    signatureData?: string;
  }
) {
  const db = getDb();
  const memo = getMemorandumById(memorandumId);
  if (!memo) return null;

  db.update(schema.memorandumApprovals)
    .set({
      decision: data.decision,
      comment: data.comment ?? null,
      disposition: data.disposition ?? null,
      signatureData: data.signatureData ?? null,
      actedAt: now(),
    })
    .where(
      and(
        eq(schema.memorandumApprovals.memorandumId, memorandumId),
        eq(schema.memorandumApprovals.userId, userId),
        eq(schema.memorandumApprovals.stage, "board_review")
      )
    )
    .run();

  const targets = parseTargetIds(memo.targetMemberIds);
  const approvals = db
    .select()
    .from(schema.memorandumApprovals)
    .where(
      and(
        eq(schema.memorandumApprovals.memorandumId, memorandumId),
        eq(schema.memorandumApprovals.stage, "board_review")
      )
    )
    .all();

  const relevant = targets.length
    ? approvals.filter((a) => targets.includes(a.userId))
    : approvals;

  const allActed = relevant.length > 0 && relevant.every((a) => a.decision && a.decision !== "pending");
  if (!allActed) return getMemorandumById(memorandumId);

  const anyRejected = relevant.some((a) => a.decision === "rejected");
  const boardDecision = anyRejected ? "rejected" : "approved";

  const result = db
    .update(schema.memorandum)
    .set({
      status: "returned_to_corpsec_board",
      boardDecision,
      isRead: false,
    })
    .where(eq(schema.memorandum.id, memorandumId))
    .returning()
    .get();

  notifyCorpsec(
    memorandumId,
    "board_decision",
    `Keputusan board untuk ${memo.number}: ${boardDecision === "approved" ? "DISETUJUI" : "DITOLAK"}`
  );

  const sekRole = memo.routeType === "komisaris" ? "sekretaris_komisaris" : "sekdireksi";
  notifyRole(
    sekRole,
    memorandumId,
    "board_decision",
    `Memorandum ${memo.number} — keputusan board: ${boardDecision}`
  );

  return result;
}

/** Sekretariat returns board result to corpsec with optional comment */
export function sekReturnToCorpsec(id: number, comment: string, routeType: RouteType) {
  const db = getDb();
  const memo = getMemorandumById(id);
  const result = db
    .update(schema.memorandum)
    .set({
      status: "returned_to_corpsec_board",
      rejectionComment: comment,
      isRead: false,
    })
    .where(eq(schema.memorandum.id, id))
    .returning()
    .get();

  if (memo) {
    notifyCorpsec(
      id,
      "sek_return",
      `Sekretaris ${routeType === "direksi" ? "Direksi" : "Komisaris"} mengembalikan ${memo.number}: ${comment}`
    );
  }
  return result;
}

export function getPimpinanMemorandum() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(inArray(schema.memorandum.status, ["pimpinan_review", "pending_approval"]))
    .orderBy(desc(schema.memorandum.submittedAt))
    .all();
}

export function getSekdireksiMemorandum() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(
      inArray(schema.memorandum.status, [
        "sent_to_sekdireksi",
        "received_sekdireksi",
        "board_review",
        "returned_to_corpsec_board",
      ])
    )
    .orderBy(desc(schema.memorandum.sentToSekdireksiAt))
    .all();
}

export function getSekkomMemorandum() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(
      inArray(schema.memorandum.status, [
        "sent_to_sekkom",
        "received_sekkom",
        "board_review",
        "returned_to_corpsec_board",
      ])
    )
    .orderBy(desc(schema.memorandum.sentToSekkomAt))
    .all();
}

export function getBoardMemorandumForUser(userId: number) {
  const db = getDb();
  const approvals = db
    .select()
    .from(schema.memorandumApprovals)
    .where(
      and(
        eq(schema.memorandumApprovals.userId, userId),
        eq(schema.memorandumApprovals.stage, "board_review")
      )
    )
    .all();

  const pendingIds = approvals
    .filter((a) => !a.decision || a.decision === "pending")
    .map((a) => a.memorandumId);

  if (!pendingIds.length) return [];

  return db
    .select()
    .from(schema.memorandum)
    .where(inArray(schema.memorandum.id, pendingIds))
    .orderBy(desc(schema.memorandum.createdAt))
    .all();
}

export function getCorpsecBoardReturnMemos() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(eq(schema.memorandum.status, "returned_to_corpsec_board"))
    .orderBy(desc(schema.memorandum.createdAt))
    .all();
}

export function getPengusulReturnedMemos(userId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(
      and(
        eq(schema.memorandum.submittedByUserId, userId),
        inArray(schema.memorandum.status, ["returned_to_pengusul", "completed", "rejected"])
      )
    )
    .orderBy(desc(schema.memorandum.returnedToPengusulAt))
    .all();
}

export function getCorpsecIncomingMemos() {
  const db = getDb();
  return db
    .select()
    .from(schema.memorandum)
    .where(
      inArray(schema.memorandum.status, [
        "uploaded",
        "ai_review",
        "corpsec_review",
        "returned_to_corpsec",
        "returned_to_corpsec_board",
      ])
    )
    .orderBy(desc(schema.memorandum.createdAt))
    .all();
}
