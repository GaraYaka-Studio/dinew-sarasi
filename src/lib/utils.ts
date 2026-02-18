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
}
