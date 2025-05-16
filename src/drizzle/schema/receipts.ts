import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";
import { paymentMethodsTable } from "./payment_methods.ts";
import { ordersTable } from "./orders.ts";

export const receiptsTable = pgTable("receipts", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  payment_method_id: text("payment_method_id")
    .notNull()
    .references(() => paymentMethodsTable.id),
  order_id: text("order_id")
    .notNull()
    .references(() => ordersTable.id),
});

export const receiptsSchema = createSelectSchema(receiptsTable);
export type Receipts = z.infer<typeof receiptsSchema>;

export const receiptsInsertSchema = createInsertSchema(receiptsTable);
export type ReceiptsInsert = z.infer<typeof receiptsInsertSchema>;
