import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { auth } from "@/lib/auth";

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth.api.getSession({ headers: req.headers });
      return {
        user: session?.user ?? null,
        session: session?.session ?? null,
      };
    },
  });

export { handler as GET, handler as POST };
