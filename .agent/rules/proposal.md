---
trigger: always_on
---

Project Proposal 
Institute Class Management System (ICMS) 
Prepared For: Sarasi Higher Education Institute 
Date: January 18, 2026 
Version: 1.0 
1. Executive Summary 
The objective of this project is to develop a comprehensive, modern Class Management 
System (ICMS) designed to streamline the daily operations of 
Sarasi Institute Moving away from manual processes, this system will digitize student 
registration, attendance tracking, payment collection, and reporting. 
The proposed solution is a Progressive Web Application (PWA), ensuring operation stability 
even during internet outages. It features a "Rapid Scan" workflow designed for high-traffic 
environments, automated communication via SMS, and robust data security with cloud 
backups. The system is designed to be future-proof, accommodating grade transitions and 
multi-device syncing. 
2. Project Objectives 
1. Eliminate Manual Errors: Automate fee calculation, arrears tracking, and exam year 
calculations. 
2. Speed Up Operations: Reduce student queue times using QR-based Rapid Attendance 
marking. 
3. Ensure Business Continuity: Provide a robust Offline-First architecture that works 
without an active internet connection. 
4. Enhance Communication: Automate SMS notifications for admissions and payments. 
5. Secure Data Management: Implement role-based access control and automated daily 
cloud backups. 
3. Scope of Work & Functional Requirements 
3.1. Student Management & Lifecycle 
● Registration: Comprehensive profile creation capturing personal details, school, and 
parent contact information. 
● Academic Structure: Support for Grades 1–13 as well as Non-Graded (General) classes. 
● Auto-Calculations: System automatically calculates O/L and A/L years based on the 
student's current grade. 
● One-Time Admission: 
○ Collection of a one-time Admission Fee upon registration. 
○ Welcome SMS: Automated message sent to parents upon admission payment 
confirmation. 
● New Academic Year Setup: Dedicated module to initialize the new academic year, 
specifically for setting up the incoming new batch (e.g., new Grade 1 intake) and resetting 
class configurations for the new term. 
● Year-End Promotion: A bulk action feature to promote students to the next grade (e.g., 
Grade 6 to 7) and archive past students (Alumni) at the end of the academic year. 
3.2. Identity Management (ID Cards) 
● Temporary Slip: Generation of a thermal-print friendly temporary slip (Name + QR) for 
immediate use upon registration. 
● Permanent ID Card: System-generated layout for professional PVC card printing, 
including: 
○ Student Photo, Name, and ID. 
○ Institute Branding. 
○ Batch Year (O/L or A/L). 
○ Scannable QR Code. 
3.3. Smart Attendance System 
● Dynamic Calendar: Dashboard displays "Today's Classes" based on the schedule, 
preventing attendance marking errors. 
● Rapid Scan Mode (Hybrid): A high-speed interface designed for peak hours. 
○ Scan: Instantly marks attendance upon QR scan. 
○ Manual Fallback: Integrated search bar within the same screen to locate students 
by Name, ID, or Phone Number if they forget their card. 
○ Auto-Reset: The system resets for the next student immediately after marking, 
requiring no extra clicks. 
3.4. Financial Management 
● Fee Structure: Management of Monthly Class Fees across different subjects. 
● Payment & Alerts (Non-Restrictive): 
○ The system allows attendance marking regardless of payment status (no blocking). 
○ Visual Alerts: 
■ 3rd Week Rule: Displays a warning if the current month's fees are unpaid after 
the 3rd week. 
■ Arrears: Displays outstanding payments from previous months. 
● Receipts: 
○ SMS Receipt: Automated SMS sent to parents upon successful payment. 
○ Print Provision: Option to print a payment receipt via a thermal printer. 
3.5. Reporting & Administration 
● Admin Dashboard: Real-time view of active students, daily attendance, and daily 
revenue. 
● Teacher Reports: Monthly exportable reports (CSV/Excel format) detailing: 
○ Total Enrolled vs. Present Students. 
○ List of Paying Students. 
○ Total Revenue per Class (for teacher payment calculation). 
● Audit Logs: Detailed tracking of all system actions (who edited data, who marked 
payments) for security. 
4. Technical Architecture 
Component 
Frontend Framework 
Backend & Database 
Technology 
Next.js 14+ 
Supabase 
Benefit 
Fast, responsive, and 
SEO-friendly. Works on 
Mobile & Desktop. 
Secure, real-time database 
(PostgreSQL) with built-in 
authentication. 
Offline Engine 
UI Design 
Backup System 
PWA + LocalDB 
Shadcn/UI + Tailwind 
Google Drive API 
4.1. Security & Sync Strategy 
Allows the system to function 
without internet. Syncs data 
automatically when online. 
Clean, professional, and 
consistent user interface. 
Automated daily export of 
database CSVs to a secure 
Google Drive folder. 
● Device Sync: Supports multiple devices (e.g., Tablet at reception, Laptop in back office). 
● Conflict Resolution: Uses "Last-Write-Wins" logic. This ensures that the most recent 
update is prioritized, meaning changes made on an offline device (e.g., updating a profile 
or marking payment) will correctly overwrite older server data once the device 
reconnects. 
● Data Integrity: Usage of UUIDs for payment records to prevent duplication during offline 
syncs. 
5. Implementation Roadmap 
The project will be executed in four phases: 
Phase 1: Foundation & Design 
● Database Schema Design. 
● UI Wireframing. 
● Setting up the Development Environment. 
Phase 2: Core Development 
● Student Registration & Profile Management. 
● Class & Grade Logic implementation (including Year-End transitions). 
● ID Card Generation module. 
Phase 3: Operations Module 
● QR Scanning & Manual Attendance Logic. 
● Payment Collection & SMS Integration. 
● Offline (PWA) Functionality & Sync Logic. 
Phase 4: Reporting & Deployment 
● Teacher Report Generation. 
● Google Drive Backup Automation. 
● Final Testing & User Training. 
6. Conclusion 
This Class Management System is tailored to resolve the specific operational challenges of 
Sarasi Higher Education By combining offline capabilities with a user-friendly interface, the 
system ensures that student management becomes a seamless background process, allowing 
the administration to focus on academic growth rather than paperwork. 
Submitted by: GaraYaka Studio 