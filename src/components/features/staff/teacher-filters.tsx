'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TEACHER_SUBJECTS } from '@/lib/mock-data-teachers';

interface TeacherFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedSubject: string;
    onSubjectChange: (value: string) => void;
}

export function TeacherFilters({
    searchQuery,
    onSearchChange,
    selectedSubject,
    onSubjectChange,
}: TeacherFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by Name, NIC, or Phone..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Subject Filter Dropdown */}
            <Select value={selectedSubject} onValueChange={onSubjectChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {TEACHER_SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                            {subject}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
