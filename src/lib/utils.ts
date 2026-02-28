import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getInitials = (fullName: string) => {
    if (!fullName) return '';

    const words = fullName.trim().split(/\s+/);
    const initials = words.map(word => word.charAt(0).toUpperCase());

    return initials.join('');
};

/**
 * Calculate batch/exam year based on student's grade
 * - Grades 1-5: Returns 0 (Scholarship)
 * - Grades 6-11: Returns O/L year
 * - Grade 12: Returns A/L year (current + 1)
 * - Grade 13: Returns A/L year (current)
 */
export function calculateBatchYear(grade: string): { display: string; value: number } {
    const currentYear = new Date().getFullYear();
    const gradeNum = parseInt(grade.replace(/\D/g, '')) || 0;

    // Grades 1-5 → Scholarship (store as 0 in DB)
    if (gradeNum >= 1 && gradeNum <= 5) {
        return { display: 'Scholarship', value: 0 };
    }

    // Grades 6-11 → O/L year
    if (gradeNum >= 6 && gradeNum <= 11) {
        const olYear = currentYear + (11 - gradeNum);
        return { display: `${olYear} O/L`, value: olYear };
    }

    // Grade 12 → A/L next year (1st year of A/L)
    if (gradeNum === 12) {
        const alYear = currentYear + 1;
        return { display: `${alYear} A/L`, value: alYear };
    }

    // Grade 13 → A/L this year (2nd year of A/L)
    if (gradeNum === 13) {
        return { display: `${currentYear} A/L`, value: currentYear };
    }

    // Default fallback
    return { display: `${currentYear}`, value: currentYear };
}
