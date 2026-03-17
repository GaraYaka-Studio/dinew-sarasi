# Reports & Analytics Implementation Plan

> **Project**: Sarasi Institute Management System
> **Module**: Reports & Analytics (Dashboard/Reports)
> **Document Version**: 1.1
> **Last Updated**: 2026-03-17

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Requirements](#2-business-requirements)
3. [User Stories](#3-user-stories)
4. [Functional Specifications](#4-functional-specifications)
5. [UI/UX Design Specifications](#5-uiux-design-specifications)
6. [Technical Architecture](#6-technical-architecture)
7. [Database Queries & Data Models](#7-database-queries--data-models)
8. [API Specifications](#8-api-specifications)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment & Monitoring](#11-deployment--monitoring)

---

## 1. Executive Summary

### 1.1 Purpose

This document outlines the implementation of a fully functional Reports & Analytics module for the Sarasi Institute Management System. The module will replace the existing mock-data reports with real-time data from the database, providing monthly financial statements, attendance logs, and activity summaries with export capabilities.

### 1.2 Scope

**In Scope:**
- Monthly Financial Statement (income from student fees, expenses from teacher payments)
- Monthly Attendance Log (reuse existing attendance/log functionality)
- Monthly Activity Log (timetable summary with attendance counts)
- Month-based date picker with historical data support
- CSV export functionality
- Google Drive auto-export on last day of month

**Out of Scope:**
- PDF generation 
- Custom date range selection (only month-based)
- Multi-month reporting
- Real-time analytics dashboards

### 1.3 Success Criteria

- All reports display accurate, real-time data from database
- Month picker allows navigation to any historical month
- Export functionality generates downloadable CSV files
- Auto-export to Google Drive on last day of month
- Mobile-responsive design matching existing project standards
- Zero data inconsistencies between reports and source data

---

## 2. Business Requirements

### 2.1 Report Types Overview

| Report Type | Description | Data Source | Frequency |
|-------------|-------------|-------------|-----------|
| **Financial Statement** | Income (student class fees + admission fees) vs Expenses (teacher salaries) | `payments`, `payment_items`, `teacher_payments` | Monthly |
| **Attendance Log** | Daily attendance records by class session | `attendance_records`, `class_sessions` | Monthly |
| **Activity Log** | Class schedule summary with attendance counts | `class_sessions`, `enrollments`, `attendance_records` | Monthly |

### 2.2 Business Rules

**Financial Statement Rules:**
1. Income = Sum of all student monthly fee payments + admission fees for selected month
2. Expenses = Sum of all teacher payments recorded in selected month
3. Include both `type: 'monthly'` and `type: 'admission'` payment items
4. Teacher payments grouped by teacher with class assignment details
5. Income and Expenses displayed in separate tabs

**Attendance Log Rules:**
1. Show attendance records from 1st day of month to current day (for current month)
2. For past months, show full month (1st to last day)
3. Group records by class session (date + time + class)
4. Only show students with status 'present' or 'late'
5. Follow existing `/dashboard/attendance/log` UI pattern

**Activity Log Rules:**
1. Show all scheduled class sessions for selected month
2. Display session status: scheduled, cancelled, extra
3. Show attendance count per session (students marked present)
4. Group by class with daily sessions listed

**Date Rules:**
1. Default view: Current month (1st to today)
2. Can navigate to any past month
3. Cannot view future months (beyond current month)
4. Month picker format: "March 2026", "February 2026"

**Export Rules:**
1. CSV export available for all three report types
2. Export filename: `[ReportType]_[Month]_[Year].csv`
3. Google Drive auto-export on last day of month (background job)
4. Can export any month (current or historical)

---

## 3. User Stories

### 3.1 Financial Statement

**US-1: View Monthly Income**
> As an **administrator**, I want to see total income from student class fees AND admission fees for a selected month, so I can track monthly revenue.

**US-2: View Monthly Expenses**
> As an **administrator**, I want to see total teacher salary payments for a selected month, so I can track monthly expenses.

**US-3: View Student Payment Details**
> As an **administrator**, I want to see a detailed list of all student payments (who paid, which class, amount), so I can reconcile payments.

**US-4: View Teacher Payment Details**
> As an **administrator**, I want to see teacher payments grouped by teacher with their assigned classes and student count, so I can verify salary calculations.

### 3.2 Attendance Log

**US-5: View Monthly Attendance**
> As an **administrator**, I want to view attendance records for an entire month grouped by class session, so I can identify attendance patterns.

**US-6: Export Attendance Report**
> As an **administrator**, I want to export any month's attendance log to CSV, so I can maintain external records.

### 3.3 Activity Log

**US-7: View Class Schedule Summary**
> As an **administrator**, I want to see all class sessions held in a month with attendance counts, so I can understand class utilization.

**US-8: Identify Cancelled Classes**
> As an **administrator**, I want to see which classes were cancelled or marked as extra in the month, so I can track schedule changes.

### 3.4 Navigation & Export

**US-9: Navigate Between Months**
> As an **administrator**, I want to select any month from a month picker, so I can view historical reports.

**US-10: Export to CSV**
> As an **administrator**, I want to export any report to CSV format, so I can share reports with stakeholders.

**US-11: Auto-Export to Google Drive**
> As a **system**, I want to automatically export all reports to Google Drive on the last day of each month, so I have automated backups.

---

## 4. Functional Specifications

### 4.1 Module: Financial Statement

#### 4.1.1 Summary Cards

| Card | Formula | Display Format |
|------|---------|----------------|
| **Total Income** | Sum of all student monthly fee payments + admission fees | `LKR 125,000` (green) |
| **Total Expenses** | Sum of all teacher payments | `LKR 85,000` (red) |
| **Net Profit** | Income - Expenses | `LKR 40,000` (green/red) |

#### 4.1.2 Student Payments Tab

**Columns:**
| Column | Description | Source |
|--------|-------------|--------|
| Date | Payment date | `payments.payment_date` |
| Receipt No | Receipt number | `payments.receipt_number` |
| Student Name | Student full name | `students.full_name` |
| Type | Payment type (Monthly Fee / Admission Fee) | `payment_items.type` |
| Class Name | Class enrolled | `classes.name` |
| Grade | Class grade | `classes.grade` |
| Amount | Payment amount | `payment_items.amount` |

**Query Logic:**
```sql
SELECT
    p.payment_date,
    p.receipt_number,
    s.full_name,
    pi.type,
    c.name AS class_name,
    c.grade,
    pi.amount
FROM payments p
INNER JOIN payment_items pi ON pi.payment_id = p.id
INNER JOIN students s ON s.id = p.student_id
LEFT JOIN classes c ON c.id = pi.class_id
WHERE pi.type IN ('monthly', 'admission')
  AND EXTRACT(MONTH FROM p.payment_date) = :selectedMonth
  AND EXTRACT(YEAR FROM p.payment_date) = :selectedYear
  AND p.deleted_at IS NULL
ORDER BY p.payment_date DESC
```

#### 4.1.3 Teacher Payments Tab

**Grouped by Teacher:**
```
Teacher Name: Mr. Kamal Perera
├── Total Paid: LKR 25,000
└── Classes:
    ├── Grade 10 Mathematics (15 students) - LKR 15,000
    ├── Grade 11 Mathematics (12 students) - LKR 10,000
    └── Grade 12 Physics (8 students) - LKR 0
```

**Columns (expanded view):**
| Column | Description |
|--------|-------------|
| Date | Payment date |
| Teacher Name | Teacher full name |
| Class | Assigned class name |
| Grade | Class grade |
| Students | Active enrollment count |
| Amount | Payment amount |
| Notes | Payment notes (optional) |

**Query Logic:**
```sql
SELECT
    tp.date,
    t.name AS teacher_name,
    c.name AS class_name,
    c.grade,
    COUNT(DISTINCT e.student_id) AS student_count,
    tp.amount,
    tp.notes
FROM teacher_payments tp
INNER JOIN teachers t ON t.id = tp.teacher_id
LEFT JOIN classes c ON c.teacher_id = t.id
LEFT JOIN enrollments e ON e.class_id = c.id AND e.is_active = true
WHERE EXTRACT(MONTH FROM tp.date) = :selectedMonth
  AND EXTRACT(YEAR FROM tp.date) = :selectedYear
GROUP BY tp.id, t.id, c.id
ORDER BY tp.date DESC, t.name, c.grade
```

### 4.2 Module: Attendance Log

**Reuses existing `/dashboard/attendance/log` component with month-based filtering.**

**Session List Format:**
```
📅 2026-03-15 (Sunday)
├── 08:00 AM - Grade 10 Mathematics (28 Present)
├── 10:00 AM - Grade 11 Science (22 Present)
└── 02:00 PM - Grade 12 Physics (18 Present)
```

**Query Logic (modified for month):**
```sql
SELECT
    cs.id AS session_id,
    cs.date,
    cs.start_time,
    c.name AS class_name,
    COUNT(ar.id) AS total_present,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'id', ar.id,
            'name', s.full_name,
            'student_id', s.student_id,
            'scan_time', ar.scan_time,
            'photo_url', s.photo_url
        ) ORDER BY ar.scan_time
    ) AS students
FROM class_sessions cs
INNER JOIN classes c ON c.id = cs.class_id
INNER JOIN attendance_records ar ON ar.session_id = cs.id
INNER JOIN students s ON s.id = ar.student_id
WHERE ar.status IN ('present', 'late')
  AND cs.date BETWEEN :monthStart AND :monthEnd
  AND cs.deleted_at IS NULL
GROUP BY cs.id, c.id
ORDER BY cs.date DESC, cs.start_time
```

### 4.3 Module: Activity Log

**Format:**
```
Grade 10 - Mathematics (Mr. Wijesinghe)
├── 2026-03-01 08:00 AM [HELD] - 28/30 attended
├── 2026-03-08 08:00 AM [HELD] - 25/30 attended
├── 2026-03-15 08:00 AM [CANCELLED] - N/A
└── 2026-03-22 08:00 AM [EXTRA] - 26/30 attended
```

**Query Logic:**
```sql
SELECT
    c.name AS class_name,
    c.grade,
    t.name AS teacher_name,
    cs.date,
    cs.start_time,
    cs.status,
    COUNT(ar.id) AS attendance_count,
    (SELECT COUNT(*) FROM enrollments e WHERE e.class_id = c.id AND e.is_active = true) AS total_enrolled
FROM class_sessions cs
INNER JOIN classes c ON c.id = cs.class_id
LEFT JOIN teachers t ON t.id = c.teacher_id
LEFT JOIN attendance_records ar ON ar.session_id = cs.id AND ar.status IN ('present', 'late')
WHERE cs.date BETWEEN :monthStart AND :monthEnd
  AND cs.deleted_at IS NULL
GROUP BY cs.id, c.id, t.id
ORDER BY c.grade, c.name, cs.date, cs.start_time
```

### 4.4 Module: Month Picker

**Behavior:**
- Previous Month / Next Month buttons
- Month + Year display: "March 2026"
- "Current Month" button to jump back
- Cannot navigate to future months

**Date Calculation Logic:**
```javascript
// Current month view: 1st to today
if (isCurrentMonth(selectedYear, selectedMonth)) {
  startDate = new Date(selectedYear, selectedMonth, 1);
  endDate = new Date(); // Today
}
// Past month view: 1st to last day
else {
  startDate = new Date(selectedYear, selectedMonth, 1);
  endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day
}
```

### 4.5 Module: Export Functionality

#### 4.5.1 CSV Export

**Format:**
- UTF-8 encoded
- Comma-separated values
- Headers in first row
- Date format: YYYY-MM-DD
- Currency: LKR with commas (e.g., "LKR 15,000")

**Financial Statement CSV (Income Tab):**
```csv
Date,Receipt Number,Student Name,Type,Class,Grade,Amount
2026-03-15,REC-001,Kamal Perera,Monthly Fee,Grade 10 Mathematics,10,"LKR 2,500"
2026-03-15,REC-002,Nimal Silva,Monthly Fee,Grade 11 Science,11,"LKR 3,000"
2026-03-10,REC-003,Ruwan Mendis,Admission Fee,Grade 10 Mathematics,10,"LKR 1,000"
```

**Financial Statement CSV (Expenses Tab):**
```csv
Date,Teacher Name,Class,Grade,Students,Amount,Notes
2026-03-25,"Mr. Wijesinghe",Grade 10 Mathematics,10,30,"LKR 15,000","March salary"
2026-03-25,"Mrs. Rathnayake",Grade 11 Science,11,25,"LKR 12,500",""
```

**Attendance Log CSV:**
```csv
Date,Time,Class,Grade,Student Name,Student ID,Scan Time
2026-03-15,"08:00 AM",Grade 10 Mathematics,10,Kamal Perera,STU-001,"08:05 AM"
```

**Activity Log CSV:**
```csv
Date,Time,Class,Grade,Teacher,Status,Attendance,Enrolled
2026-03-15,"08:00 AM",Grade 10 Mathematics,10,"Mr. Wijesinghe",HELD,28,30
```

#### 4.5.2 Google Drive Auto-Export (Phase 2)

**Requirements:**
- Background job running daily at 23:55
- Check if today is last day of month
- If yes, generate all 3 reports and upload to Google Drive
- Folder structure: `/Sarasi Reports/[Year]/[Month Name]/`

**Implementation Approach:**
- Use Vercel Cron Jobs or similar scheduler
- Google Drive API integration
- Store upload status in database

---

## 5. UI/UX Design Specifications

### 5.1 Design System Compliance

**Design Tokens:**
```css
/* Colors */
--primary: hsl(222.2 47.4% 11.2%);      /* Slate 900 */
--background: hsl(0 0% 100%);            /* White */
--muted: hsl(210 40% 96.1%);             /* Slate 100 */
--border: hsl(214.3 31.8% 91.4%);        /* Slate 200 */

/* Status Colors */
--success: hsl(142.1 76.2% 36.3%);       /* Green 600 */
--destructive: hsl(0 84.2% 60.2%);       /* Red 500 */
--warning: hsl(38 92% 50%);              /* Yellow 500 */

/* Typography */
--font-base: 14px (0.875rem)
--font-sm: 12px (0.75rem)
--font-lg: 16px (1rem)

/* Spacing */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
```

### 5.2 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Sidebar] │  Reports & Analytics             [Avatar ▼]   │
│            │  View and export reports                        │
│            ├───────────────────────────────────────────────┤
│            │  ┌─────────────────────────────────────────┐  │
│            │  │ [Financial Statement ▼] [March 2026 ▼]  │  │
│            │  │ [<] March 2026 [>] [Current Month]      │  │
│            │  │ [Export]                                │  │
│            │  └─────────────────────────────────────────┘  │
│            │                                                │
│            │  ┌─────────────────────────────────────────┐  │
│            │  │  [Income] [Expenses] (Tabs)             │  │
│            │  ├─────────────────────────────────────────┤  │
│            │  │                                         │  │
│            │  │  ┌────────────┐ ┌────────────┐         │  │
│            │  │  │ Total      │ │ Expenses   │         │  │
│            │  │  │ Income     │ │            │         │  │
│            │  │  │ LKR 125K   │ │ LKR 85K    │         │  │
│            │  │  └────────────┘ └────────────┘         │  │
│            │  │                                         │  │
│            │  │  [Data Table / Card List]               │  │
│            │  │                                         │  │
│            │  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Mobile Layout (< 768px)

```
┌─────────────────────────────┐
│  ☰  Reports & Analytics    │
│                            │
│  [Financial ▼]             │
│  [<] March 2026 [>]        │
│  [Export]                  │
│                            │
│  [Income|Expenses]         │
│                            │
│  ┌───────────────────┐    │
│  │ Total Income      │    │
│  │ LKR 125,000       │    │
│  └───────────────────┘    │
│                            │
│  [Card List]               │
│  ┌─────────────────────┐  │
│  │ Kamal Perera        │  │
│  │ Grade 10 Math       │  │
│  │ 15 Mar 2026         │  │
│  │ LKR 2,500     [+]   │  │
│  └─────────────────────┘  │
└─────────────────────────────┘
```

### 5.4 Component Specifications

#### 5.4.1 Month Picker Component

**Props:**
```typescript
interface MonthPickerProps {
  selectedYear: number;
  selectedMonth: number; // 0-11
  maxDate?: Date; // Cannot go beyond this (default: today)
  onChange: (year: number, month: number) => void;
}
```

**Visual States:**
| State | Appearance |
|-------|------------|
| Default | outlined button with month/year text |
| Disabled | opacity 50%, no pointer events |
| Current Month | bold text, subtle background |

**Accessibility:**
- `aria-label: "Select month and year"`
- Keyboard navigation: Left/Right arrows
- Screen reader: "March 2026, button"

#### 5.4.2 Summary Cards Component

**Layout (Desktop):**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ Expenses    │ │ Net Profit  │
│ Income      │ │             │ │             │
│ LKR 125,000 │ │ LKR 85,000  │ │ LKR 40,000  │
└─────────────┘ └─────────────┘ └─────────────┘
```

**Layout (Mobile):**
```
┌─────────────┐
│ Total       │
│ Income      │
│ LKR 125,000 │
└─────────────┘
┌─────────────┐
│ Expenses    │
│ LKR 85,000  │
└─────────────┘
┌─────────────┐
│ Net Profit  │
│ LKR 40,000  │
└─────────────┘
```

**Color Coding:**
- Positive/Income: green-50 bg, green-700 text
- Negative/Expense: red-50 bg, red-700 text
- Neutral: gray-50 bg, gray-700 text

#### 5.4.3 Financial Table Component (Student Payments)

**Desktop Table:**
| Date | Receipt | Student | Type | Class | Grade | Amount |
|------|---------|---------|------|-------|-------|--------|
| 15 Mar | REC-101 | Kamal Perera | Monthly Fee | Grade 10 Math | 10 | LKR 2,500 |
| 10 Mar | REC-098 | Ruwan Mendis | Admission Fee | Grade 10 Math | 10 | LKR 1,000 |

**Mobile Card:**
```
┌─────────────────────────────────┐
│ Kamal Perera                    │
│ Grade 10 Math • Monthly Fee     │
│ 15 Mar 2026 • REC-101           │
│                    LKR 2,500 [+]│
└─────────────────────────────────┘
```

#### 5.4.4 Teacher Payments Grouped View

**Desktop - Accordion Style:**
```
▶ Mr. Kamal Perera
  Total Paid: LKR 25,000

  ▶ Grade 10 Mathematics (15 students)
      15 Mar 2026: LKR 15,000

  ▶ Grade 11 Mathematics (12 students)
      15 Mar 2026: LKR 10,000
```

**Mobile - Stacked Cards:**
```
┌─────────────────────────────────┐
│ Mr. Kamal Perera                │
│ Total: LKR 25,000               │
│ ─────────────────────────────── │
│ Grade 10 Math (15)              │
│ 15 Mar: LKR 15,000              │
│ Grade 11 Math (12)              │
│ 15 Mar: LKR 10,000              │
└─────────────────────────────────┘
```

### 5.5 Empty States

| Report Type | Empty State Message | Icon |
|-------------|--------------------|------|
| Financial (no income) | No student payments recorded this month. | 💰 |
| Financial (no expenses) | No teacher payments recorded this month. | 👨‍🏫 |
| Attendance | No attendance records found for this month. | 📅 |
| Activity | No class sessions scheduled for this month. | 📚 |

### 5.6 Loading States

**Skeleton Loading:**
```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓               │
│ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓             │
│ ─────────────────────────────── │
│ ┌─────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓           │ │
│ │ ▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓▓             │ │
│ │ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓           │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 5.7 Error States

| Error Type | Message | Action |
|------------|---------|--------|
| Network | Failed to load reports. Check connection. | [Retry] |
| No Data | No records found for selected month. | [Change Month] |
| Export Failed | Could not export report. Try again. | [Retry] |

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 (App Router) | React framework |
| UI Library | shadcn/ui + Radix UI | Component library |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Backend + DB |
| ORM | Drizzle ORM | Database queries |
| Date Handling | date-fns | Date manipulation |
| State Management | React hooks (useState, useEffect) | Component state |

### 6.2 File Structure

```
src/
├── app/
│   └── dashboard/
│       └── reports/
│           ├── page.tsx                    # Main reports page
│           └── layout.tsx                  # Layout wrapper
├── components/
│   ├── features/
│   │   └── reports/
│   │       ├── reports-header.tsx          # Header with month picker
│   │       ├── reports-summary-cards.tsx   # Summary cards
│   │       ├── financial-report.tsx        # Financial statement
│   │       │   ├── student-payments-tab.tsx
│   │       │   └── teacher-payments-tab.tsx
│   │       ├── attendance-report.tsx       # Attendance log (reuses)
│   │       ├── activity-report.tsx         # Activity log
│   │       ├── month-picker.tsx            # Month picker component
│   │       └── export-button.tsx           # Export button
│   └── ui/
│       └── ... (existing components)
├── lib/
│   ├── db/
│   │   ├── reports.ts                      # Report queries
│   │   └── export.ts                       # Export utilities
│   └── utils/
│       └── csv.ts                          # CSV generation
└── types/
    └── reports.ts                          # TypeScript types
```

### 6.3 Data Flow

```
User selects month
       │
       ▼
MonthPicker Component
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
onMonthChange                         Parent State Update
       │                                      │
       │                                      ▼
       │                            Report Type Selector
       │                                      │
       │                                      ▼
       │                            ┌─────────────────────┐
       │                            │ Financial Statement │
       │                            │ Attendance Log      │
       │                            │ Activity Log        │
       │                            └─────────────────────┘
       │                                      │
       └──────────────────────────────────────┘
                       │
                       ▼
            Server Actions (lib/db/reports.ts)
                       │
                       ▼
                Database Queries
                       │
                       ▼
                Data Transformation
                       │
                       ▼
                Component Rendering
```

### 6.4 State Management Strategy

**Component State:**
```typescript
interface ReportsState {
  reportType: 'financial' | 'attendance' | 'activity';
  selectedYear: number;
  selectedMonth: number;
  isLoading: boolean;
  error: string | null;
}
```

**Derived State:**
```typescript
// Date range based on selection
const dateRange = useMemo(() => {
  const isCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth;
  const startDate = new Date(selectedYear, selectedMonth, 1);
  const endDate = isCurrentMonth
    ? new Date()
    : new Date(selectedYear, selectedMonth + 1, 0);
  return { startDate, endDate, isCurrentMonth };
}, [selectedYear, selectedMonth]);

// Formatted for queries
const queryParams = {
  year: selectedYear,
  month: selectedMonth,
  startDate: formatDate(dateRange.startDate),
  endDate: formatDate(dateRange.endDate),
};
```

---

## 7. Database Queries & Data Models

### 7.1 TypeScript Types

```typescript
// src/types/reports.ts

export type ReportType = 'financial' | 'attendance' | 'activity';
export type TabType = 'income' | 'expenses';

// Financial Report Types
export interface StudentPaymentRecord {
  date: string;           // YYYY-MM-DD
  receiptNumber: number;
  studentName: string;
  type: 'monthly' | 'admission';  // Payment type
  className: string;
  grade: string;
  amount: number;         // in cents/rupees
}

export interface TeacherPaymentRecord {
  date: string;
  teacherName: string;
  teacherId: string;
  className: string | null;
  grade: string | null;
  studentCount: number;
  amount: number;
  notes: string | null;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

export interface TeacherPaymentGroup {
  teacherId: string;
  teacherName: string;
  totalPaid: number;
  classes: {
    className: string;
    grade: string;
    studentCount: number;
    amount: number;
  }[];
}

// Attendance Report Types (reuses existing)
export interface AttendanceLogSession {
  id: string;
  className: string;
  time: string;
  totalPresent: number;
  students: AttendanceLogStudent[];
}

export interface AttendanceLogStudent {
  id: string;
  name: string;
  studentId: number;
  scanTime: string;
  avatarUrl: string | null;
}

// Activity Report Types
export interface ActivitySession {
  id: string;
  className: string;
  grade: string;
  teacherName: string | null;
  date: string;
  time: string;
  status: 'scheduled' | 'cancelled' | 'extra';
  attendanceCount: number;
  totalEnrolled: number;
}

export interface ActivitySummary {
  totalScheduled: number;
  completed: number;
  cancelled: number;
  extra: number;
}
```

### 7.2 Database Query Functions

```typescript
// src/lib/db/reports.ts

'use server';

import { db } from '@/db';
import {
  payments,
  paymentItems,
  students,
  classes,
  teacherPayments,
  teachers,
  enrollments,
  classSessions,
  attendanceRecords,
} from '@/db/schema';
import { eq, and, gte, lte, isNull, sql, desc, asc } from 'drizzle-orm';
import { formatDate } from '@/lib/utils/time';

// ============================================================================
// FINANCIAL REPORT QUERIES
// ============================================================================

/**
 * Get student payment records for a specific month
 * Includes both monthly fee payments AND admission fees
 */
export async function getStudentPaymentsForMonth(
  year: number,
  month: number
): Promise<StudentPaymentRecord[]> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const results = await db
    .select({
      date: sql<string>`DATE(${payments.payment_date})`,
      receiptNumber: payments.receipt_number,
      studentName: students.full_name,
      type: paymentItems.type,
      className: classes.name,
      grade: classes.grade,
      amount: paymentItems.amount,
    })
    .from(payments)
    .innerJoin(paymentItems, eq(paymentItems.payment_id, payments.id))
    .innerJoin(students, eq(students.id, payments.student_id))
    .innerJoin(classes, eq(classes.id, paymentItems.class_id))
    .where(
      and(
        sql`${paymentItems.type} IN ('monthly', 'admission')`,
        gte(payments.payment_date, startDate),
        lte(payments.payment_date, endDate),
        isNull(payments.deleted_at)
      )
    )
    .orderBy(desc(payments.payment_date));

  return results.map((r) => ({
    date: r.date,
    receiptNumber: r.receiptNumber ?? 0,
    studentName: r.studentName,
    type: r.type as 'monthly' | 'admission',
    className: r.className,
    grade: r.grade,
    amount: Number(r.amount),
  }));
}

/**
 * Get teacher payment records grouped by teacher for a specific month
 */
export async function getTeacherPaymentsForMonth(
  year: number,
  month: number
): Promise<TeacherPaymentGroup[]> {
  const startDate = formatDate(new Date(year, month, 1));
  const endDate = formatDate(new Date(year, month + 1, 0));

  // Get all teacher payments for the month with class details
  const payments = await db
    .select({
      paymentId: teacherPayments.id,
      date: teacherPayments.date,
      amount: teacherPayments.amount,
      notes: teacherPayments.notes,
      teacherId: teachers.id,
      teacherName: teachers.name,
      classId: sql<string>`COALESCE(${classes.id}, '')`,
      className: sql<string>`COALESCE(${classes.name}, 'Unassigned')`,
      grade: sql<string>`COALESCE(${classes.grade}, '')`,
    })
    .from(teacherPayments)
    .innerJoin(teachers, eq(teachers.id, teacherPayments.teacher_id))
    .leftJoin(classes, eq(classes.teacher_id, teachers.id))
    .where(
      and(
        gte(teacherPayments.date, startDate),
        lte(teacherPayments.date, endDate)
      )
    )
    .orderBy(desc(teacherPayments.date), teachers.name, classes.grade);

  // Get student counts for each class
  const classIds = [...new Set(payments.map((p) => p.classId).filter(Boolean))];
  const enrollmentCounts = classIds.length > 0
    ? await db
        .select({
          classId: enrollments.class_id,
          count: sql<number>`COUNT(*)`,
        })
        .from(enrollments)
        .where(
          and(
            sql`${enrollments.class_id} = ANY(${classIds})`,
            eq(enrollments.is_active, true),
            isNull(enrollments.deleted_at)
          )
        )
        .groupBy(enrollments.class_id)
    : [];

  const countMap = new Map(enrollmentCounts.map((e) => [e.classId, e.count]));

  // Group by teacher
  const teacherMap = new Map<string, TeacherPaymentGroup>();

  for (const payment of payments) {
    if (!teacherMap.has(payment.teacherId)) {
      teacherMap.set(payment.teacherId, {
        teacherId: payment.teacherId,
        teacherName: payment.teacherName,
        totalPaid: 0,
        classes: [],
      });
    }

    const group = teacherMap.get(payment.teacherId)!;
    group.totalPaid += Number(payment.amount);

    const studentCount = payment.classId ? (countMap.get(payment.classId) ?? 0) : 0;

    group.classes.push({
      className: payment.className,
      grade: payment.grade,
      studentCount,
      amount: Number(payment.amount),
    });
  }

  return Array.from(teacherMap.values());
}

/**
 * Get financial summary for a specific month
 */
export async function getFinancialSummary(
  year: number,
  month: number
): Promise<FinancialSummary> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const [incomeResult, expensesResult] = await Promise.all([
    // Total income from student monthly payments + admission fees + admission fees
    db
      .select({
        total: sql<number>`COALESCE(SUM(${paymentItems.amount}), 0)`,
      })
      .from(paymentItems)
      .innerJoin(payments, eq(payments.id, paymentItems.payment_id))
      .where(
        and(
          sql`${paymentItems.type} IN ('monthly', 'admission')`,
          gte(payments.payment_date, startDate),
          lte(payments.payment_date, endDate),
          isNull(payments.deleted_at)
        )
      ),
    // Total expenses from teacher payments
    db
      .select({
        total: sql<number>`COALESCE(SUM(${teacherPayments.amount}), 0)`,
      })
      .from(teacherPayments)
      .where(
        and(
          gte(teacherPayments.date, new Date(year, month, 1)),
          lte(teacherPayments.date, new Date(year, month + 1, 0))
        )
      ),
  ]);

  const totalIncome = Number(incomeResult[0]?.total ?? 0);
  const totalExpenses = Number(expensesResult[0]?.total ?? 0);

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
  };
}

// ============================================================================
// ATTENDANCE REPORT QUERIES
// ============================================================================

/**
 * Get attendance log grouped by session for a month
 * Reuses existing getAttendanceLogByDate logic for date range
 */
export async function getAttendanceLogForMonth(
  startDate: string,
  endDate: string
): Promise<AttendanceLogSession[]> {
  const sessions = await db
    .select({
      sessionId: classSessions.id,
      classId: classSessions.class_id,
      className: classes.name,
      date: classSessions.date,
      startTime: classSessions.start_time,
      attendanceId: attendanceRecords.id,
      studentId: attendanceRecords.student_id,
      studentName: students.full_name,
      studentNumericId: students.student_id,
      scanTime: attendanceRecords.scan_time,
      photoUrl: students.photo_url,
      status: attendanceRecords.status,
    })
    .from(classSessions)
    .innerJoin(classes, eq(classSessions.class_id, classes.id))
    .innerJoin(attendanceRecords, and(
      eq(attendanceRecords.session_id, classSessions.id),
      gte(attendanceRecords.date, startDate),
      lte(attendanceRecords.date, endDate)
    ))
    .innerJoin(students, eq(attendanceRecords.student_id, students.id))
    .where(
      and(
        gte(classSessions.date, startDate),
        lte(classSessions.date, endDate),
        sql`${attendanceRecords.status} IN ('present', 'late')`,
        isNull(classSessions.deleted_at)
      )
    )
    .orderBy(asc(classSessions.date), asc(classSessions.start_time), asc(attendanceRecords.scan_time));

  // Group by session (same as existing logic)
  const sessionMap = new Map<string, AttendanceLogSession>();

  for (const record of sessions) {
    const key = record.sessionId;

    if (!sessionMap.has(key)) {
      const date = new Date(record.date + 'T00:00:00');
      const timeParts = record.startTime.split(':');
      const hour = parseInt(timeParts[0]);
      const minute = timeParts[1];
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;

      sessionMap.set(key, {
        id: record.sessionId,
        className: record.className,
        time: formattedTime,
        totalPresent: 0,
        students: [],
      });
    }

    const session = sessionMap.get(key)!;

    const scanTimeStr = record.scanTime ?? '00:00:00';
    const scanTimeParts = scanTimeStr.split(':');
    const scanHour = parseInt(scanTimeParts[0]);
    const scanMinute = scanTimeParts[1];
    const scanPeriod = scanHour >= 12 ? 'PM' : 'AM';
    const displayScanHour = scanHour === 0 ? 12 : scanHour > 12 ? scanHour - 12 : scanHour;
    const formattedScanTime = `${displayScanHour.toString().padStart(2, '0')}:${scanMinute} ${scanPeriod}`;

    session.students.push({
      id: record.attendanceId,
      name: record.studentName,
      studentId: record.studentNumericId,
      scanTime: formattedScanTime,
      avatarUrl: record.photoUrl,
    });
    session.totalPresent = session.students.length;
  }

  return Array.from(sessionMap.values());
}

// ============================================================================
// ACTIVITY REPORT QUERIES
// ============================================================================

/**
 * Get activity log (class sessions with attendance) for a month
 */
export async function getActivityLogForMonth(
  startDate: string,
  endDate: string
): Promise<ActivitySession[]> {
  const sessions = await db
    .select({
      sessionId: classSessions.id,
      className: classes.name,
      grade: classes.grade,
      teacherName: teachers.name,
      date: classSessions.date,
      startTime: classSessions.start_time,
      status: classSessions.status,
      attendanceCount: sql<number>`COUNT(DISTINCT ${attendanceRecords.id})`,
      totalEnrolled: sql<number>`(
        SELECT COUNT(*)
        FROM ${enrollments}
        WHERE ${enrollments.class_id} = ${classSessions.class_id}
          AND ${enrollments.is_active} = true
          AND ${enrollments.deleted_at} IS NULL
      )`,
    })
    .from(classSessions)
    .innerJoin(classes, eq(classSessions.class_id, classes.id))
    .leftJoin(teachers, eq(teachers.id, classes.teacher_id))
    .leftJoin(attendanceRecords, and(
      eq(attendanceRecords.session_id, classSessions.id),
      sql`${attendanceRecords.status} IN ('present', 'late')`
    ))
    .where(
      and(
        gte(classSessions.date, startDate),
        lte(classSessions.date, endDate),
        isNull(classSessions.deleted_at)
      )
    )
    .groupBy(classSessions.id, classes.id, teachers.id)
    .orderBy(asc(classes.grade), asc(classes.name), asc(classSessions.date), asc(classSessions.start_time));

  // Format time
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return sessions.map((s) => ({
    id: s.sessionId,
    className: s.className,
    grade: s.grade,
    teacherName: s.teacherName,
    date: s.date,
    time: formatTime(s.startTime),
    status: s.status as 'scheduled' | 'cancelled' | 'extra',
    attendanceCount: s.attendanceCount,
    totalEnrolled: s.totalEnrolled,
  }));
}

/**
 * Get activity summary for a month
 */
export async function getActivitySummary(
  startDate: string,
  endDate: string
): Promise<ActivitySummary> {
  const result = await db
    .select({
      totalScheduled: sql<number>`COUNT(*)`,
      completed: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'scheduled')`,
      cancelled: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'cancelled')`,
      extra: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'extra')`,
    })
    .from(classSessions)
    .where(
      and(
        gte(classSessions.date, startDate),
        lte(classSessions.date, endDate),
        isNull(classSessions.deleted_at)
      )
    );

  return {
    totalScheduled: result[0]?.totalScheduled ?? 0,
    completed: result[0]?.completed ?? 0,
    cancelled: result[0]?.cancelled ?? 0,
    extra: result[0]?.extra ?? 0,
  };
}
```

### 7.3 Export Utilities

```typescript
// src/lib/utils/csv.ts

/**
 * Generate CSV from array of objects
 */
export function generateCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  formatter?: (value: any, key: keyof T) => string
): string {
  // Header row
  const headers = columns.map((c) => c.label).join(',');

  // Data rows
  const rows = data.map((row) => {
    return columns.map((col) => {
      const value = row[col.key];
      return formatter
        ? formatter(value, col.key)
        : formatCSVValue(value);
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

function formatCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    // Escape quotes and wrap in quotes if contains comma or quote
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  if (typeof value === 'number') return value.toString();
  return String(value);
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
```

---

## 8. API Specifications

This module uses **Server Actions** (Next.js 16) instead of REST API routes. All database queries are server functions called directly from client components.

### 8.1 Server Action Signatures

```typescript
// Server actions are defined in 'use server' files
// and called directly from client components

// Example:
import { getStudentPaymentsForMonth } from '@/lib/db/reports';

// In component:
const payments = await getStudentPaymentsForMonth(year, month);
```

### 8.2 Error Handling Standard

```typescript
// All server actions return standardized results
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Usage pattern
export async function getReportData(...): Promise<ActionResult<ReportData>> {
  try {
    const data = await db.select()...
    return { success: true, data };
  } catch (error) {
    console.error('Report error:', error);
    return { success: false, error: 'Failed to load report data' };
  }
}
```

---

## 9. Implementation Roadmap

### 9.1 Phase Overview

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1** | Week 1 | Database queries + TypeScript types |
| **Phase 2** | Week 1 | Month picker + Header component |
| **Phase 3** | Week 2 | Financial Statement (Student Payments tab) |
| **Phase 4** | Week 2 | Financial Statement (Teacher Payments tab) |
| **Phase 5** | Week 3 | Attendance Log (reuse existing) |
| **Phase 6** | Week 3 | Activity Log |
| **Phase 7** | Week 4 | CSV Export functionality |
| **Phase 8** | Week 4 | Testing + Bug fixes |
| **Phase 9** | Post-MVP | Google Drive auto-export |

### 9.2 Detailed Tasks

#### Phase 1: Foundation (Days 1-3)

**Tasks:**
- [ ] Create `src/types/reports.ts` with all TypeScript interfaces
- [ ] Create `src/lib/db/reports.ts` with server actions
- [ ] Write database query: `getStudentPaymentsForMonth()`
- [ ] Write database query: `getTeacherPaymentsForMonth()`
- [ ] Write database query: `getFinancialSummary()`
- [ ] Write database query: `getAttendanceLogForMonth()`
- [ ] Write database query: `getActivityLogForMonth()`
- [ ] Write database query: `getActivitySummary()`

**Acceptance Criteria:**
- All queries execute without errors
- Return types match TypeScript interfaces
- Queries handle edge cases (empty results, null values)

#### Phase 2: UI Components (Days 4-5)

**Tasks:**
- [ ] Create `MonthPicker` component
  - [ ] Previous/Next month buttons
  - [ ] Current Month button
  - [ ] Display: "March 2026"
  - [ ] Disable future months
- [ ] Update `ReportsHeader` component
  - [ ] Replace date range inputs with MonthPicker
  - [ ] Remove Print button
  - [ ] Rename "CSV" to "Export"
- [ ] Create `ExportButton` component
  - [ ] Loading state
  - [ ] Success/error handling

**Acceptance Criteria:**
- Month picker navigates correctly
- Cannot select future dates
- UI matches existing design system

#### Phase 3: Financial - Student Payments (Days 6-7)

**Tasks:**
- [ ] Create `FinancialReport` component with tabs
- [ ] Create `StudentPaymentsTab` component
  - [ ] Desktop table view
  - [ ] Mobile card view
  - [ ] Empty state
  - [ ] Loading state
- [ ] Update `ReportsSummaryCards` to use real data
- [ ] Integrate with `getStudentPaymentsForMonth()` query
- [ ] Format currency display (LKR)
- [ ] Handle zero results

**Acceptance Criteria:**
- Student payments display correctly
- Summary cards show accurate totals
- Responsive design works on mobile

#### Phase 4: Financial - Teacher Payments (Days 8-9)

**Tasks:**
- [ ] Create `TeacherPaymentsTab` component
  - [ ] Grouped by teacher (accordion)
  - [ ] Class details with student count
  - [ ] Payment amount per class
  - [ ] Total per teacher
- [ ] Mobile-optimized grouped view
- [ ] Integrate with `getTeacherPaymentsForMonth()` query
- [ ] Handle unassigned teacher payments (no class)

**Acceptance Criteria:**
- Teacher payments grouped correctly
- Student counts are accurate
- Accordion expands/collapses smoothly

#### Phase 5: Attendance Log (Days 10-11)

**Tasks:**
- [ ] Create `AttendanceReport` component
- [ ] Reuse existing `AttendanceLogHeader` with month context
- [ ] Reuse existing accordion/table pattern
- [ ] Integrate with `getAttendanceLogForMonth()` query
- [ ] Filter by selected month date range
- [ ] Handle months with no attendance

**Acceptance Criteria:**
- Attendance displays for selected month
- UI matches existing `/dashboard/attendance/log`
- Can view historical months

#### Phase 6: Activity Log (Days 12-13)

**Tasks:**
- [ ] Create `ActivityReport` component
  - [ ] Group by class
  - [ ] List sessions chronologically
  - [ ] Show status badges (scheduled/cancelled/extra)
  - [ ] Show attendance counts
- [ ] Create `ActivitySummaryCards` component
- [ ] Desktop table + Mobile card views
- [ ] Integrate with `getActivityLogForMonth()` query

**Acceptance Criteria:**
- Activity sessions display correctly
- Attendance counts are accurate
- Status badges use correct colors

#### Phase 7: CSV Export (Days 14-15)

**Tasks:**
- [ ] Create `src/lib/utils/csv.ts` utilities
- [ ] Implement `generateCSV()` function
- [ ] Implement `downloadCSV()` function
- [ ] Add export handlers for each report type
  - [ ] Financial (Student Payments)
  - [ ] Financial (Teacher Payments)
  - [ ] Attendance Log
  - [ ] Activity Log
- [ ] Generate filenames: `[ReportType]_[Month]_[Year].csv`
- [ ] Add loading/success states

**Acceptance Criteria:**
- CSV downloads correctly
- File has proper formatting
- Opens in Excel/Google Sheets
- Filename matches convention

#### Phase 8: Testing & Bug Fixes (Days 16-18)

**Tasks:**
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing (iOS, Android)
- [ ] Edge case testing
  - [ ] Empty data scenarios
  - [ ] Leap year February
  - [ ] Month boundaries
- [ ] Performance testing (large datasets)
- [ ] Accessibility audit (keyboard navigation, screen reader)
- [ ] Fix reported bugs

#### Phase 9: Google Drive Auto-Export (Post-MVP)

**Tasks:**
- [ ] Set up Google Drive API credentials
- [ ] Create background job (Vercel Cron)
- [ ] Implement monthly report generation
- [ ] Implement file upload logic
- [ ] Add error handling and retry logic
- [ ] Store export status in database

---

## 10. Testing Requirements

### 10.1 Unit Tests

**Query Tests:**
```typescript
describe('getStudentPaymentsForMonth', () => {
  it('should return payments for specified month', async () => {
    const result = await getStudentPaymentsForMonth(2026, 2); // March
    expect(result).toHaveLength(15);
    expect(result[0].amount).toBeGreaterThan(0);
  });

  it('should include both monthly and admission fees', async () => {
    const result = await getStudentPaymentsForMonth(2026, 2);
    const monthlyPayments = result.filter(r => r.type === 'monthly');
    const admissionPayments = result.filter(r => r.type === 'admission');
    expect(monthlyPayments.length + admissionPayments.length).toBeGreaterThan(0);
  });

  it('should return empty array for month with no payments', async () => {
    const result = await getStudentPaymentsForMonth(2025, 0); // Jan 2025
    expect(result).toHaveLength(0);
  });
});
```

### 10.2 Integration Tests

**End-to-End Scenarios:**
1. **View Financial Report**
   - Select month → View summary cards → View student payments → View teacher payments

2. **Export CSV**
   - Select report type → Click export → Verify file download

3. **Navigate Months**
   - Current month → Previous month → Future month (disabled)

### 10.3 Acceptance Criteria

| Feature | Criterion | Test Method |
|---------|-----------|-------------|
| Month Picker | Can navigate to any past month | Manual QA |
| Financial Report | Income = sum of monthly + admission fees | Automated test |
| Financial Report | Expenses = sum of all teacher payments | Automated test |
| Attendance Log | Shows same data as /dashboard/attendance/log | Comparison test |
| Activity Log | Attendance counts match actual attendance | Spot check |
| CSV Export | Can export any month (historical included) | Manual QA |
| Responsive Design | Works on mobile (375px - 428px) | Device testing |

### 10.4 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ✅ Supported |
| Edge | Latest | ✅ Supported |
| Mobile Safari | iOS 15+ | ✅ Supported |
| Chrome Mobile | Android 12+ | ✅ Supported |

---

## 11. Deployment & Monitoring

### 11.1 Deployment Checklist

- [ ] All code reviewed and approved
- [ ] Unit tests passing (100%)
- [ ] Integration tests passing
- [ ] Manual QA completed
- [ ] Database migrations applied (if any)
- [ ] Environment variables configured
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Documentation updated

### 11.2 Monitoring

**Key Metrics:**
- Page load time < 2 seconds
- Query execution time < 500ms
- Zero console errors
- CSV generation time < 1 second

**Error Tracking:**
- Log all query failures
- Track export failures
- Monitor edge cases (null data, empty results)

### 11.3 Rollback Plan

If critical issues are found:
1. Revert to previous version (mock data)
2. Hot fix specific issue
3. Test in staging
4. Redeploy with fix

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Monthly Fee** | Regular class fee paid by students each month |
| **Admission Fee** | One-time fee paid when student enrolls |
| **Teacher Payment** | Salary payment made to teachers |
| **Class Session** | Scheduled occurrence of a class (date + time) |
| **Attendance Record** | Record of student presence at a session |
| **Enrollment** | Link between student and class |

### B. SQL Schema References

**Key Tables:**
```sql
-- Payments
payments (id, receipt_number, student_id, total_amount, method, payment_date)
payment_items (id, payment_id, type, class_id, month_index, year, amount)

-- Teacher Payments
teacher_payments (id, teacher_id, amount, date, notes)

-- Attendance
class_sessions (id, class_id, date, start_time, end_time, status)
attendance_records (id, student_id, class_id, session_id, date, scan_time, status)

-- Classes & Enrollments
classes (id, name, grade, monthly_fee, teacher_id)
enrollments (id, student_id, class_id, enrolled_at, is_active)
```

### C. Date/Time Handling

**Sri Lanka Timezone: UTC+5:30**

All dates stored in database as:
- `date` columns: `YYYY-MM-DD` (e.g., "2026-03-17")
- `time` columns: `HH:MM:SS` (e.g., "08:00:00")
- `timestamp` columns: UTC with conversion on read

**Month Selection:**
- JavaScript months are 0-indexed (0 = January, 2 = March)
- Display format: "March 2026"
- Query range: `2026-03-01` to `2026-03-31` (or today for current month)

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Product Owner** | | | |
| **Tech Lead** | | | |
| **Designer** | | | |
| **QA Lead** | | | |

---

**Document Status:** Ready for Review
**Next Review Date:** 2026-03-20
