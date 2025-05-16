import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";

export const ordersTable = pgTable("orders", {
    id: text("id")
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    profile_id: text("profile_id")
        .notNull()
        .references(() => profilesTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    date: integer("date")
        .notNull()
        .default(sql`extract(epoch from now())`),
});

export const ordersSchema = createSelectSchema(ordersTable);
export type Orders = z.infer<typeof ordersSchema>;

export const ordersInsertSchema = createInsertSchema(ordersTable);
export type OrdersInsert = z.infer<typeof ordersInsertSchema>;
