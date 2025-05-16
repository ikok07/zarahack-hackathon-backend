import { pgTable, text, doublePrecision, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profilesTable } from "./profiles.ts";

export const customerDiscountsTable = pgTable("customer_discounts", {
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
    name: text("name").notNull(),
    description: text("description"),
    discount_percentage: doublePrecision("discount_percentage"),
    discount_start: integer("discount_start"),
    discount_end: integer("discount_end"),
});

export const customerDiscountsSchema = createSelectSchema(
    customerDiscountsTable
);
export type CustomerDiscounts = z.infer<typeof customerDiscountsSchema>;

export const customerDiscountsInsertSchema = createInsertSchema(
    customerDiscountsTable
);
export type CustomerDiscountsInsert = z.infer<
    typeof customerDiscountsInsertSchema
>;
