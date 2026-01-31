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

export function StudentSheet({
    student,
    isOpen,
    onOpenChange,
}: StudentSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[540px]">
                <SheetHeader>
                    <SheetTitle>
                        {student?.name || 'Student Profile'}
                    </SheetTitle>
                    <SheetDescription>
                        {student?.studentId ||
                            'View and edit student information'}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100">
                        <p className="text-sm text-muted-foreground">
                            Avatar Section
                        </p>
                    </div>
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-100">
                        <p className="text-sm text-muted-foreground">
                            Student Details
                        </p>
                    </div>
                    <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100">
                        <p className="text-sm text-muted-foreground">
                            Actions & Status
                        </p>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                        Student Profile Details coming soon...
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
