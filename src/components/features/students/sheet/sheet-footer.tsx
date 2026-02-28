'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Student } from '@/types/schema.types';
import { deleteStudent } from '@/lib/db/delete';

interface SheetFooterProps {
    student: Student;
    onClose: () => void;
    onStudentAdded?: () => void;
}

export function SheetFooter({ student, onClose, onStudentAdded }: SheetFooterProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeactivate = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        deleteStudent(student);
        setIsDeleteDialogOpen(false);
        onClose();
        if (onStudentAdded) onStudentAdded();
    };

    const handleEdit = () => {
        // TODO: Implement edit profile logic
        console.log('Edit profile:', student.id);
    };

    return (
        <>
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to deactivate <strong>{student.full_name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Deactivate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
