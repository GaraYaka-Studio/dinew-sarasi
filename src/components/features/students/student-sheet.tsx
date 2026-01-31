'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { Student } from '@/lib/mock-data';

interface StudentSheetProps {
    student: Student | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentSheet({ student, isOpen, onOpenChange }: StudentSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[540px]">
                <SheetHeader>
                    <SheetTitle>
                        {student?.name || 'Student Profile'}
                    </SheetTitle>
                    <SheetDescription>
                        {student?.studentId || 'View and edit student information'}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Avatar Section</p>
                    </div>
                    <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Student Details</p>
                    </div>
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Actions & Status</p>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                        Student Profile Details coming soon...
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
