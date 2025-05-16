import { doublePrecision, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ordersTable } from "./orders.ts";
import { productQuantityUnits, productsTable } from "./products.ts";

export const orderProductsTable = pgTable("order_products", {
    id: text("id")
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    order_id: text("order_id")
        .notNull()
        .references(() => ordersTable.id),
    product_id: text("product_id")
        .notNull()
        .references(() => productsTable.id),
    quantity: doublePrecision("quantity").notNull(),
    units: productQuantityUnits().notNull(),
});

export const orderProductsSchema = createSelectSchema(orderProductsTable);
export type OrderProducts = z.infer<typeof orderProductsSchema>;

export const orderProductsInsertSchema = createInsertSchema(orderProductsTable);
export type OrderProductsInsert = z.infer<typeof orderProductsInsertSchema>;
