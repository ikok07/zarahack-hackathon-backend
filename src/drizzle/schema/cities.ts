import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { countriesTable } from "./countries.ts";

export const citiesTable = pgTable("cities", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  country_id: text("country_id")
    .notNull()
    .references(() => countriesTable.id),
});

export const citiesSchema = createSelectSchema(citiesTable);
export type Cities = z.infer<typeof citiesSchema>;

export const citiesInsertSchema = createInsertSchema(citiesTable);
export type CitiesInsert = z.infer<typeof citiesInsertSchema>;
