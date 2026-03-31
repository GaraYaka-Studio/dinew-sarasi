CREATE TABLE "teacher_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"date" date DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "teacher_payments" ADD CONSTRAINT "teacher_payments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;