CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"student_id" uuid,
	"class_id" uuid,
	"enrolled_at" date DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_enrollment" ON "enrollments" USING btree ("student_id","class_id");