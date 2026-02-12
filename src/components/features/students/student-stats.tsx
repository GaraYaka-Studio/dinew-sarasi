'use client';

import { Card } from '@/components/ui/card';
import { studentStats } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function StudentStats() {
    return (
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {studentStats.map((stat) => (
                <Card
                    key={stat.label}
                    className={cn(
                        'border p-4',
                        stat.status === 'success' &&
                            'border-green-200 bg-green-50/50',
                        stat.status === 'warning' &&
                            'border-orange-200 bg-orange-50/50',
                        stat.status === 'critical' &&
                            'border-red-200 bg-red-50/50',
                        stat.status === 'neutral' &&
                            'border-gray-200 bg-gray-50/50'
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-semibold">
                                {stat.value}
                            </p>
                            {stat.trend && (
                                <span className="text-xs text-muted-foreground">
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
