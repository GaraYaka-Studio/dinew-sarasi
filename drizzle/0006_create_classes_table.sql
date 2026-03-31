CREATE TYPE "public"."class_medium" AS ENUM('sinhala', 'english', 'tamil');--> statement-breakpoint
CREATE TYPE "public"."class_type" AS ENUM('theory', 'revision', 'paper');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"grade" varchar(20) NOT NULL,
	"medium" "class_medium" DEFAULT 'sinhala',
	"type" "class_type" DEFAULT 'theory',
	"subject_id" uuid,
	"teacher_id" uuid,
	"academic_year_id" integer,
	"day" "day_of_week",
	"start_time" time,
	"end_time" time,
	"hall_name" varchar(50),
	"monthly_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
COMMENT ON TABLE "classes" IS 'Constraint: end_time > start_time AND monthly_fee >= 0';--> statement-breakpoint
COMMENT ON COLUMN "classes"."deleted_at" IS 'Soft Delete';
