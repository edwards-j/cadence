-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`duration_hours` real NOT NULL,
	`location` text,
	`start_time` text,
	`order_index` integer NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `days` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`day_number` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` integer NOT NULL,
	`created_at` integer NOT NULL
);

*/