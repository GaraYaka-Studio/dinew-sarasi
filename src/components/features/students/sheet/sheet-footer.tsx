'use client';

import { Button } from '@/components/ui/button';
import { Student } from '@/types/schema.types';

interface SheetFooterProps {
    student: Student;
    onClose: () => void;
}

export function SheetFooter({ student }: SheetFooterProps) {
    const handleDeactivate = () => {
        // TODO: Implement deactivate logic
        console.log('Deactivate student:', student.id);
    };

    const handleEdit = () => {
        // TODO: Implement edit profile logic
        console.log('Edit profile:', student.id);
    };

    return (
        <div className="flex items-center justify-between border-t pt-4">
            <Button
                variant="ghost"
                onClick={handleDeactivate}
                className="text-destructive hover:bg-destructive/10"
            >
                Deactivate
            </Button>

            <Button onClick={handleEdit}>Edit Profile</Button>
        </div>
    );
}
