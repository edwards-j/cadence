import { relations } from "drizzle-orm/relations";
import { days, activities, trips } from "./schema";

export const activitiesRelations = relations(activities, ({one}) => ({
	day: one(days, {
		fields: [activities.dayId],
		references: [days.id]
	}),
}));

export const daysRelations = relations(days, ({one, many}) => ({
	activities: many(activities),
	trip: one(trips, {
		fields: [days.tripId],
		references: [trips.id]
	}),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	days: many(days),
}));