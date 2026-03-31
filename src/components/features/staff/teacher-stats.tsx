'use client';

import { Card } from '@/components/ui/card';

import { Class, Teacher } from '@/types/schema.types';

interface TeacherStatsProps {
    teachers: Teacher[];
    classes: Class[];
}

export function TeacherStats({ teachers, classes }: TeacherStatsProps) {
    const numTeachers = teachers?.length === undefined ? 0 : teachers.length;
    let numActiveClasses = 0;

    classes?.forEach((cls) => {
        if (cls.is_active) {
            numActiveClasses++;
        }
    });

    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="border p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Total Teachers
                    </p>
                    <p className="text-2xl font-semibold">{numTeachers}</p>
                </div>
            </Card>
            <Card className="border p-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Active Classes
                    </p>
                    <p className="text-2xl font-semibold">{numActiveClasses}</p>
                </div>
            </Card>
        </div>
    );
}
