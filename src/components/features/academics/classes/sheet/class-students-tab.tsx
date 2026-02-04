'use client';

import { ClassItem } from '@/lib/mock-data-classes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ClassStudentsTabProps {
    classItem: ClassItem;
}

export function ClassStudentsTab({ classItem }: ClassStudentsTabProps) {
    const students = classItem.students || [];

    if (students.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <UsersIcon className="h-12 w-12 mb-2 opacity-20" />
                <p>No students enrolled yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-sm">Enrolled Students ({students.length})</h3>
            </div>
            
            <div className="space-y-3">
                {students.map((student) => (
                    <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={student.image} />
                                <AvatarFallback className="text-xs">
                                    {student.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">{student.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{student.id.toUpperCase()}</p>
                            </div>
                        </div>
                        {/* Payment Status Badge */}
                        <Badge
                            variant="outline"
                            className={`flex items-center gap-1 text-[10px] uppercase ${
                                student.paymentStatus === 'Paid'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : student.paymentStatus === 'Overdue'
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                            }`}
                        >
                            {student.paymentStatus === 'Paid' ? (
                                <CheckCircle2 className="h-3 w-3" />
                            ) : student.paymentStatus === 'Overdue' ? (
                                <AlertCircle className="h-3 w-3" />
                            ) : (
                                <Clock className="h-3 w-3" />
                            )}
                            {student.paymentStatus}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    );
}
