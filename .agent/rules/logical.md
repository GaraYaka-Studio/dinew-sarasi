---
trigger: always_on
---

1 Offline & PWA Strategy (Critical)

Write Strategy: When a user saves data (Attendance/Payment), write to LocalDB (Dexie.js) first.

Sync Strategy: A background hook checks for internet connection.

If Online: Push LocalDB data to Supabase.

If Offline: Keep in LocalDB and show "⚠️ Unsynced Data" badge.

Read Strategy: Fetch from Supabase and cache in LocalDB for offline viewing.

2 Conflict Resolution: "Last-Write-Wins"

If Device A (Offline) edits a student, and Device B (Online) edits the same student, the system will accept the latest timestamped change when Device A reconnects.

UUIDs: Use crypto.randomUUID() for generating IDs for Payments/Attendance on the client-side to prevent ID collisions during sync.

3 Payment & Admission Logic

Admission Fee: One-time fee during registration only.

Monthly Fee: Recurrent.

Alerts (Non-Blocking):

If Current Date > 3rd Week AND Payment Status == Unpaid: Show Orange Alert.

If Arrears > 0: Show Red Alert.

Crucial: Do not block the attendance marking process. Allow manual override.

4 Rapid Scan Mode

Input: Must accept input from (1) Camera QR, (2) Handheld Barcode Scanner (Keyboard input), (3) Manual Typing.

Workflow: Scan -> Auto-Submit "Present" -> Show Success Toast -> Auto-Reset for next student. (Zero clicks required for normal flow).