import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";

export const loyaltyCardsTable = pgTable("loyalty_cards", {
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
    expiry_date: integer("expiry_date").notNull(),
});

export const loyaltyCardsSchema = createSelectSchema(loyaltyCardsTable);
export type LoyaltyCards = z.infer<typeof loyaltyCardsSchema>;

export const loyaltyCardsInsertSchema = createInsertSchema(loyaltyCardsTable);
export type LoyaltyCardsInsert = z.infer<typeof loyaltyCardsInsertSchema>;
