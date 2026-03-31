'use client';

import { Card } from '@/components/ui/card';
import { Student } from '@/types/schema.types';

interface StudentStatsProps {
    students: Student[];
}

export function StudentStats({ students }: StudentStatsProps) {
    const total = students?.length || 0;
    const active = students?.filter((s) => s.status === 'active').length || 0;
    const pending =
        students?.filter((s) => s.admission_status === 'pending').length || 0;

    return (
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Total Students
                    </p>
                    <p className="text-2xl font-semibold">{total}</p>
                </div>
            </Card>
            <Card className="border border-green-200 bg-green-50/50 p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Active Students
                    </p>
                    <p className="text-2xl font-semibold">{active}</p>
                </div>
            </Card>
            <Card className="border p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        New This Month
                    </p>
                    <p className="text-2xl font-semibold">0</p>
                </div>
            </Card>
            <Card className="border border-orange-200 bg-orange-50/50 p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Payment Pending
                    </p>
                    <p className="text-2xl font-semibold">{pending}</p>
                </div>
            </Card>
        </div>
    );
}
