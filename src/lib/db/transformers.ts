import { Class } from '@/types/schema.types';
import { ClassItem } from '@/lib/mock-data-classes';

export type ClassWithDetails = {
    id: string;
    name: string;
    grade: string;
    medium: 'sinhala' | 'english' | 'tamil' | null;
    type: 'theory' | 'revision' | 'paper' | null;
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null;
    startTime: string | null;
    endTime: string | null;
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
