CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"nic" varchar(20),
	"phone" varchar(20),
	"subjects" text[],
	"total_earned" numeric(12, 2) DEFAULT '0',
	"amount_paid" numeric(12, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'active',
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "teachers_nic_unique" UNIQUE("nic")
);
--> statement-breakpoint
COMMENT ON COLUMN "teachers"."deleted_at" IS 'Soft Delete';
