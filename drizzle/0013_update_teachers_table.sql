ALTER TABLE "teachers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "display_name" varchar(255);