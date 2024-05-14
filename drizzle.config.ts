import { defineConfig } from "drizzle-kit";

import { ENV } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  }
})