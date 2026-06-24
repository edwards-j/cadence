import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { trips, days } from "@/db/schema";

export const tripRouter = router({
  getCurrent: publicProcedure.query(async () => {
    return db.query.trips.findFirst({
      with: {
        days: {
          with: { activities: true },
          orderBy: (days, { asc }) => [asc(days.dayNumber)],
        },
      },
    });
  }),
});
