import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const countriesTable = pgTable("countries", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  code: text("code").notNull(),
});

export const countriesSchema = createSelectSchema(countriesTable);
export type Countries = z.infer<typeof countriesSchema>;

export const countriesInsertSchema = createInsertSchema(countriesTable);
export type CountriesInsert = z.infer<typeof countriesInsertSchema>;
