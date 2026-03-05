'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, Home, Download, CheckCircle2 } from 'lucide-react';

export interface ReceiptItem {
    label: string;
    amount: number;
}

export interface ReceiptViewProps {
    receiptNumber: string;
    studentName: string;
    studentId: string;
    grade: string;
    items: ReceiptItem[];
    totalAmount: number;
    cashReceived: number;
    balance: number;
    date: string;
    onClose: () => void;
    onPrint?: () => void;
}

export function ReceiptView({
    receiptNumber,
    studentName,
    studentId,
    grade,
    items,
    totalAmount,
    cashReceived,
    balance,
    date,
    onClose,
    onPrint,
}: ReceiptViewProps) {
    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center bg-muted/20 p-4 md:p-8">
            <div className="w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-500">
                <Card className="shadow-xl">
                    <CardContent className="p-6 md:p-8">
                        {/* Success Header */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">
                                Payment Successful!
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Receipt #{receiptNumber}
                            </p>
                        </div>

                        {/* Receipt Content */}
                        <div className="mb-6 rounded-lg border-2 border-dashed border-primary/30 bg-background p-4 text-sm">
                            {/* Header */}
                            <div className="mb-4 border-b pb-4 text-center">
                                <h3 className="text-lg font-bold">DINEW SARASI</h3>
                                <p className="text-xs text-muted-foreground">Tuition Center</p>
                            </div>

                            {/* Student Details */}
                            <div className="mb-4 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Student:</span>
                                    <span className="font-medium">{studentName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID:</span>
                                    <span className="font-mono">{studentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Grade:</span>
                                    <span>{grade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span>{formatDate(date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time:</span>
                                    <span>{formatTime(date)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-4 border-t pt-4">
                                <p className="mb-2 font-semibold">Payment Details:</p>
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-1">
                                        <span className="text-muted-foreground">{item.label}</span>
                                        <span className="font-mono">LKR {item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between py-2 font-semibold">
                                    <span>Total Amount:</span>
                                    <span className="font-mono">LKR {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 text-muted-foreground">
                                    <span>Cash Received:</span>
                                    <span className="font-mono">LKR {cashReceived.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 text-lg font-bold">
                                    <span>Balance:</span>
                                    <span className={cn(
                                        "font-mono",
                                        balance >= 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        LKR {balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            {onPrint && (
                                <Button
                                    className="w-full"
                                    onClick={onPrint}
                                >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Receipt
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={onClose}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Back to Collection
                            </Button>
                        </div>

                        {/* Thank You Note */}
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            Thank you for your payment!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper function for conditional className (since we can't import cn)
function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}
