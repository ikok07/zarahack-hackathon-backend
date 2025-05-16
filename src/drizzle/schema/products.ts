import { doublePrecision, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { shopsTable } from "./shops.ts";
import { productCategoriesTable } from "./product_categories.ts";

export const productQuantityUnits = pgEnum("product_quantity_units", [
  "pieces",
  "grams",
  "kg",
]);

export const productsTable = pgTable("products", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  image_url: text("image_url").notNull(),
  name: text("name").notNull(),
  descriotion: text("description").notNull(),
  price_bgn: doublePrecision("price_bgn").notNull(),
  price_credits: doublePrecision("price_credits"),
  quantity: doublePrecision("quantity").notNull(),
  shop_id: text("shop_id")
    .notNull()
    .references(() => shopsTable.id),
  category_id: text("category_id")
    .notNull()
    .references(() => productCategoriesTable.id),
});

export const productsSchema = createSelectSchema(productsTable);
export type Products = z.infer<typeof productsSchema>;

export const productsInsertSchema = createInsertSchema(productsTable);
export type ProductsInsert = z.infer<typeof productsInsertSchema>;
