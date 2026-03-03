import { SubjectCategory } from '@/types/constants.types';

export const TEACHING_SUBJECTS = [
    'Mathematics',
    'Science',
    'Biology',
    'Physics',
    'Chemistry',
    'English',
    'Sinhala',
    'Tamil',
    'History',
    'Geography',
    'Commerce',
    'Economics',
    'Accounting',
    'ICT',
    'Art',
    'Music',
    'Physical Education',
    'Sports',
    'Literature',
    'General Knowledge',
];

export const GRADES = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);

export const SECTIONS = [
    { value: 'primary', label: 'Primary (1-5)' },
    { value: 'junior', label: 'Junior (6-9)' },
    { value: 'ol', label: 'Ordinary Level (10-11)' },
    { value: 'al', label: 'Advanced Level (12-13)' },
];

export const CATEGORIES: SubjectCategory[] = [
    'All',
    'Primary',
    'Junior',
    'Ordinary Level',
    'Advanced Level',
    'Other',
];

export const DAYS = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];
