import { router } from "../trpc";
import { activityRouter } from "./activity";
import { tripRouter } from "./trip";

export const appRouter = router({
  trip: tripRouter,
  activity: activityRouter,
});

export type AppRouter = typeof appRouter;
