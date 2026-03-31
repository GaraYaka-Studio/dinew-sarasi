CREATE TYPE "public"."admission_status" AS ENUM('pending', 'paid', 'free');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."student_status" AS ENUM('active', 'inactive', 'graduated', 'suspended');--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"full_name" text NOT NULL,
	"initials" varchar(20),
	"dob" date,
	"gender" "gender" NOT NULL,
	"address" text,
	"phone" varchar(20) NOT NULL,
	"school" varchar(150),
	"guardian_name" text,
	"guardian_phone" text,
	"guardian_relationship" varchar(50),
	"is_emergency_contact" boolean,
	"batch_year" integer,
	"current_grade" varchar(20),
	"status" "student_status" DEFAULT 'active',
	"admission_status" "admission_status" DEFAULT 'pending',
	"admission_fee" numeric(10, 2),
	"qr_code" text,
	"photo_url" text,
	"sync_id" uuid,
	"deleted_at" timestamp,
	"last_modified_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "idx_students_qr" ON "students" USING btree ("qr_code");--> statement-breakpoint
CREATE INDEX "idx_students_phone" ON "students" USING btree ("phone");--> statement-breakpoint
COMMENT ON COLUMN "students"."qr_code" IS 'Indexed for Fast Scan';--> statement-breakpoint
COMMENT ON COLUMN "students"."deleted_at" IS 'Soft Delete';
