CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`memorandum_id` integer,
	`type` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`memorandum_id`) REFERENCES `memorandum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `memorandum` ADD `memo_date` text;--> statement-breakpoint
ALTER TABLE `memorandum` ADD `submitted_by_user_id` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `memorandum` ADD `pimpinan_decision` text;--> statement-breakpoint
ALTER TABLE `memorandum` ADD `sent_to_sekdireksi_at` text;--> statement-breakpoint
ALTER TABLE `memorandum` ADD `received_by_sekdireksi_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text;--> statement-breakpoint
ALTER TABLE `users` ADD `divisi` text;
