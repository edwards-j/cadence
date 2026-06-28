import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { ACTIVITY_TYPES } from "@/lib/activity-types";

export const trips = sqliteTable("trips", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const days = sqliteTable("days", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  notes: text("notes"),
});

export const activities = sqliteTable("activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  dayId: text("day_id")
    .notNull()
    .references(() => days.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", {
    enum: ACTIVITY_TYPES,
  }).notNull(),
  durationHours: real("duration_hours").notNull(),
  location: text("location"),
  startTime: text("start_time"),
  orderIndex: integer("order_index").notNull(),
});

export const tripRelations = relations(trips, ({ many }) => ({
  days: many(days),
}));

export const daysRelations = relations(days, ({ one, many }) => ({
  trip: one(trips, { fields: [days.tripId], references: [trips.id] }),
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  day: one(days, { fields: [activities.dayId], references: [days.id] }),
}));
