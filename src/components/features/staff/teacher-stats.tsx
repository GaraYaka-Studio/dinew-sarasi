'use client';

import { Card } from '@/components/ui/card';
import { TeacherStat } from '@/types/teacher.types';
import { cn } from '@/lib/utils';

const TEACHER_STATS: TeacherStat[] = [
    { label: 'Total Teachers', value: '12', status: 'neutral' },
    { label: 'Active Classes', value: '48', status: 'success' },
];

interface TeacherStatsProps {
    stats?: TeacherStat[];
}

export function TeacherStats({ stats = TEACHER_STATS }: TeacherStatsProps) {
    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            {stats.map((stat) => (
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
                        <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
