'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    AlertCircle,
    Receipt,
    Calendar,
    Loader2,
    Eye,
    ArrowLeft,
} from 'lucide-react';
import { Student } from '@/types/schema.types';
import { getStudentPayments } from '@/lib/db/select';
import {
    ReceiptView,
    ReceiptItem,
} from '@/components/features/payments/collect/receipt-view';

interface TabPaymentsProps {
    student: Student;
}

interface PaymentItem {
    itemId: string;
    itemType: 'monthly' | 'admission' | 'exam' | 'material';
    itemClassId: string | null;
    itemMonthIndex: number | null;
    itemYear: number | null;
    itemAmount: string;
    className: string | null;
    classGrade: string | null;
}

interface Payment {
    paymentId: string;
    receiptNumber: number;
    totalAmount: string;
    method: 'cash' | 'card' | 'bank_transfer';
    paymentDate: Date;
    items: PaymentItem[];
}

const MONTH_LABELS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

function formatPaymentMethod(
    method: 'cash' | 'card' | 'bank_transfer'
): string {
    switch (method) {
        case 'cash':
            return 'Cash';
        case 'card':
            return 'Card';
        case 'bank_transfer':
            return 'Bank Transfer';
        default:
            return method;
    }
}

function formatPaymentDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatMonthYear(
    monthIndex: number | null,
    year: number | null
): string {
    if (monthIndex === null || year === null) return '-';
    return `${MONTH_LABELS[monthIndex]} ${year}`;
}

// Helper function to convert payment data to receipt format
function paymentToReceiptData(payment: Payment, student: Student) {
    // Format student serial ID (e.g., SRS-2025-001)
    const currentYear = new Date().getFullYear();
    const displayId = student.student_id
        ? `SRS-${currentYear}-${String(student.student_id).padStart(3, '0')}`
        : 'N/A';

    // Convert payment items to receipt items
    const items: ReceiptItem[] = payment.items.map((item) => {
        let label = '';

        switch (item.itemType) {
            case 'admission':
                label = 'Admission Fee';
                break;
            case 'monthly':
                label = `${item.className || 'Class'} - ${MONTH_LABELS[item.itemMonthIndex ?? 0]} ${item.itemYear ?? currentYear}`;
                break;
            case 'exam':
                label = `Exam Fee - ${item.className || 'Class'}`;
                break;
            case 'material':
                label = `Material Fee - ${item.className || 'Class'}`;
                break;
            default:
                label = 'Fee';
        }

        return {
            label,
            amount: Number(item.itemAmount),
        };
    });

    // If no items, add a generic payment item
    if (items.length === 0) {
        items.push({
            label: 'Payment',
            amount: Number(payment.totalAmount),
        });
    }

    return {
        receiptNumber: payment.receiptNumber.toString(),
        studentName: student.full_name,
        studentId: displayId,
        grade: student.current_grade || 'N/A',
        items,
        totalAmount: Number(payment.totalAmount),
        cashReceived: Number(payment.totalAmount),
        balance: 0,
        date:
            payment.paymentDate instanceof Date
                ? payment.paymentDate.toISOString()
                : new Date(payment.paymentDate).toISOString(),
    };
}

export function TabPayments({ student }: TabPaymentsProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );

    const hasAdmissionPending = student.admission_status === 'pending';
    const admissionFee = Number(student.admission_fee) || 1000; // Default to 1000 if not set

    useEffect(() => {
        async function loadPayments() {
            if (!student.id) return;

            setIsLoading(true);
            setError(null);
            setSelectedPayment(null); // Reset selected payment when student changes

            try {
                const result = await getStudentPayments(student.id);

                // Group payment items by payment
                const paymentMap = new Map<string, Payment>();

                for (const row of result) {
                    const paymentId = row.paymentId;

                    if (!paymentMap.has(paymentId)) {
                        paymentMap.set(paymentId, {
                            paymentId: row.paymentId,
                            receiptNumber: row.receiptNumber,
                            totalAmount: row.totalAmount,
                            method: row.method ?? 'cash',
                            paymentDate: row.paymentDate ?? new Date(),
                            items: [],
                        });
                    }

                    // Add payment item if exists (some payments might not have items in edge cases)
                    if (row.itemId) {
                        paymentMap.get(paymentId)!.items.push({
                            itemId: row.itemId,
                            itemType: row.itemType as
                                | 'monthly'
                                | 'admission'
                                | 'exam'
                                | 'material',
                            itemClassId: row.itemClassId,
                            itemMonthIndex: row.itemMonthIndex,
                            itemYear: row.itemYear,
                            itemAmount: row.itemAmount ?? '0',
                            className: row.className ?? null,
                            classGrade: row.classGrade ?? null,
                        });
                    }
                }

                setPayments(Array.from(paymentMap.values()));
            } catch (err) {
                console.error('Failed to load payments:', err);
                setError('Failed to load payment history');
            } finally {
                setIsLoading(false);
            }
        }

        loadPayments();
    }, [student.id]);

    const handleSettleAdmission = () => {
        // TODO: Open payment dialog for admission fee
        console.log('Settle admission fee for student:', student.id);
    };

    // If viewing a receipt, render receipt view
    if (selectedPayment) {
        const receiptData = paymentToReceiptData(selectedPayment, student);

        return (
            <div className="space-y-4">
                {/* Back Button Header */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPayment(null)}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Payments
                    </Button>
                </div>

                {/* Receipt View */}
                <div className="flex min-h-[500px] items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <ReceiptView
                            receiptNumber={receiptData.receiptNumber}
                            studentName={receiptData.studentName}
                            studentId={receiptData.studentId}
                            grade={receiptData.grade}
                            items={receiptData.items}
                            totalAmount={receiptData.totalAmount}
                            cashReceived={receiptData.cashReceived}
                            balance={receiptData.balance}
                            date={receiptData.date}
                            onClose={() => setSelectedPayment(null)}
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
        <div className="space-y-4">
            {/* Admission Alert */}
            {hasAdmissionPending && (
                <Card className="border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <div className="flex-1">
                            <p className="font-semibold text-destructive">
                                Admission Fee Pending
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Rs. {admissionFee.toLocaleString()} is pending
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleSettleAdmission}
                        >
                            Settle Now
                        </Button>
                    </div>
                </Card>
            )}

            {/* Payment History */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Payment History
                </h3>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            Loading payment history...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Receipt className="mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                            No payment history available yet
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Payment records will appear here once fees are
                            collected
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <Card key={payment.paymentId} className="p-4">
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex flex-1 items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Receipt className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                Receipt #{payment.receiptNumber}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatPaymentDate(
                                                        payment.paymentDate
                                                    )}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {formatPaymentMethod(
                                                        payment.method
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="font-semibold"
                                        >
                                            Rs.{' '}
                                            {Number(
                                                payment.totalAmount
                                            ).toLocaleString()}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                setSelectedPayment(payment)
                                            }
                                            title="View receipt"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Payment Items */}
                                {payment.items.length > 0 && (
                                    <div className="space-y-2 border-t pt-3">
                                        {payment.items.map((item) => (
                                            <div
                                                key={item.itemId}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {item.itemType ===
                                                        'admission'
                                                            ? 'Admission Fee'
                                                            : item.itemType ===
                                                                'monthly'
                                                              ? `Monthly Fee - ${item.className || 'Class'}`
                                                              : item.itemType ===
                                                                  'exam'
                                                                ? `Exam Fee - ${item.className || 'Class'}`
                                                                : `Material Fee - ${item.className || 'Class'}`}
                                                    </span>
                                                    {item.itemType ===
                                                        'monthly' && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatMonthYear(
                                                                item.itemMonthIndex,
                                                                item.itemYear
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-foreground">
                                                    Rs.{' '}
                                                    {Number(
                                                        item.itemAmount
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
