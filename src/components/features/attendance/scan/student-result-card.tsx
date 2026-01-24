'use client';

import { CheckCircle2, XCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StudentResultCardProps {
    status: 'idle' | 'active';
    student?: {
        name: string;
        id: string;
        image?: string;
        hasPaid: boolean;
        arrears?: number;
        attendanceHistory: boolean[]; // true = present, false = absent
    };
    onMarkPresent?: () => void;
    onCancel?: () => void;
}

export function StudentResultCard({
    status,
    student,
    onMarkPresent,
    onCancel,
}: StudentResultCardProps) {
    if (status === 'idle') {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-muted bg-muted/5 p-8 text-center animate-in fade-in duration-500">
                <div className="rounded-full bg-muted p-6">
                    <div className="h-16 w-16 opacity-20" style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 7V5c0-1.1.9-2 2-2h2'/%3E%3Cpath d='M17 3h2c1.1 0 2 .9 2 2v2'/%3E%3Cpath d='M21 17v2c0 1.1-.9 2-2 2h-2'/%3E%3Cpath d='M7 21H5c-1.1 0-2-.9-2-2v-2'/%3E%3Crect width='10' height='10' x='7' y='7' rx='2'/%3E%3Cpath d='M7 17h.01'/%3E%3Cpath d='M17 17h.01'/%3E%3Cpath d='M7 7h.01'/%3E%3Cpath d='M17 7h.01'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain'
                    }} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-foreground playfair-font">Ready to Scan</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Point the scanner at the QR code or manually search for a student to begin.
                    </p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="flex flex-col items-center h-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* 1. Profile Header */}
            <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-40 w-40 border-4 border-background shadow-xl ring-4 ring-muted/50">
                    <AvatarImage src={student.image} alt={student.name} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                        {student.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
                    <p className="text-lg text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-full inline-block">
                        {student.id}
                    </p>
                </div>
            </div>

            {/* 2. Attendance History */}
            <Card className="w-full bg-card/50 backdrop-blur-sm">
                <CardContent className="flex items-center justify-between p-4 px-6">
                    <span className="text-sm font-medium text-muted-foreground">This Month</span>
                    <div className="flex gap-2">
                        {student.attendanceHistory.map((present, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-4 w-4 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all hover:scale-110",
                                    present ? "bg-green-500 ring-green-200" : "bg-red-200 ring-red-100 dark:bg-red-900/50 dark:ring-red-900"
                                )}
                                title={present ? "Present" : "Absent"}
                            />
                        ))}
                        {/* Placeholder for future classes */}
                        {[...Array(2)].map((_, i) => (
                            <div key={`future-${i}`} className="h-4 w-4 rounded-full border-2 border-muted bg-transparent" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 3. Payment Status */}
            <div className="w-full space-y-4">
                <div className={cn(
                    "flex flex-col items-center justify-between rounded-xl border p-6 transition-all",
                    student.arrears && student.arrears > 0
                        ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                        : "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                )}>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            {student.arrears && student.arrears > 0 ? (
                                <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                            ) : (
                                <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold text-lg">
                                    {student.arrears && student.arrears > 0 ? "Outstanding Payments" : "Fees Paid"}
                                </h4>
                                {student.arrears && student.arrears > 0 ? (
                                    <p className="text-red-600 text-sm">Arrears: LKR {student.arrears.toLocaleString()}</p>
                                ) : (
                                    <p className="text-green-600 text-sm">All clear for this month</p>
                                )}
                            </div>
                        </div>

                        {student.arrears && student.arrears > 0 && (
                            <Button size="sm" variant="destructive" className="animate-pulse shadow-lg md:text-md">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay Now
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Area (Confirm) - Mainly for Manual Mode */}
            {onMarkPresent && (
                <div className="flex w-full gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 h-14 text-lg border-2 hover:bg-muted/80"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                        onClick={onMarkPresent}
                    >
                        Mark Present
                    </Button>
                </div>
            )}
        </div>
    );
}
