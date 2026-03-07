'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Printer, UserPlus, Receipt, X } from 'lucide-react';
import { ReceiptView, ReceiptItem } from '@/components/features/payments/collect/receipt-view';

interface StepSuccessProps {
    studentData: {
        name: string;
        studentId: string; // UUID
        serialId: number;  // Serial number from database
        qrCode: string;    // QR code string
    };
    paymentData?: {
        paymentMode: 'later' | 'now' | 'free';
        selectedMonths: Map<string, number[]>; // classId -> array of month indices
        admissionFee: number;
        monthlyFees: number;
        total: number;
        grade: string;
        classNames?: Map<string, string>; // classId -> class name
    };
    onPrintId: () => void;
    onAddAnother: () => void;
    onClose: () => void;
}

const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function StepSuccess({
    studentData,
    paymentData,
    onPrintId,
    onAddAnother,
    onClose,
}: StepSuccessProps) {
    const [showReceipt, setShowReceipt] = useState(false);

    // Format the display ID (e.g., SRS-2025-001)
    const displayId = studentData.serialId
        ? `SRS-${new Date().getFullYear()}-${String(studentData.serialId).padStart(3, '0')}`
        : 'Pending...';

    // Check if payment was made
    const hasPayment = paymentData && (paymentData.paymentMode === 'now' || paymentData.selectedMonths.size > 0);

    // Generate receipt items
    const getReceiptItems = (): ReceiptItem[] => {
        if (!paymentData) return [];

        const items: ReceiptItem[] = [];

        // Admission fee
        if (paymentData.paymentMode === 'now') {
            items.push({
                label: 'Admission Fee',
                amount: paymentData.admissionFee,
            });
        }

        // Monthly fees
        paymentData.selectedMonths.forEach((months, classId) => {
            const className = paymentData.classNames?.get(classId) || `Class (${classId.slice(-4)})`;
            months.forEach(monthIndex => {
                const classMonthlyFee = paymentData.monthlyFees / months.length || 0;
                items.push({
                    label: `${className} - ${MONTH_LABELS[monthIndex]} ${new Date().getFullYear()}`,
                    amount: classMonthlyFee,
                });
            });
        });

        return items;
    };

    // Generate receipt number (timestamp-based for new registrations)
    const receiptNumber = `RCP-${new Date().getTime().toString().slice(-6)}`;

    const handlePrintReceipt = () => {
        setShowReceipt(true);
    };

    // If showing receipt, render receipt view inline
    if (showReceipt && hasPayment) {
        return (
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-10"
                    onClick={() => setShowReceipt(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
                <div className="flex min-h-[500px] items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <ReceiptView
                            receiptNumber={receiptNumber}
                            studentName={studentData.name}
                            studentId={displayId}
                            grade={paymentData!.grade}
                            items={getReceiptItems()}
                            totalAmount={paymentData!.total}
                            cashReceived={paymentData!.total}
                            balance={0}
                            date={new Date().toISOString()}
                            onClose={() => setShowReceipt(false)}
                            onPrint={() => {
                                window.print();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

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
                {hasPayment && (
                    <Button
                        onClick={handlePrintReceipt}
                        variant="default"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        <Receipt className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                )}
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
