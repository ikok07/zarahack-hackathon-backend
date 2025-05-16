import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productCategoriesTable } from "./product_categories.ts";

export const productCategoryDiscountsTable = pgTable(
  "product_category_discounts",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category_id: text("category_id")
      .notNull()
      .references(() => productCategoriesTable.id),
    discount_percentage: doublePrecision("discount_percentage").notNull(),
    discount_start: integer("discount_start").notNull(),
    discount_end: integer("discount_end").notNull(),
  }
);

export const productCategoryDiscountsSchema = createSelectSchema(
  productCategoryDiscountsTable
);
export type ProductCategoryDiscounts = z.infer<
  typeof productCategoryDiscountsSchema
>;

export const productCategoryDiscountsInsertSchema = createInsertSchema(
  productCategoryDiscountsTable
);
export type ProductCategoryDiscountsInsert = z.infer<
  typeof productCategoryDiscountsInsertSchema
>;
