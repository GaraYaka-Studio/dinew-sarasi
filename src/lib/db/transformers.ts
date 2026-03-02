import { Class } from '@/types/schema.types';
import { ClassItem } from '@/lib/mock-data-classes';
import { StudentDetail, ClassFeeStructure, FeeMonth } from '@/lib/mock-data';
import { Student } from '@/types/schema.types';

export type ClassWithDetails = {
    id: string;
    name: string;
    grade: string;
    medium: 'sinhala' | 'english' | 'tamil' | null;
    type: 'theory' | 'revision' | 'paper' | null;
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null;
    startTime: string | null;
    endTime: string | null;
    hallName: string | null;
    monthlyFee: string | null;
    isActive: boolean | null;
    subjectId: string | null;
    subjectName: string | null;
    subjectCategory: string | null;
    teacherId: string | null;
    teacherName: string | null;
    teacherPhone: string | null;
    studentCount?: number;
};

export function transformToClassItem(
    dbClass: ClassWithDetails
): ClassItem {
    // Map medium enum to display format
    const mediumMap: Record<'sinhala' | 'english' | 'tamil', ClassItem['medium']> = {
        sinhala: 'Sinhala Med',
        english: 'English Med',
        tamil: 'Tamil Med',
    };

    // Determine category from subject category or grade
    const category = determineCategory(dbClass.grade, dbClass.subjectCategory);

    // Format schedule
    const schedule = formatSchedule(dbClass.day, dbClass.startTime, dbClass.endTime);

    return {
        id: dbClass.id,
        subject: dbClass.subjectName || dbClass.name,
        grade: dbClass.grade,
        medium: dbClass.medium ? mediumMap[dbClass.medium] : 'Sinhala Med',
        teacherName: dbClass.teacherName || 'Not Assigned',
        teacher: dbClass.teacherName ? {
            id: dbClass.teacherId || '',
            phone: dbClass.teacherPhone || '',
            email: '',
        } : undefined,
        schedule,
        fee: Number(dbClass.monthlyFee) || 0,
        studentCount: dbClass.studentCount || 0,
        status: dbClass.isActive ? 'Active' : 'Archived',
        category,
    };
}

function determineCategory(grade: string, subjectCategory?: string | null): ClassItem['category'] {
    if (subjectCategory) {
        const categoryLower = subjectCategory.toLowerCase();
        if (categoryLower.includes('primary')) return 'Primary';
        if (categoryLower.includes('junior')) return 'Junior';
        if (categoryLower.includes('ol') || categoryLower.includes('ordinary')) return 'Ordinary Level';
        if (categoryLower.includes('al') || categoryLower.includes('advanced')) return 'Advanced Level';
    }

    // Fallback to grade-based detection
    const gradeLower = grade.toLowerCase();
    // Primary grades 1-5
    if (/(gr|grade)?\s*[1-5]/.test(gradeLower)) return 'Primary';
    // Junior grades 6-9
    if (/(gr|grade)?\s*[6-9]/.test(gradeLower)) return 'Junior';
    // O/L grades 10-11
    if (/(gr|grade)?\s*(10|11)|ol/.test(gradeLower)) return 'Ordinary Level';
    // A/L grades 12-13
    if (/(gr|grade)?\s*(12|13)|al/.test(gradeLower)) return 'Advanced Level';

    return 'Other';
}

function formatSchedule(
    day: string | null,
    startTime: string | null,
    endTime: string | null
): { day: string; time: string } {
    const dayName = day
        ? day.charAt(0).toUpperCase() + day.slice(1)
        : 'TBD';

    const time = startTime && endTime
        ? `${formatTime(startTime)} - ${formatTime(endTime)}`
        : 'TBD';

    return { day: dayName, time };
}

function formatTime(time: string): string {
    // Convert "14:00:00" to "2:00 PM"
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;
}

// =====================================================
// Payment/Collect Transformers
// =====================================================

export interface StudentFeeStructureData {
    classId: string;
    className: string;
    monthlyFee: number;
    months: FeeMonth[];
}

export interface StudentSearchResult {
    id: string;
    studentId: number;
    fullName: string;
    initials: string | null;
    phone: string;
    grade: string | null;
    batchYear: number | null;
    status: 'active' | 'inactive' | 'graduated' | 'suspended' | null;
    admissionStatus: 'pending' | 'paid' | 'free' | null;
    admissionFee: string | null;
    dob: string | null;  // Date from DB is returned as string
    gender: 'male' | 'female';
    address: string | null;
    school: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianRelationship: string | null;
    qrCode: string | null;
    lastModifiedAt: Date | null;
    createdAt: Date | null;
}

/**
 * Transform database fee structure result to UI-expected format
 */
export function transformToFeeStructure(
    dbResult: StudentFeeStructureData[]
): ClassFeeStructure[] {
    return dbResult.map((cls) => ({
        classId: cls.classId,
        className: cls.className,
        monthlyFee: cls.monthlyFee,
        months: cls.months,
    }));
}

/**
 * Transform student database result to mock-data StudentDetail format
 */
export function transformToStudentDetail(
    dbStudent: StudentSearchResult & {
        enrolledClasses?: StudentFeeStructureData[];
    }
): StudentDetail {
    return {
        // Base Info
        id: dbStudent.id,
        name: dbStudent.fullName,
        studentId: `SRS-${dbStudent.studentId}`,
        phone: dbStudent.phone,
        grade: dbStudent.grade || 'N/A',
        batch: dbStudent.batchYear
            ? `${dbStudent.batchYear} A/L`
            : 'General',
        status: dbStudent.status === 'active' ? 'active' :
                dbStudent.status === 'graduated' ? 'left' :
                dbStudent.status === 'suspended' ? 'draft' :
                'active',
        paymentStatus: dbStudent.status === 'active' ? 'paid' : 'draft',
        initials: dbStudent.initials || 'ST',
        lastActivity: 'Active now',
        admissionDate: dbStudent.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],

        // Personal Details
        dateOfBirth: dbStudent.dob || '',
        gender: dbStudent.gender === 'male' ? 'Male' : 'Female',
        address: dbStudent.address || '',
        school: dbStudent.school || '',

        // Guardian
        guardian: {
            name: dbStudent.guardianName || '',
            relationship: (dbStudent.guardianRelationship || 'Father') as 'Father' | 'Mother' | 'Guardian',
            phone: dbStudent.guardianPhone || '',
            isEmergencyContact: true,
        },

        // Academic
        olYear: dbStudent.batchYear ?? undefined,
        alYear: dbStudent.batchYear ?? undefined,

        // Financial
        admissionStatus: (dbStudent.admissionStatus === 'free' ? 'PAID' : dbStudent.admissionStatus?.toUpperCase()) as 'PENDING' | 'PAID',
        admissionFee: Number(dbStudent.admissionFee) || 1000,
        arrears: 0, // Can be calculated from unpaid fees
        paymentHistory: [], // Can be fetched separately if needed

        // Attendance
        attendanceRate: 0, // Can be calculated from attendance records
        attendanceHistory: [],

        // Enrolled Classes
        enrolledClasses: dbStudent.enrolledClasses?.map((c) => ({
            id: c.classId,
            name: c.className,
            grade: '',
            teacher: '',
            schedule: '',
        })) || [],
    };
}
