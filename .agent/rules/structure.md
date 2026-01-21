---
trigger: always_on
---

src/
├── app/                  # ROUTING LAYER (Views Only)
│   ├── (auth)/           # Public routes (Login)
│   ├── dashboard/        # Protected routes (Layouts + Pages)
│   │   ├── attendance/   # (Scan Mode, Daily Log)
│   │   ├── students/     # (List, Admission, Profiles)
│   │   │   └── ids/      # (ID Card Generation)
│   │   ├── payments/     # (Collect Fees, Arrears)
│   │   ├── reports/      # (Teacher, Income)
│   │   └── settings/     # (Academic Year, System)
│   └── layout.tsx        # Root layout (Providers: QueryClient, Auth)
│
├── actions/              # DATA LAYER (Server Actions) ⚠️
│   ├── student.ts        # e.g., createStudent(), getStudentProfile()
│   ├── payment.ts        # e.g., processPayment()
│   ├── attendance.ts     # e.g., markAttendance()
│   ├── reports.ts        # e.g., generateTeacherReport()
│   └── settings.ts       # e.g., promoteStudents()
│   # NOTE: Direct DB queries inside UI components are PROHIBITED.
│
├── components/           # UI LAYER
│   ├── ui/               # Shadcn primitives (Do not edit manually)
│   ├── shared/           # Global (Sidebar, Navbar, UserNav)
│   └── features/         # Domain specific
│       ├── attendance/   # ScannerView, LogTable
│       ├── students/     # StudentForm, IDCardTemplate
│       └── reports/      # Charts, SummaryCards
│
├── hooks/                # LOGIC LAYER (Client Side) 🧠
│   ├── use-offline.ts    # Handling sync status
│   └── use-scanner.ts    # QR scanning logic
│
├── lib/                  # CONFIG LAYER
│   ├── supabase.ts       # Supabase Client
│   ├── db-types.ts       # Generated Types
│   └── utils.ts          # CN helper, Date formatters
│
└── types/                # GLOBAL TYPES