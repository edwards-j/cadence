import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createActivity, updateActivity, deleteActivity } from "@/db/mutations";
import { ACTIVITY_TYPES } from "@/lib/activity-types";

export const activityRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        dayId: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(ACTIVITY_TYPES),
        durationHours: z.number().positive(),
        location: z.string().optional(),
        startTime: z.string().optional(),
        orderIndex: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(({ input }) => createActivity(input)),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        type: z.enum(ACTIVITY_TYPES).optional(),
        durationHours: z.number().positive().optional(),
        location: z.string().optional(),
        startTime: z.string().optional(),
        orderIndex: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(({ input }) => updateActivity(input)),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => deleteActivity(input.id)),
});
