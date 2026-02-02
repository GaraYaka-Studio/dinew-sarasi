export type ClassItem = {
  id: string;
  subject: string;
  grade: string;
  medium: 'Sinhala Med' | 'English Med' | 'Tamil Med';
  teacherName: string;
  schedule: {
    day: string;
    time: string;
  };
  fee: number;
  studentCount: number;
  status: 'Active' | 'Archived';
  category: 'Primary' | 'Junior' | 'Ordinary Level' | 'Advanced Level' | 'Other';
};

export const CLASS_DATA: ClassItem[] = [
  // Primary (Gr 1-5)
  {
    id: 'c1',
    subject: 'Mathematics',
    grade: 'Grade 3',
    medium: 'Sinhala Med',
    teacherName: 'Mrs. S. Perera',
    schedule: { day: 'Saturday', time: '08:00 AM' },
    fee: 1500,
    studentCount: 25,
    status: 'Active',
    category: 'Primary',
  },
  {
    id: 'c2',
    subject: 'Environment',
    grade: 'Grade 4',
    medium: 'English Med',
    teacherName: 'Ms. K. Silva',
    schedule: { day: 'Sunday', time: '10:00 AM' },
    fee: 1800,
    studentCount: 30,
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
    schedule: { day: 'Saturday', time: '02:00 PM' },
    fee: 2200,
    studentCount: 45,
    status: 'Active',
    category: 'Junior',
  },
  {
    id: 'c4',
    subject: 'Mathematics',
    grade: 'Grade 9',
    medium: 'Sinhala Med',
    teacherName: 'Mr. R. Bandara',
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
    schedule: { day: 'Saturday', time: '01:00 PM' },
    fee: 3000,
    studentCount: 20,
    status: 'Archived',
    category: 'Other',
  },
];
