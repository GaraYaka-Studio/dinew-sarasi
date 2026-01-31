'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { StudentStats } from '@/components/features/students/student-stats';
import { StudentFilters } from '@/components/features/students/student-filters';
import { StudentList } from '@/components/features/students/student-list';
import { StudentDialog } from '@/components/features/students/student-dialog';
import { StudentSheet } from '@/components/features/students/student-sheet';
import { Plus, BarChart3, Upload, Download } from 'lucide-react';
import type { Student } from '@/lib/mock-data';

export default function StudentsPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const handleViewStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header: Stats + Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Left: Mini Stats Grid (75% on Desktop, Hidden on Mobile) */}
                <div className="hidden lg:block lg:col-span-3">
                    <StudentStats />
                </div>

                {/* Right: Action Buttons (25% on Desktop, Hidden on Mobile) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="space-y-2">
                        {/* Add Student Button - Full width */}
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="w-full"
                            size="lg"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Student
                        </Button>

                        {/* Import/Export Row */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                                <Upload className="mr-2 h-3 w-3" />
                                Import
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-3 w-3" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile: Stats Icon Button (85% Add + 15% Stats) */}
                <div className="lg:hidden flex gap-2">
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="flex-1"
                        size="lg"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="lg" className="px-4">
                                <BarChart3 className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh]">
                            <SheetHeader>
                                <SheetTitle>Dashboard Overview</SheetTitle>
                                <SheetDescription>
                                    View student statistics and quick actions.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 py-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                                    <StudentStats />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Actions</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full">
                                            <Upload className="mr-2 h-3 w-3" />
                                            Import
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            <Download className="mr-2 h-3 w-3" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <StudentFilters />

            {/* Main Student List */}
            <StudentList onViewStudent={handleViewStudent} />

            {/* Add Student Dialog */}
            <StudentDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />

            {/* View/Edit Student Sheet */}
            <StudentSheet
                student={selectedStudent}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}
