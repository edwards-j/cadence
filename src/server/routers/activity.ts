import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { createActivity, updateActivity, deleteActivity } from "@/db/mutations";
import { ACTIVITY_TYPES } from "@/lib/activity-types";

export const activityRouter = router({
  create: publicProcedure
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

  update: publicProcedure
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

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => deleteActivity(input.id)),
});
