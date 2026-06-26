import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { trips, days } from "@/db/schema";
import { getCurrentTrip } from "@/db/queries";

export const tripRouter = router({
  getCurrent: publicProcedure.query(async () => {
    return getCurrentTrip();
  }),
});
