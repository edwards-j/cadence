import { sqliteTable, AnySQLiteColumn, foreignKey, text, real, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const activities = sqliteTable("activities", {
	id: text().primaryKey().notNull(),
	dayId: text("day_id").notNull().references(() => days.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	type: text().notNull(),
	durationHours: real("duration_hours").notNull(),
	location: text(),
	startTime: text("start_time"),
	orderIndex: integer("order_index").notNull(),
});

export const days = sqliteTable("days", {
	id: text().primaryKey().notNull(),
	tripId: text("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" } ),
	dayNumber: integer("day_number").notNull(),
	notes: text(),
});

export const trips = sqliteTable("trips", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	startDate: integer("start_date").notNull(),
	createdAt: integer("created_at").notNull(),
});

