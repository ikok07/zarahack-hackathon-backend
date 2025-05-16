import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";

export const customerVisitsTable = pgTable("customer_visits", {
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
    date_enter: integer("date_enter").notNull(),
    date_exit: integer("date_exit").notNull(),
});

export const customerVisitsSchema = createSelectSchema(customerVisitsTable);
export type CustomerVisits = z.infer<typeof customerVisitsSchema>;

export const customerVisitsInsertSchema =
    createInsertSchema(customerVisitsTable);
export type CustomerVisitsInsert = z.infer<typeof customerVisitsInsertSchema>;
