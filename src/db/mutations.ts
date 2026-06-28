import { eq, max, sql } from "drizzle-orm";
import { db } from "./index";
import { activities } from "./schema";
import type { ActivityType } from "@/lib/activity-types";
import { createId } from "@paralleldrive/cuid2";
import { trips, days } from "@/db/schema";

export type CreateActivityInput = {
  dayId: string;
  name: string;
  type: ActivityType;
  durationHours: number;
  location?: string;
  startTime?: string;
  orderIndex?: number;
};

export type UpdateActivityInput = {
  id: string;
  name?: string;
  type?: ActivityType;
  durationHours?: number;
  location?: string;
  startTime?: string;
  orderIndex?: number;
};
export async function createTrip(input: {
  name: string;
  startDate: Date;
  dayCount: number;
}): Promise<{ id: string }> {
  const tripId = createId();

  const dayRows = Array.from({ length: input.dayCount }, (_, i) => ({
    id: createId(),
    tripId,
    dayNumber: i + 1,
  }));

  await db.batch([
    db.insert(trips).values({
      id: tripId,
      name: input.name,
      startDate: input.startDate,
    }),
    db.insert(days).values(dayRows),
  ]);

  return { id: tripId };
}

export async function createDay(input: {
  tripId: string;
}): Promise<{ id: string }> {
  const dayId = createId();

  await db.run(sql`
    INSERT INTO days (id, trip_id, day_number)
    VALUES (
      ${dayId},
      ${input.tripId},
      COALESCE((SELECT MAX(day_number) FROM days WHERE trip_id = ${input.tripId}), 0) + 1
    )
  `);

  return { id: dayId };
}

export async function createActivity(input: CreateActivityInput) {
  let { orderIndex } = input;

  if (orderIndex === undefined) {
    const [result] = await db
      .select({ maxOrder: max(activities.orderIndex) })
      .from(activities)
      .where(eq(activities.dayId, input.dayId));

    orderIndex = (result?.maxOrder ?? -1) + 1;
  }

  const [activity] = await db
    .insert(activities)
    .values({ ...input, orderIndex })
    .returning();
  return activity;
}

export async function updateActivity(input: UpdateActivityInput) {
  const { id, ...rest } = input;

  const [activity] = await db
    .update(activities)
    .set(rest)
    .where(eq(activities.id, id))
    .returning();

  return activity;
}

export async function deleteActivity(id: string) {
  await db.delete(activities).where(eq(activities.id, id));
}
