CREATE TYPE "public"."payment_status" AS ENUM('paid', 'pending', 'partial', 'overdue', 'free');--> statement-breakpoint
CREATE TABLE "student_fees" (
	"id" uuid PRIMARY KEY NOT NULL,
	"student_id" uuid,
	"class_id" uuid,
	"year" integer NOT NULL,
	"month_index" integer NOT NULL,
	"fee_amount" numeric(10, 2) NOT NULL,
	"paid_amount" numeric(10, 2) DEFAULT '0',
	"status" "payment_status" DEFAULT 'pending',
	"due_date" date,
	"sync_id" uuid,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_fees_student_id_class_id_year_month_index_index" ON "student_fees" USING btree ("student_id","class_id","year","month_index");--> statement-breakpoint
CREATE INDEX "idx_fee_status_lookup" ON "student_fees" USING btree ("class_id","year","month_index","status");--> statement-breakpoint
COMMENT ON TABLE "student_fees" IS 'Auto-updated via Triggers when Payment is made';
