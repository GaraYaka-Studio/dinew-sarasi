'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Printer, UserPlus } from 'lucide-react';

interface StepSuccessProps {
    studentData: {
        name: string;
        studentId: string; // UUID
        serialId: number;  // Serial number from database
        qrCode: string;    // QR code string
    };
    onPrintId: () => void;
    onAddAnother: () => void;
    onClose: () => void;
}

export function StepSuccess({
    studentData,
    onPrintId,
    onAddAnother,
    onClose,
}: StepSuccessProps) {
    // Format the display ID (e.g., SRS-2025-001)
    const displayId = studentData.serialId
        ? `SRS-${new Date().getFullYear()}-${String(studentData.serialId).padStart(3, '0')}`
        : 'Pending...';

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
            <Card className="w-full max-w-sm border-2">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-2xl font-bold text-primary">
                                    {studentData.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold">
                                {studentData.name}
                            </h3>
                            <p className="text-lg font-semibold text-primary">
                                {displayId}
                            </p>
                        </div>

                        {/* QR Code Display */}
                        <div className="flex justify-center">
                            <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                                <p className="text-xs text-muted-foreground text-center px-2">
                                    {studentData.qrCode || 'QR Code'}
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                            ID Card Preview - Print for student records
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
                <Button onClick={onPrintId} className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Print ID Card
                </Button>
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
