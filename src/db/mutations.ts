import { and, eq, max, sql } from "drizzle-orm";
import { db } from "./index";
import { activities } from "./schema";
import type { ActivityType } from "@/lib/activity-types";
import { createId } from "@paralleldrive/cuid2";
import { trips, days } from "@/db/schema";

export type CreateActivityInput = {
  dayId: string;
  userId: string;
  name: string;
  type: ActivityType;
  durationHours: number;
  location?: string;
  startTime?: string;
  orderIndex?: number;
};

export type UpdateActivityInput = {
  id: string;
  userId: string;
  name?: string;
  type?: ActivityType;
  durationHours?: number;
  location?: string;
  startTime?: string;
  orderIndex?: number;
};

async function assertTripOwnership(tripId: string, userId: string) {
  const [row] = await db
    .select({ userId: trips.userId })
    .from(trips)
    .where(eq(trips.id, tripId));
  if (!row || row.userId !== userId) {
    throw new Error("Trip not found");
  }
}

async function assertDayOwnership(dayId: string, userId: string) {
  const [row] = await db
    .select({ userId: trips.userId })
    .from(days)
    .innerJoin(trips, eq(days.tripId, trips.id))
    .where(eq(days.id, dayId));
  if (!row || row.userId !== userId) {
    throw new Error("Day not found");
  }
}

async function assertActivityOwnership(activityId: string, userId: string) {
  const [row] = await db
    .select({ userId: trips.userId })
    .from(activities)
    .innerJoin(days, eq(activities.dayId, days.id))
    .innerJoin(trips, eq(days.tripId, trips.id))
    .where(eq(activities.id, activityId));
  if (!row || row.userId !== userId) {
    throw new Error("Activity not found");
  }
}

export async function createTrip(input: {
  name: string;
  startDate: Date;
  dayCount: number;
  userId: string;
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
      userId: input.userId,
    }),
    db.insert(days).values(dayRows),
  ]);

  return { id: tripId };
}

export async function deleteTrip(input: { id: string; userId: string }) {
  await db
    .delete(trips)
    .where(and(eq(trips.id, input.id), eq(trips.userId, input.userId)));
}

export async function createDay(input: {
  tripId: string;
  userId: string;
}): Promise<{ id: string }> {
  await assertTripOwnership(input.tripId, input.userId);

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

export async function deleteDay(input: { id: string; userId: string }) {
  const [target] = await db
    .select({ tripId: days.tripId })
    .from(days)
    .where(eq(days.id, input.id));

  if (!target) throw new Error("Day not found");

  await assertTripOwnership(target.tripId, input.userId);

  const allDays = await db
    .select({ id: days.id, dayNumber: days.dayNumber })
    .from(days)
    .where(eq(days.tripId, target.tripId))
    .orderBy(days.dayNumber);

  const remaining = allDays.filter((d) => d.id !== input.id);

  const updates = [];
  for (const [index, day] of remaining.entries()) {
    const newDayNumber = index + 1;
    if (newDayNumber !== day.dayNumber) {
      updates.push(
        db
          .update(days)
          .set({ dayNumber: newDayNumber })
          .where(eq(days.id, day.id)),
      );
    }
  }

  await db.batch([db.delete(days).where(eq(days.id, input.id)), ...updates]);
}

export async function createActivity(input: CreateActivityInput) {
  let { orderIndex } = input;

  await assertDayOwnership(input.dayId, input.userId);

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

  await assertActivityOwnership(input.id, input.userId);

  const [activity] = await db
    .update(activities)
    .set(rest)
    .where(eq(activities.id, id))
    .returning();

  return activity;
}

export async function deleteActivity(input: { id: string; userId: string }) {
  await assertActivityOwnership(input.id, input.userId);
  await db.delete(activities).where(eq(activities.id, input.id));
}
