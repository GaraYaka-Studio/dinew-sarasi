'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScheduleSession } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Clock, Eye, MapPin, User } from 'lucide-react';

interface ScheduleCardProps {
    session: ScheduleSession;
    onView: (session: ScheduleSession) => void;
}

export function ScheduleCard({ session, onView }: ScheduleCardProps) {
    const isCancelled = session.status === 'cancelled';
    const isExtra = session.status === 'extra';

    return (
        <Card
            className={cn(
                'group overflow-hidden transition-all hover:shadow-md',
                isCancelled && 'bg-muted/50 opacity-75'
            )}
        >
            <CardContent className="flex items-center gap-4 p-4">
                {/* Time Column (Mobile: Top, Desktop: Left) */}
                <div className="hidden min-w-[120px] flex-col md:flex">
                    <div className="flex items-center gap-2 font-bold">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{session.startTime}</span>
                    </div>
                    <span className="ml-6 text-xs text-muted-foreground">
                        {session.endTime}
                    </span>
                </div>

                {/* Main Info */}
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                            {/* Class Title */}
                            <h3
                                className={cn(
                                    'leading-none font-semibold',
                                    isCancelled && 'line-through'
                                )}
                            >
                                {session.subject} - {session.grade}
                            </h3>

                            {/* Tags */}
                            <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                                <Badge
                                    variant="secondary"
                                    className="font-normal"
                                >
                                    {session.medium}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="font-normal"
                                >
                                    {session.type}
                                </Badge>
                                {isExtra && (
                                    <Badge
                                        variant="default"
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        Extra Class
                                    </Badge>
                                )}
                                {isCancelled && (
                                    <Badge variant="destructive">
                                        Cancelled
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Mobile Status Badge (only if critical) */}
                        <div className="block md:hidden">
                            {isCancelled && (
                                <Badge
                                    variant="destructive"
                                    className="h-2 w-2 rounded-full p-0"
                                />
                            )}
                        </div>
                    </div>

                    {/* Meta Info (Teacher & Location) */}
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{session.teacher.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{session.location}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(session)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
