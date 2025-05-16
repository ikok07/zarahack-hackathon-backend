import { doublePrecision, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { shopCategoriesTable } from "./shop_categories.ts";
import { citiesTable } from "./cities.ts";

export const shopsTable = pgTable("shops", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("latitude").notNull(),
  category_id: text("category_id")
    .notNull()
    .references(() => shopCategoriesTable.id),
  city_id: text("city_id")
    .notNull()
    .references(() => citiesTable.id),
});

export const shopsSchema = createSelectSchema(shopsTable);
export type Shops = z.infer<typeof shopsSchema>;

export const shopsInsertSchema = createInsertSchema(shopsTable);
export type ShopsInsert = z.infer<typeof shopsInsertSchema>;
