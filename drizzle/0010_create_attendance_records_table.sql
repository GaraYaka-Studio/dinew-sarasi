CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TABLE "attendance_records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"student_id" uuid,
	"class_id" uuid,
	"date" date DEFAULT now(),
	"scan_time" time DEFAULT now(),
	"status" "attendance_status" DEFAULT 'present',
	"marked_by" uuid,
	"sync_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_marked_by_profiles_id_fk" FOREIGN KEY ("marked_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_records_student_id_class_id_date_index" ON "attendance_records" USING btree ("student_id","class_id","date");--> statement-breakpoint
CREATE INDEX "idx_daily_attendance_report" ON "attendance_records" USING btree ("date","class_id");