import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
    id: integer().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    grade: integer().notNull(),
    admissionDate: date().notNull(),
});
