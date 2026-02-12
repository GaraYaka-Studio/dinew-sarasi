export type SubjectCategory =
    | 'All'
    | 'Primary'
    | 'Junior'
    | 'Ordinary Level'
    | 'Advanced Level'
    | 'Other';

export interface TeacherInfo {
    name: string;
    initials: string;
}

export interface SubjectItem {
    id: string;
    name: string;
    code: string;
    category: SubjectCategory;
    grades: string[];
    teachers: TeacherInfo[];
}

export const SUBJECT_DATA: SubjectItem[] = [
    // Primary
    {
        id: 's1',
        name: 'Mathematics',
        code: 'MAT-P',
        category: 'Primary',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        teachers: [
            { name: 'Mrs. S. Perera', initials: 'SP' },
            { name: 'Ms. K. Silva', initials: 'KS' },
        ],
    },
    {
        id: 's2',
        name: 'English',
        code: 'ENG-P',
        category: 'Primary',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        teachers: [{ name: 'Mr. A. Fernando', initials: 'AF' }],
    },
    {
        id: 's3',
        name: 'Environment',
        code: 'ENV-P',
        category: 'Primary',
        grades: ['Grade 3', 'Grade 4', 'Grade 5'],
        teachers: [{ name: 'Ms. N. Jayasinghe', initials: 'NJ' }],
    },

    // Junior
    {
        id: 's4',
        name: 'Mathematics',
        code: 'MAT-J',
        category: 'Junior',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
        teachers: [
            { name: 'Mr. R. Bandara', initials: 'RB' },
            { name: 'Mrs. D. Gamage', initials: 'DG' },
        ],
    },
    {
        id: 's5',
        name: 'Science',
        code: 'SCI-J',
        category: 'Junior',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
        teachers: [{ name: 'Mr. A. Gunawardena', initials: 'AG' }],
    },
    {
        id: 's6',
        name: 'English',
        code: 'ENG-J',
        category: 'Junior',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
        teachers: [{ name: 'Ms. F. De Silva', initials: 'FD' }],
    },
    {
        id: 's7',
        name: 'Sinhala',
        code: 'SIN-J',
        category: 'Junior',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
        teachers: [{ name: 'Mr. P. Wijesinghe', initials: 'PW' }],
    },

    // Ordinary Level
    {
        id: 's8',
        name: 'Mathematics',
        code: 'MAT-OL',
        category: 'Ordinary Level',
        grades: ['Grade 10', 'Grade 11'],
        teachers: [
            { name: 'Mr. Kamal Perera', initials: 'KP' },
            { name: 'Mrs. D. Gamage', initials: 'DG' },
        ],
    },
    {
        id: 's9',
        name: 'Science',
        code: 'SCI-OL',
        category: 'Ordinary Level',
        grades: ['Grade 10', 'Grade 11'],
        teachers: [{ name: 'Mr. A. Gunawardena', initials: 'AG' }],
    },
    {
        id: 's10',
        name: 'English',
        code: 'ENG-OL',
        category: 'Ordinary Level',
        grades: ['Grade 10', 'Grade 11'],
        teachers: [
            { name: 'Ms. F. De Silva', initials: 'FD' },
            { name: 'Mr. T. Rajapaksa', initials: 'TR' },
        ],
    },

    // Advanced Level
    {
        id: 's11',
        name: 'Combined Mathematics',
        code: 'CMATH-AL',
        category: 'Advanced Level',
        grades: ['Grade 12', 'Grade 13'],
        teachers: [{ name: 'Mr. Kamal Perera', initials: 'KP' }],
    },
    {
        id: 's12',
        name: 'Physics',
        code: 'PHY-AL',
        category: 'Advanced Level',
        grades: ['Grade 12', 'Grade 13'],
        teachers: [{ name: 'Dr. T. Fernando', initials: 'TF' }],
    },
    {
        id: 's13',
        name: 'Chemistry',
        code: 'CHEM-AL',
        category: 'Advanced Level',
        grades: ['Grade 12', 'Grade 13'],
        teachers: [{ name: 'Mr. S. Rajapaksa', initials: 'SR' }],
    },
    {
        id: 's14',
        name: 'Biology',
        code: 'BIO-AL',
        category: 'Advanced Level',
        grades: ['Grade 12', 'Grade 13'],
        teachers: [{ name: 'Mrs. M. Gunasekara', initials: 'MG' }],
    },

    // Other
    {
        id: 's15',
        name: 'Elocution',
        code: 'ELO-GEN',
        category: 'Other',
        grades: ['General'],
        teachers: [{ name: 'Ms. F. De Silva', initials: 'FD' }],
    },
    {
        id: 's16',
        name: 'Robotics',
        code: 'ROB-GEN',
        category: 'Other',
        grades: ['Beginner', 'Intermediate'],
        teachers: [{ name: 'Mr. J. Wickramasinghe', initials: 'JW' }],
    },
];
