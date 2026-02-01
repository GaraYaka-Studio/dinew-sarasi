import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StudentDetail } from '@/lib/mock-data';
import { AlertTriangle, Clock, CreditCard } from 'lucide-react';

interface StudentContextProps {
    student: StudentDetail | null;
    onPayAdmission: () => void;
}

export function StudentContext({
    student,
    onPayAdmission,
}: StudentContextProps) {
    if (!student) return null;

    const isActive = student.status === 'active';
    const isAdmissionPending = student.admissionStatus === 'PENDING';

    return (
        <Card className="border-l-4 border-l-primary shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="text-lg font-bold">
                            {student.initials || 'ST'}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight">
                                {student.name}
                            </h2>
                            <Badge
                                variant={isActive ? 'default' : 'secondary'}
                                className={
                                    isActive
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : ''
                                }
                            >
                                {student.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {student.studentId}
                            </span>
                            <span>•</span>
                            <span>{student.batch}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {student.lastActivity}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {isAdmissionPending ? (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Admission Pending
                            </span>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="text-white"
                                onClick={onPayAdmission}
                            >
                                Pay Now
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                            <span>Admission Paid</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
