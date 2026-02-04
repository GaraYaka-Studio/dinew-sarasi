export type ClassItem = {
    id: string;
    subject: string;
    grade: string;
    medium: 'Sinhala Med' | 'English Med' | 'Tamil Med';
    teacherName: string;
    // Extended details for Sheet
    teacher?: {
        id: string;
        image?: string;
        phone: string;
        email: string;
    };
    schedule: {
        day: string;
        time: string;
    };
    fee: number;
    studentCount: number;
    // Extended details for Sheet
    students?: {
        id: string;
        name: string;
        image?: string;
        paymentStatus: 'Paid' | 'Pending' | 'Overdue';
    }[];
    status: 'Active' | 'Archived';
    category:
        | 'Primary'
        | 'Junior'
        | 'Ordinary Level'
        | 'Advanced Level'
        | 'Other';
};

export const CLASS_DATA: ClassItem[] = [
    // Primary (Gr 1-5)
    {
        id: 'c1',
        subject: 'Mathematics',
        grade: 'Grade 3',
        medium: 'Sinhala Med',
        teacherName: 'Mrs. S. Perera',
        teacher: {
            id: 't1',
            phone: '071 234 5678',
            email: 's.perera@example.com'
        },
        schedule: { day: 'Saturday', time: '08:00 AM' },
        fee: 1500,
        studentCount: 25,
        students: Array(25).fill(null).map((_, i) => ({
             id: `s${i}`,
             name: `Student ${i + 1}`,
             paymentStatus: i % 3 === 0 ? 'Pending' : 'Paid'
        })),
        status: 'Active',
        category: 'Primary',
    },
    {
        id: 'c2',
        subject: 'Environment',
        grade: 'Grade 4',
        medium: 'English Med',
        teacherName: 'Ms. K. Silva',
         teacher: {
            id: 't2',
            phone: '077 123 4567',
            email: 'k.silva@example.com'
        },
        schedule: { day: 'Sunday', time: '10:00 AM' },
        fee: 1800,
        studentCount: 30,
        students: Array(30).fill(null).map((_, i) => ({
             id: `s${i}`,
             name: `Student ${i + 1}`,
             paymentStatus: 'Paid'
        })),
        status: 'Active',
        category: 'Primary',
    },

    // Junior (Gr 6-9)
    {
        id: 'c3',
        subject: 'Science',
        grade: 'Grade 8',
        medium: 'English Med',
        teacherName: 'Mr. A. Gunawardena',
        teacher: {
            id: 't3',
            phone: '070 111 2222',
            email: 'a.guna@example.com'
        },
        schedule: { day: 'Saturday', time: '02:00 PM' },
        fee: 2200,
        studentCount: 45,
        students: Array(45).fill(null).map((_, i) => ({
             id: `s${i}`,
             name: `Student ${i + 1}`,
             paymentStatus: i % 5 === 0 ? 'Overdue' : 'Paid'
        })),
        status: 'Active',
        category: 'Junior',
    },
    {
        id: 'c4',
        subject: 'Mathematics',
        grade: 'Grade 9',
        medium: 'Sinhala Med',
        teacherName: 'Mr. R. Bandara',
        teacher: {
            id: 't4',
            phone: '076 999 8888',
            email: 'r.bandara@example.com'
        },
        schedule: { day: 'Monday', time: '03:30 PM' },
        fee: 2000,
        studentCount: 50,
        status: 'Active',
        category: 'Junior',
    },

    // Ordinary Level (Gr 10-11)
    {
        id: 'c5',
        subject: 'Mathematics',
        grade: 'Grade 11',
        medium: 'English Med',
        teacherName: 'Mr. Kamal Perera',
        teacher: {
            id: 't5',
            phone: '071 555 6666',
            email: 'k.perera@example.com'
        },
        schedule: { day: 'Saturday', time: '08:30 AM' },
        fee: 2500,
        studentCount: 120,
        status: 'Active',
        category: 'Ordinary Level',
    },
    {
        id: 'c6',
        subject: 'Science',
        grade: 'Grade 10',
        medium: 'Sinhala Med',
        teacherName: 'Mrs. D. Gamage',
        teacher: {
            id: 't6',
            phone: '072 222 3333',
            email: 'd.gamage@example.com'
        },
        schedule: { day: 'Sunday', time: '04:00 PM' },
        fee: 2500,
        studentCount: 95,
        status: 'Active',
        category: 'Ordinary Level',
    },

    // Advanced Level (Gr 12-13)
    {
        id: 'c7',
        subject: 'Physics',
        grade: 'Grade 12 (2027)',
        medium: 'English Med',
        teacherName: 'Dr. T. Fernando',
        teacher: {
            id: 't7',
            phone: '077 777 7777',
            email: 't.fernando@example.com'
        },
        schedule: { day: 'Sunday', time: '07:30 AM' },
        fee: 3500,
        studentCount: 200,
        status: 'Active',
        category: 'Advanced Level',
    },
    {
        id: 'c8',
        subject: 'Chemistry',
        grade: 'Grade 13 (2026)',
        medium: 'Sinhala Med',
        teacherName: 'Mr. S. Rajapaksa',
        teacher: {
            id: 't8',
            phone: '075 555 4444',
            email: 's.rajapaksa@example.com'
        },
        schedule: { day: 'Friday', time: '03:00 PM' },
        fee: 3500,
        studentCount: 180,
        status: 'Active',
        category: 'Advanced Level',
    },

    // Other / General
    {
        id: 'c9',
        subject: 'Elocution',
        grade: 'General',
        medium: 'English Med',
        teacherName: 'Ms. F. De Silva',
        teacher: {
            id: 't9',
            phone: '071 111 0000',
            email: 'f.desilva@example.com'
        },
        schedule: { day: 'Wednesday', time: '04:00 PM' },
        fee: 2000,
        studentCount: 15,
        status: 'Active',
        category: 'Other',
    },
    {
        id: 'c10',
        subject: 'Robotics',
        grade: 'Beginner',
        medium: 'English Med',
        teacherName: 'Mr. J. Wickramasinghe',
        teacher: {
            id: 't10',
            phone: '076 666 5555',
            email: 'j.wick@example.com'
        },
        schedule: { day: 'Saturday', time: '01:00 PM' },
        fee: 3000,
        studentCount: 20,
        status: 'Archived',
        category: 'Other',
    },
];
