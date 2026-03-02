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
import { ClassItem } from '@/lib/mock-data-classes';

interface ClassSheetFooterProps {
    classItem: ClassItem;
    onClose: () => void;
    onClassUpdated?: () => void;
    onEditClass?: () => void;
}

export function ClassSheetFooter({
    classItem,
    onClose,
    onClassUpdated,
    onEditClass,
}: ClassSheetFooterProps) {
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

    const handleArchive = () => {
        setIsArchiveDialogOpen(true);
    };

    const confirmArchive = () => {
        // TODO: Implement soft delete
        setIsArchiveDialogOpen(false);
        onClose();
        if (onClassUpdated) onClassUpdated();
    };

    const handleEdit = () => {
        onClose(); // Close the sheet first
        if (onEditClass) onEditClass();
    };

    return (
        <>
            <div className="flex items-center justify-between border-t pt-4">
                <Button
                    variant="ghost"
                    onClick={handleArchive}
                    className="text-destructive hover:bg-destructive/10"
                >
                    Archive Class
                </Button>

                <Button onClick={handleEdit}>Edit Profile</Button>
            </div>

            <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive Class?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to archive{' '}
                            <strong>{classItem.subject} - {classItem.grade}</strong>?
                            This can be undone later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmArchive}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Archive
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
