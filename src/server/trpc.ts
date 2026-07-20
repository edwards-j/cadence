import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { auth } from "@/lib/auth";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type Context = {
  user: NonNullable<Session>["user"] | null;
  session: NonNullable<Session>["session"] | null;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session!,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(requireAuth);
