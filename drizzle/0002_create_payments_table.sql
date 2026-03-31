CREATE TYPE "public"."payment_method" AS ENUM('cash', 'card', 'bank_transfer');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"receipt_number" serial NOT NULL,
	"student_id" uuid,
	"total_amount" numeric(12, 2) NOT NULL,
	"method" "payment_method" DEFAULT 'cash',
	"recorded_by" uuid,
	"payment_date" timestamp DEFAULT now(),
	"sync_id" uuid,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_profiles_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
COMMENT ON COLUMN "payments"."deleted_at" IS 'Soft Delete (Void receipts)';
