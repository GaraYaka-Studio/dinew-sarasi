import { date, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const students = pgTable("student", {
    id: integer().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    grade: integer().notNull(),
    admissionDate: date().notNull(),
});
