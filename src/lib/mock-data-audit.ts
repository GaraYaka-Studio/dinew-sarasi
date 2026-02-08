// ============================================================================
// AUDIT LOGS DATA
// ============================================================================

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
export type AuditModule = 'Students' | 'Finance' | 'Classes' | 'Staff' | 'Settings' | 'System';

export interface AuditLog {
    id: string;
    timestamp: string; // ISO format
    user: {
        name: string;
        avatar?: string;
        role: string;
    };
    action: AuditAction;
    module: AuditModule;
    context: string; // e.g., "Student: Kasun Perera"
    details: string; // e.g., "Changed fee 2000 -> 2500"
    ipAddress?: string;
}

// Helper to get date from timestamp
export const getDateKey = (timestamp: string): string => {
    return timestamp.split('T')[0];
};

// Helper to format time
export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// Helper to format date header
export const formatDateHeader = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (getDateKey(today.toISOString()) === dateStr) {
        return `Today - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (getDateKey(yesterday.toISOString()) === dateStr) {
        return `Yesterday - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
};

// Mock Audit Logs Data
export const AUDIT_LOGS: AuditLog[] = [
    // TODAY
    {
        id: 'audit-1',
        timestamp: '2025-02-09T09:41:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'CREATE',
        module: 'Students',
        context: 'Student: Nimal Silva',
        details: 'Admitted new student to Grade 10 Science',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-2',
        timestamp: '2025-02-09T09:35:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'UPDATE',
        module: 'Finance',
        context: 'Payment: PMT-2025-0042',
        details: 'Changed fee amount: LKR 2,000 → LKR 2,500',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-3',
        timestamp: '2025-02-09T09:15:00',
        user: { name: 'Priya Jayawardena', role: 'Staff' },
        action: 'LOGIN',
        module: 'System',
        context: 'System Login',
        details: 'Logged in from Chrome on Windows',
        ipAddress: '192.168.1.105',
    },
    {
        id: 'audit-4',
        timestamp: '2025-02-09T08:45:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'UPDATE',
        module: 'Classes',
        context: 'Class: Grade 10 Mathematics',
        details: 'Changed teacher: Mr. Wijesinghe → Mrs. Rathnayake',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-5',
        timestamp: '2025-02-09T08:30:00',
        user: { name: 'Ruwan Mendis', role: 'Staff' },
        action: 'EXPORT',
        module: 'Students',
        context: 'Student List Report',
        details: 'Exported 150 student records to CSV',
        ipAddress: '192.168.1.110',
    },
    {
        id: 'audit-6',
        timestamp: '2025-02-09T08:00:00',
        user: { name: 'Dilani Rathnayake', role: 'Staff' },
        action: 'CREATE',
        module: 'Finance',
        context: 'Expense: Office Supplies',
        details: 'Added expense: LKR 5,000 for stationery',
        ipAddress: '192.168.1.108',
    },

    // YESTERDAY
    {
        id: 'audit-7',
        timestamp: '2025-02-08T16:45:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'DELETE',
        module: 'Students',
        context: 'Student: Test Student',
        details: 'Deleted test student record',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-8',
        timestamp: '2025-02-08T15:30:00',
        user: { name: 'Chaminda Kumara', role: 'Staff' },
        action: 'UPDATE',
        module: 'Staff',
        context: 'Teacher: Mr. Perera',
        details: 'Updated phone number: 077-1234567 → 077-9876543',
        ipAddress: '192.168.1.112',
    },
    {
        id: 'audit-9',
        timestamp: '2025-02-08T14:20:00',
        user: { name: 'Priya Jayawardena', role: 'Staff' },
        action: 'LOGIN',
        module: 'System',
        context: 'System Login',
        details: 'Logged in from Safari on macOS',
        ipAddress: '192.168.1.105',
    },
    {
        id: 'audit-10',
        timestamp: '2025-02-08T11:00:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'CREATE',
        module: 'Classes',
        context: 'Class: Grade 11 Biology',
        details: 'Created new class with 25 enrolled students',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-11',
        timestamp: '2025-02-08T10:15:00',
        user: { name: 'Sanduni Perera', role: 'Staff' },
        action: 'UPDATE',
        module: 'Finance',
        context: 'Payment: PMT-2025-0038',
        details: 'Marked as paid: Pending → Paid',
        ipAddress: '192.168.1.115',
    },
    {
        id: 'audit-12',
        timestamp: '2025-02-08T09:00:00',
        user: { name: 'Ruwan Mendis', role: 'Staff' },
        action: 'EXPORT',
        module: 'Finance',
        context: 'Financial Report',
        details: 'Exported February 2025 financial statement',
        ipAddress: '192.168.1.110',
    },

    // EARLIER
    {
        id: 'audit-13',
        timestamp: '2025-02-07T17:30:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'UPDATE',
        module: 'Settings',
        context: 'Academic Year 2025',
        details: 'Extended end date: Dec 15 → Dec 20, 2025',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-14',
        timestamp: '2025-02-07T14:45:00',
        user: { name: 'Ashen Fernando', role: 'Staff' },
        action: 'LOGIN',
        module: 'System',
        context: 'System Login',
        details: 'Logged in from Firefox on Windows',
        ipAddress: '192.168.1.120',
    },
    {
        id: 'audit-15',
        timestamp: '2025-02-07T11:20:00',
        user: { name: 'Dilani Rathnayake', role: 'Staff' },
        action: 'CREATE',
        module: 'Students',
        context: 'Student: Kavindi Silva',
        details: 'Admitted new student to Grade 12 Physics',
        ipAddress: '192.168.1.108',
    },
    {
        id: 'audit-16',
        timestamp: '2025-02-07T09:30:00',
        user: { name: 'Kamal Perera', role: 'Admin' },
        action: 'DELETE',
        module: 'Classes',
        context: 'Class: Old Revision Batch',
        details: 'Archived old class with 0 students',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'audit-17',
        timestamp: '2025-02-07T08:45:00',
        user: { name: 'Chaminda Kumara', role: 'Staff' },
        action: 'UPDATE',
        module: 'Students',
        context: 'Student: Tharindu Jayasinghe',
        details: 'Updated grade: Grade 10 → Grade 11',
        ipAddress: '192.168.1.112',
    },
];

// Group logs by date
export const groupLogsByDate = (logs: AuditLog[]): Record<string, AuditLog[]> => {
    return logs.reduce((acc, log) => {
        const dateKey = getDateKey(log.timestamp);
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(log);
        return acc;
    }, {} as Record<string, AuditLog[]>);
};

// Get sorted dates (newest first)
export const getSortedDates = (groupedLogs: Record<string, AuditLog[]>): string[] => {
    return Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};
