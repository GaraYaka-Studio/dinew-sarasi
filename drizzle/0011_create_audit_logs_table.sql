CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;