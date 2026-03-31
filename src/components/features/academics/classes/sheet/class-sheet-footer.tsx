'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { ClassWithDetails } from '@/lib/db/transformers';
import { deleteClass } from '@/lib/db/delete';
import { Class } from '@/types/schema.types';

interface ClassSheetFooterProps {
    classItem: ClassItem;
    classData: ClassWithDetails | null;
    onClose: () => void;
    onClassUpdated?: () => void;
    onEditClass?: () => void;
}

export function ClassSheetFooter({
    classItem,
    classData,
    onClose,
    onClassUpdated,
    onEditClass,
}: ClassSheetFooterProps) {
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

    const handleArchive = () => {
        setIsArchiveDialogOpen(true);
    };

    const confirmArchive = async () => {
        if (classData) {
            // Create minimal Class object for delete function
            const classObj: Class = {
                id: classData.id,
                name: classData.name,
                grade: classData.grade,
                medium: classData.medium || 'sinhala',
                type: classData.type || 'theory',
                subject_id: classData.subjectId,
                teacher_id: classData.teacherId,
                academic_year_id: null,
                day: classData.day,
                start_time: classData.startTime,
                end_time: classData.endTime,
                hall_name: classData.hallName,
                monthly_fee: classData.monthlyFee || '0',
                is_active: classData.isActive ?? false,
                deleted_at: null,
            };

            try {
                await deleteClass(classObj);
                toast.success('Class archived successfully');
                setIsArchiveDialogOpen(false);
                onClose();
                if (onClassUpdated) onClassUpdated();
            } catch (error) {
                console.error('Failed to archive class:', error);
                toast.error('Failed to archive class');
            }
        }
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

            <AlertDialog
                open={isArchiveDialogOpen}
                onOpenChange={setIsArchiveDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive Class?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to archive{' '}
                            <strong>
                                {classItem.subject} - {classItem.grade}
                            </strong>
                            ? This can be undone later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmArchive}
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                        >
                            Archive
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
