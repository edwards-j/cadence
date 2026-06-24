import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { config } from "dotenv";
config({ path: ".env.local" });

console.log(
  "👾🫣👾 ~ process.env.TURSO_DATABASE_URL:",
  process.env.TURSO_DATABASE_URL,
);
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
