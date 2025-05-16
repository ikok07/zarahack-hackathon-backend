import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const productCategoriesTable = pgTable("product_categories", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
});

export const productCategoriesSchema = createSelectSchema(
  productCategoriesTable
);
export type ProductCategories = z.infer<typeof productCategoriesSchema>;

export const productCategoriesInsertSchema = createInsertSchema(
  productCategoriesTable
);
export type ProductCategoriesInsert = z.infer<
  typeof productCategoriesInsertSchema
>;
