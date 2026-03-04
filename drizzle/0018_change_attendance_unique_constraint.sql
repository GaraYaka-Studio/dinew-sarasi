-- Drop the old unique index on (student_id, class_id, date)
DROP INDEX IF EXISTS "attendance_records_student_id_class_id_date_index";

-- Create new unique index on (student_id, session_id, date)
-- This allows multiple attendance records per class per day (one per session)
CREATE UNIQUE INDEX "attendance_records_student_id_session_id_date_index" ON "attendance_records" USING btree ("student_id", "session_id", "date");
