CREATE TYPE "public"."session_status" AS ENUM('scheduled', 'cancelled', 'extra');--> statement-breakpoint
CREATE TABLE "class_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" "session_status" DEFAULT 'scheduled',
	"hall_name" varchar(50),
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP INDEX "attendance_records_student_id_class_id_date_index";--> statement-breakpoint
ALTER TABLE "attendance_records" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ALTER COLUMN "class_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attendance_records" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD COLUMN "session_id" uuid;--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_session_class_date" ON "class_sessions" USING btree ("class_id","date");--> statement-breakpoint
CREATE INDEX "idx_session_date" ON "class_sessions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_session_status" ON "class_sessions" USING btree ("status");--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_session_id_class_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."class_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_records_class_date_unique" ON "attendance_records" USING btree ("student_id","class_id","date");--> statement-breakpoint
CREATE INDEX "idx_session_attendance" ON "attendance_records" USING btree ("session_id");