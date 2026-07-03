CREATE TABLE `agenda` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`location` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`preparation_notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `knowledge_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`source` text NOT NULL,
	`summary` text NOT NULL,
	`category` text NOT NULL,
	`sentiment` text DEFAULT 'neutral' NOT NULL,
	`published_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meeting_followups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meeting_id` integer NOT NULL,
	`description` text NOT NULL,
	`assignee` text NOT NULL,
	`due_date` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`location` text,
	`agenda` text,
	`minutes` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `memorandum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`proposer_divisi` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`urgency` text DEFAULT 'normal' NOT NULL,
	`ai_summary` text,
	`ai_risk_score` real,
	`ai_compliance_score` real,
	`ai_confidence` real,
	`submitted_at` text,
	`approved_at` text,
	`signed_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `regulatory_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`regulator` text NOT NULL,
	`description` text NOT NULL,
	`severity` text DEFAULT 'info' NOT NULL,
	`created_at` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sla_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memorandum_id` integer NOT NULL,
	`target_hours` integer NOT NULL,
	`actual_hours` integer,
	`status` text DEFAULT 'on_track' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`memorandum_id`) REFERENCES `memorandum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL
);
