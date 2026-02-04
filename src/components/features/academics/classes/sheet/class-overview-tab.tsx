'use client';

import { ClassItem } from '@/lib/mock-data-classes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Banknote, Users } from 'lucide-react';

interface ClassOverviewTabProps {
    classItem: ClassItem;
}

export function ClassOverviewTab({ classItem }: ClassOverviewTabProps) {
    return (
        <div className="space-y-6">
            {/* Teacher Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Teacher Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={classItem.teacher?.image} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {classItem.teacherName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{classItem.teacherName}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                                <p className="flex items-center gap-2">
                                    <User className="h-3 w-3" /> {classItem.teacher?.id || 'T-XXX'}
                                </p>
                                <p>{classItem.teacher?.email}</p>
                                <p>{classItem.teacher?.phone}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule & Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="font-semibold">{classItem.schedule.day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{classItem.schedule.time}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Course Fee
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-green-600" />
                            <span className="text-xl font-bold">
                                LKR {classItem.fee.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Per Month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Section */}
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Class Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Total Students</span>
                         <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{classItem.studentCount}</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline">{classItem.category}</Badge>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                         <Badge variant={classItem.status === 'Active' ? 'default' : 'secondary'}>
                            {classItem.status}
                        </Badge>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
}
