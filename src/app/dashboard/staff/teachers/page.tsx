'use client';

import { useState, useMemo, useEffect } from 'react';

import { getClasses, getTeacherClasses, getTeacherPayments, getTeachers } from '@/lib/db/select';

import { Plus, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TeacherStats } from '@/components/features/staff/teacher-stats';
import { TeacherFilters } from '@/components/features/staff/teacher-filters';
import { TeacherListDesktop } from '@/components/features/staff/teacher-list-desktop';
import { TeacherListMobile } from '@/components/features/staff/teacher-list-mobile';
import { TeacherDialog } from '@/components/features/staff/teacher-dialog';
import { TeacherSheet } from '@/components/features/staff/teacher-sheet';

import { Teacher, TeacherPayment } from '@/types/schema.types';
import { Class } from '@/types/schema.types';

export default function TeachersPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
    const [teacherPayments, setTeacherPayments] = useState<TeacherPayment[]>([]);

    // Filter teachers based on search and subject
    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher) => {
            const matchesSearch =
                !searchQuery ||
                teacher.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                teacher.nic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.phone?.includes(searchQuery);

            const matchesSubject =
                selectedSubject === 'all' ||
                teacher.subjects?.includes(selectedSubject);

            return matchesSearch && matchesSubject;
        });
    }, [teachers, searchQuery, selectedSubject]);

    const handleViewTeacher = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsSheetOpen(true);
    };

    useEffect(() => {
        getTeachers().then(setTeachers);
        getClasses().then(setClasses);

        if (selectedTeacher !== null) {
            getTeacherClasses(selectedTeacher).then(setTeacherClasses);
            getTeacherPayments(selectedTeacher).then(setTeacherPayments);
        }
    }, [selectedTeacher]);

    return (
        <div className="space-y-6">
            {/* Header: Title + Stats + Actions */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                {/* Left: Mini Stats Grid (75% on Desktop) */}
                <div className="hidden lg:col-span-3 lg:block">
                    <TeacherStats teachers={teachers} classes={classes} />
                </div>

                {/* Right: Action Buttons (25% on Desktop) */}
                <div className="hidden lg:col-span-1 lg:block">
                    <div className="space-y-2">
                        {/* Add Teacher Button - Full width */}
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="w-full"
                            size="lg"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Teacher
                        </Button>

                        {/* Export Button */}
                        <Button variant="outline" className="w-full" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Export List
                        </Button>
                    </div>
                </div>

                {/* Mobile: Add Teacher Button + Stats */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {/* Full-width Add Teacher Button */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        size="lg"
                        className="w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Teacher
                    </Button>

                    {/* Stats Cards */}
                    <TeacherStats teachers={teachers} classes={classes} />
                </div>
            </div>

            {/* Search & Filter Bar */}
            <TeacherFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
            />

            {/* Desktop Table */}
            <TeacherListDesktop
                teachers={filteredTeachers}
                classes={classes}
                onViewTeacher={handleViewTeacher}
            />

            {/* Mobile Cards */}
            <TeacherListMobile
                teachers={filteredTeachers}
                classes={classes}
                onViewTeacher={handleViewTeacher}
            />

            {/* Add Teacher Dialog */}
            <TeacherDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />

            {/* View Teacher Sheet */}
            <TeacherSheet
                teacher={selectedTeacher}
                classes={teacherClasses}
                payments={teacherPayments}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}
