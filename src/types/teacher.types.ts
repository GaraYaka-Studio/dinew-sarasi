export interface Teacher {
    id: string;
    name: string;
    display_name: string;
    initials: string;
    nic: string;
    phone: string;
    address: string;
    subjects: string[];
    color: string; // Hex color for timetable
    status: 'active' | 'inactive';
    classCount: number;
    joinedDate: string;
    avatar?: string;
    assignedClasses?: ClassAssignment[];
    paymentInfo?: TeacherPaymentInfo;
}

export interface TeacherPaymentInfo {
    totalEarned: number; // Total amount earned
    amountPaid: number; // Total amount paid
    balanceDue: number; // Remaining balance
    paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    note: string;
}

export interface ClassAssignment {
    id: string;
    name: string;
    grade: string;
    medium: string;
    subject: string;
}

export interface TeacherStat {
    label: string;
    value: string;
    status?: 'neutral' | 'success' | 'warning' | 'critical';
}
