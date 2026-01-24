'use client';

import { QrCode, UserPlus, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { liveClass } from '@/lib/mock-data';

export function ZoneAActions() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Side: Rapid Scan + Quick Actions */}
            <div className="space-y-4">
                {/* Hero: Rapid Scan Button */}
                <Card className="bg-primary/5 transition-all hover:bg-primary/10 hover:shadow-md">
                    <CardContent className="p-0">
                        <button className="flex h-24 w-full items-center gap-4 p-6 text-left transition-all md:h-28">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                                <QrCode className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold md:text-xl">
                                    Rapid Scan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Start attendance session
                                </p>
                            </div>
                        </button>
                    </CardContent>
                </Card>

                {/* Secondary Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-col gap-1 py-4"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span className="text-xs">New Student</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-col gap-1 py-4"
                    >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Payment</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-col gap-1 py-4"
                    >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Expense</span>
                    </Button>
                </div>
            </div>

            {/* Right Side: Live Class Widget */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Header with pulse indicator */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Happening Now
                            </p>
                        </div>

                        {/* Class Details */}
                        <div>
                            <h3 className="text-xl font-bold">
                                {liveClass.grade} {liveClass.subject}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Session in progress
                            </p>
                        </div>

                        {/* Attendance Count */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">
                                {liveClass.present}
                            </span>
                            <span className="text-lg text-muted-foreground">
                                / {liveClass.enrolled}
                            </span>
                        </div>

                        <Badge variant="success" className="mt-2">
                            Active
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
