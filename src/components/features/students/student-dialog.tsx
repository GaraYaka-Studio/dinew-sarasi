'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface StudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentDialog({ isOpen, onOpenChange }: StudentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Complete the registration wizard to add a new student.
                    </DialogDescription>
                </DialogHeader>
                <div className="min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                        Stepper Wizard implementation coming soon...
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
