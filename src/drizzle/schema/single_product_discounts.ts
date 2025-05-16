import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productsTable } from "./products.ts";

export const singleProductDiscountsTable = pgTable("single_product_discounts", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("text").notNull(),
  description: text("description").notNull(),
  product_id: text("product_id")
    .notNull()
    .references(() => productsTable.id),
  discount_percentage: doublePrecision("discount_percentage").notNull(),
  discount_start: integer("discount_start").notNull(),
  discount_end: integer("discount_end").notNull(),
});

export const singleProductDiscountsSchema = createSelectSchema(
  singleProductDiscountsTable
);
export type SingleProductDiscounts = z.infer<
  typeof singleProductDiscountsSchema
>;

export const singleProductDiscountsInsertSchema = createInsertSchema(
  singleProductDiscountsTable
);
export type SingleProductDiscountsInsert = z.infer<
  typeof singleProductDiscountsInsertSchema
>;
