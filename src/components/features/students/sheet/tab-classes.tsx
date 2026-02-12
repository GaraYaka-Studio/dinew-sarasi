'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Plus } from 'lucide-react';
import type { StudentDetail } from '@/lib/mock-data';

interface TabClassesProps {
    student: StudentDetail;
}

export function TabClasses({ student }: TabClassesProps) {
    const handleEnrollClass = () => {
        // TODO: Implement enroll logic
        console.log('Enroll new class for:', student.id);
    };

    return (
        <div className="space-y-4">
            {/* Enrolled Classes */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Enrolled Classes
                </h3>
                <div className="space-y-3">
                    {student.enrolledClasses.map((cls) => (
                        <Card key={cls.id}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="font-semibold">
                                                {cls.name}
                                            </h4>
                                            <Badge
                                                variant="outline"
                                                className="mt-1"
                                            >
                                                {cls.grade}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{cls.teacher}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{cls.schedule}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Enroll Button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={handleEnrollClass}
            >
                <Plus className="mr-2 h-4 w-4" />
                Enroll New Class
            </Button>
        </div>
    );
}
