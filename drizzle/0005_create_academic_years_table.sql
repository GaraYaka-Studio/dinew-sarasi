CREATE TABLE "academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT false,
	"start_date" date,
	"end_date" date
);
