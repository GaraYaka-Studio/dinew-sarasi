'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Student } from '@/types/schema.types';

interface TabClassesProps {
    student: Student;
}

export function TabClasses({ student }: TabClassesProps) {
    const handleEnrollClass = () => {
        // TODO: Implement enroll logic
        console.log('Enroll new class for:', student.id);
    };

    return (
        <div className="space-y-4">
            {/* Enrolled Classes */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Enrolled Classes
                </h3>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        No classes enrolled yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Enroll this student in classes to track their progress
                    </p>
                </div>
            </div>

            {/* Enroll Button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={handleEnrollClass}
            >
                <Plus className="mr-2 h-4 w-4" />
                Enroll New Class
            </Button>
        </div>
    );
}
