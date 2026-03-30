'use client';

import { Card } from '@/components/ui/card';
import { Student } from '@/types/schema.types';

interface TabAttendanceProps {
    student: Student;
}

export function TabAttendance({ student }: TabAttendanceProps) {
    return (
        <div className="space-y-4">
            {/* Stats Overview */}
            <Card className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Attendance Rate
                        </p>
                        <p className="text-2xl font-bold">--</p>
                    </div>
                </div>
            </Card>

            {/* History Log */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Recent Activity
                </h3>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        No attendance records yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Attendance history will appear here once classes start
                    </p>
                </div>
            </div>
        </div>
    );
}
