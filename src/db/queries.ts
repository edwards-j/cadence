import { db } from "./index";

/**
 * Fetches the current trip with all nested days and activities.
 *
 * Days are ordered by dayNumber ascending. Activities are returned in
 * whatever order Drizzle returns them — we'll sort by orderIndex in the UI
 * for now, and revisit if we need server-side ordering.
 *
 * Returns undefined if no trips exist in the database.
 */
export async function getCurrentTrip() {
  return db.query.trips.findFirst({
    with: {
      days: {
        with: { activities: true },
        orderBy: (days, { asc }) => [asc(days.dayNumber)],
      },
    },
  });
}
