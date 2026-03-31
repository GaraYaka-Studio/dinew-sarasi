CREATE TABLE "sms_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_phone" varchar(20),
	"message" text,
	"status" varchar(20),
	"sent_at" timestamp DEFAULT now()
);
