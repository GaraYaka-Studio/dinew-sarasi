CREATE TYPE "public"."fee_type" AS ENUM('monthly', 'admission', 'exam', 'material');--> statement-breakpoint
CREATE TABLE "payment_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"payment_id" uuid,
	"type" "fee_type" NOT NULL,
	"class_id" uuid,
	"month_index" integer,
	"year" integer,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_items" ADD CONSTRAINT "payment_items_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_items" ADD CONSTRAINT "payment_items_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
COMMENT ON TABLE "payment_items" IS 'Triggers update student_fees table on insert';
