import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";

export const profileBalancesTable = pgTable("profile_balances", {
    id: text("id")
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    profile_id: text("profile_id")
        .notNull()
        .references(() => profilesTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .unique(),
    amount_bgn: integer("amount_bgn").notNull(),
    amount_credits: integer("amount_credits").notNull(),
});

export const profileBalancesSchema = createSelectSchema(profileBalancesTable);
export type ProfileBalances = z.infer<typeof profileBalancesSchema>;

export const profileBalancesInsertSchema =
    createInsertSchema(profileBalancesTable);
export type ProfileBalancesInsert = z.infer<typeof profileBalancesInsertSchema>;
