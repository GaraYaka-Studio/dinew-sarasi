CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20) NOT NULL,
	"category" varchar(50),
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_code_index" ON "subjects" USING btree ("code") WHERE "subjects"."is_active" = true;--> statement-breakpoint
COMMENT ON COLUMN "subjects"."deleted_at" IS 'Soft Delete';
