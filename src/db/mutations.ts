import { eq, max } from "drizzle-orm";
import { db } from "./index";
import { activities } from "./schema";
import type { ActivityType } from "@/lib/activity-types";

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
