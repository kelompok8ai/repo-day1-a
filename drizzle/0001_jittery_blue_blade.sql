PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_memorandum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`proposer_divisi` text NOT NULL,
	`status` text DEFAULT 'uploaded' NOT NULL,
	`urgency` text DEFAULT 'normal' NOT NULL,
	`file_name` text,
	`file_path` text,
	`file_mime_type` text,
	`smd_document_id` text,
	`regulatory_references` text,
	`ai_summary` text,
	`ai_risk_score` real,
	`ai_compliance_score` real,
	`ai_confidence` real,
	`ai_summary_edited` integer DEFAULT false NOT NULL,
	`rejection_comment` text,
	`signature_data` text,
	`signed_by` text,
	`is_read` integer DEFAULT false NOT NULL,
	`submitted_at` text,
	`approved_at` text,
	`signed_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_memorandum`("id", "number", "title", "content", "proposer_divisi", "status", "urgency", "ai_summary", "ai_risk_score", "ai_compliance_score", "ai_confidence", "submitted_at", "approved_at", "signed_at", "created_at") SELECT "id", "number", "title", "content", "proposer_divisi", "status", "urgency", "ai_summary", "ai_risk_score", "ai_compliance_score", "ai_confidence", "submitted_at", "approved_at", "signed_at", "created_at" FROM `memorandum`;--> statement-breakpoint
DROP TABLE `memorandum`;--> statement-breakpoint
ALTER TABLE `__new_memorandum` RENAME TO `memorandum`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
