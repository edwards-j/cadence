import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createDay, createTrip } from "@/db/mutations";

export const tripRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        startDate: z.date(),
        dayCount: z.number().int().min(1).max(60),
      }),
    )
    .mutation(async ({ input }) => {
      return createTrip(input);
    }),
  createDay: protectedProcedure
    .input(
      z.object({
        tripId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return createDay(input);
    }),
});
