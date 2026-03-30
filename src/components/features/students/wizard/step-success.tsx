'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { IDCard } from '../id-card';

interface StepSuccessProps {
    studentData: {
        name: string;
        studentId: string; // UUID
        serialId: number; // Serial number from database
        qrCode: string; // QR code string
    };
    onPrintId?: () => void;
    onAddAnother: () => void;
    onClose: () => void;
}

export function StepSuccess({
    studentData,
    onPrintId,
    onAddAnother,
    onClose,
}: StepSuccessProps) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 py-8">
            {/* Success Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            {/* Success Message */}
            <div className="text-center">
                <h2 className="text-2xl font-bold">Registration Successful!</h2>
                <p className="mt-2 text-muted-foreground">
                    Student has been added to the system.
                </p>
            </div>

            {/* ID Card Preview */}
            <IDCard
                student={{
                    fullName: studentData.name,
                    studentId: String(studentData.serialId),
                    qrCode: studentData.qrCode,
                }}
            />

            {/* Action Buttons */}
            <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
                <Button
                    onClick={onAddAnother}
                    variant="outline"
                    className="flex-1"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Another
                </Button>
            </div>

            <Button onClick={onClose} variant="ghost" size="sm">
                Close
            </Button>
        </div>
    );
}
