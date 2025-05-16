import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const shopCategoriesTable = pgTable("shop_categories", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: text("label"),
});

export const shopCategoriesSchema = createSelectSchema(shopCategoriesTable);
export type ShopCategories = z.infer<typeof shopCategoriesSchema>;

export const shopCategoriesInsertSchema =
  createInsertSchema(shopCategoriesTable);
export type ShopCategoriesInsert = z.infer<typeof shopCategoriesInsertSchema>;
