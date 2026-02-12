'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StudentDetail } from '@/lib/mock-data';

interface TabProfileProps {
    student: StudentDetail;
}

export function TabProfile({ student }: TabProfileProps) {
    return (
        <div className="space-y-6">
            {/* Academic Section */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Academic
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-muted-foreground">School</p>
                        <p className="font-medium">{student.school}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="font-medium">{student.grade}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Batch</p>
                        <p className="font-medium">{student.batch}</p>
                    </div>
                    {student.olYear && (
                        <div>
                            <p className="text-xs text-muted-foreground">
                                O/L Year
                            </p>
                            <p className="font-medium">{student.olYear}</p>
                        </div>
                    )}
                    {student.alYear && (
                        <div>
                            <p className="text-xs text-muted-foreground">
                                A/L Year
                            </p>
                            <p className="font-medium">{student.alYear}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Personal Section */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Personal
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Date of Birth
                        </p>
                        <p className="font-medium">{student.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="font-medium">{student.gender}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">{student.address}</p>
                    </div>
                </div>
            </div>

            {/* Guardian Section */}
            <Card className="border-muted/50 bg-muted/20 p-4">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Guardian Details
                </h3>
                <div className="space-y-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">
                            {student.guardian.name} (
                            {student.guardian.relationship})
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a
                            href={`tel:${student.guardian.phone}`}
                            className="font-medium text-primary hover:underline"
                        >
                            {student.guardian.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            Emergency Contact:
                        </p>
                        <Badge
                            variant={
                                student.guardian.isEmergencyContact
                                    ? 'success'
                                    : 'secondary'
                            }
                        >
                            {student.guardian.isEmergencyContact ? 'Yes' : 'No'}
                        </Badge>
                    </div>
                </div>
            </Card>
        </div>
    );
}
