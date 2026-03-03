'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Student } from '@/types/schema.types';
import { getStudentEnrollments } from '@/lib/db/select';
import { EnrollClassDialog } from '../enroll-class-dialog';

interface Enrollment {
    enrollmentId: string;
    enrolledAt: string | null;
    isActive: boolean | null;
    classId: string;
    className: string;
    grade: string;
    medium: 'sinhala' | 'english' | 'tamil' | null;
    type: 'theory' | 'revision' | 'paper' | null;
    monthlyFee: string;
    day: string | null;
    startTime: string | null;
    endTime: string | null;
    hallName: string | null;
    subjectName: string;
    subjectCategory: string | null;
    teacherId: string | null;
    teacherName: string | null;
}

const mediumColors: Record<string, string> = {
    sinhala: 'bg-red-100 text-red-700 hover:bg-red-200',
    english: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    tamil: 'bg-green-100 text-green-700 hover:bg-green-200',
};

const typeColors: Record<string, string> = {
    theory: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    revision: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    paper: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
};

interface TabClassesProps {
    student: Student;
}

export function TabClasses({ student }: TabClassesProps) {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

    useEffect(() => {
        loadEnrollments();
    }, [student.id]);

    const loadEnrollments = async () => {
        setIsLoading(true);
        try {
            const data = await getStudentEnrollments(student.id);
            setEnrollments(data);
        } catch (error) {
            console.error('Failed to load enrollments:', error);
            setEnrollments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnrolled = () => {
        loadEnrollments();
    };

    const getSchedule = (enrollment: Enrollment): string => {
        if (!enrollment.day || !enrollment.startTime || !enrollment.endTime) {
            return 'Schedule TBD';
        }
        const dayName = enrollment.day.charAt(0).toUpperCase() + enrollment.day.slice(1);
        const time = `${formatTime(enrollment.startTime)} - ${formatTime(enrollment.endTime)}`;
        return `${dayName}, ${time}`;
    };

    return (
        <div className="space-y-4">
            {/* Enrolled Classes */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Enrolled Classes
                </h3>

                {isLoading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading enrollments...
                    </div>
                ) : enrollments.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                No classes enrolled yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enroll this student in classes to track their progress
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {enrollments.map((enrollment) => (
                            <Card
                                key={enrollment.enrollmentId}
                                className={cn(
                                    'transition-colors',
                                    enrollment.isActive === false && 'opacity-60'
                                )}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-medium">
                                                    {enrollment.className}
                                                </p>
                                                {enrollment.type && (
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-xs', typeColors[enrollment.type])}
                                                    >
                                                        {enrollment.type}
                                                    </Badge>
                                                )}
                                                {enrollment.medium && (
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-xs capitalize', mediumColors[enrollment.medium])}
                                                    >
                                                        {enrollment.medium}
                                                    </Badge>
                                                )}
                                                {enrollment.isActive === false && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {getSchedule(enrollment)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    {enrollment.teacherName || 'No teacher'}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-foreground">
                                                    Rs. {Number(enrollment.monthlyFee).toLocaleString()}/month
                                                </span>
                                            </div>
                                            {enrollment.hallName && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Hall: {enrollment.hallName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Enroll Button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEnrollDialogOpen(true)}
            >
                <Plus className="mr-2 h-4 w-4" />
                Enroll New Class
            </Button>

            {/* Enroll Class Dialog */}
            <EnrollClassDialog
                student={student}
                isOpen={isEnrollDialogOpen}
                onOpenChange={setIsEnrollDialogOpen}
                onEnrolled={handleEnrolled}
            />
        </div>
    );
}

function formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').slice(0, 2).map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
}
