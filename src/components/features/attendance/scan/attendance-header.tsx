'use client';

import { X, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';

interface AttendanceHeaderProps {
    className?: string;
    activeClass: string;
    onClassChange: (value: string) => void;
}

export function AttendanceHeader({
    className,
    activeClass,
    onClassChange,
}: AttendanceHeaderProps) {
    // Map of IDs to Display Names
    const classNames: Record<string, string> = {
        '2026-revision': '2026 Revision',
        '2027-theory': '2027 Theory',
    };

    return (
        <header
            className={`sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
        >
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Active Class
                    </span>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg leading-none font-bold whitespace-nowrap text-foreground">
                            {classNames[activeClass] || activeClass}
                        </h1>
                        <Select
                            value={activeClass}
                            onValueChange={onClassChange}
                        >
                            <SelectTrigger className="h-6 w-[24px] rounded-full border-none px-0 opacity-50 hover:opacity-100 focus:ring-0">
                                <span className="sr-only">Change Class</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2026-revision">
                                    2026 Revision
                                </SelectItem>
                                <SelectItem value="2027-theory">
                                    2027 Theory
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Add / Extra Class Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 hidden h-6 gap-1 rounded-full border-dashed px-2 text-xs md:flex"
                        >
                            <Plus className="h-3 w-3" />
                            <span>Add Class</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <Link href="/dashboard">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Exit Scan Mode</span>
                </Link>
            </Button>
        </header>
    );
}
