ALTER TABLE `users` ADD `board_position` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `sent_to_sekkom_at` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `received_by_sekkom_at` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `route_type` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `target_member_ids` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `board_decision` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `disposition` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `return_to_pengusul_comment` text;
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `returned_to_pengusul_at` text;
--> statement-breakpoint
CREATE TABLE `memorandum_approvals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memorandum_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role` text NOT NULL,
	`stage` text NOT NULL,
	`decision` text,
	`comment` text,
	`disposition` text,
	`signature_data` text,
	`acted_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`memorandum_id`) REFERENCES `memorandum`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
