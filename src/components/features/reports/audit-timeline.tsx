'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    type AuditLog,
    formatTime,
    formatDateHeader,
    type AuditAction,
} from '@/lib/mock-data-audit';

const getActionBadge = (action: AuditAction) => {
    const variants = {
        CREATE: {
            label: 'CREATE',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        UPDATE: {
            label: 'UPDATE',
            className: 'bg-orange-100 text-orange-800 border-orange-200',
        },
        DELETE: {
            label: 'DELETE',
            className: 'bg-red-100 text-red-800 border-red-200',
        },
        LOGIN: {
            label: 'LOGIN',
            className: 'bg-gray-100 text-gray-800 border-gray-200',
        },
        EXPORT: {
            label: 'EXPORT',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
        },
    };
    return variants[action];
};

// Helper to get initials
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

interface AuditTimelineProps {
    groupedLogs: Record<string, AuditLog[]>;
}

export function AuditTimeline({ groupedLogs }: AuditTimelineProps) {
    const sortedDates = Object.keys(groupedLogs).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return (
        <div className="space-y-6">
            {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                    {/* Date Header */}
                    <div className="sticky top-0 z-10 mb-3 bg-background py-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {formatDateHeader(dateKey)}
                        </h3>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden rounded-lg border lg:block">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground w-[100px]">
                                        Time
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                        User
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground w-[100px]">
                                        Action
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                        Context
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {groupedLogs[dateKey].map((log) => {
                                    const actionBadge = getActionBadge(log.action);
                                    return (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {formatTime(log.timestamp)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                                            {getInitials(log.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">
                                                            {log.user.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {log.user.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        actionBadge.className
                                                    )}
                                                >
                                                    {actionBadge.label}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-muted-foreground">
                                                    {log.context}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.details}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Timeline View */}
                    <div className="space-y-4 lg:hidden">
                        <div className="relative pl-6">
                            {/* Timeline Line */}
                            <div className="absolute left-2 top-0 h-full w-0.5 bg-muted" />

                            {groupedLogs[dateKey].map((log, index) => {
                                const actionBadge = getActionBadge(log.action);
                                return (
                                    <div
                                        key={log.id}
                                        className="relative pb-4 last:pb-0"
                                    >
                                        {/* Timeline Dot */}
                                        <div className="absolute left-[-19px] top-4 h-3 w-3 rounded-full border-2 border-background bg-primary" />

                                        {/* Timeline Card */}
                                        <div className="rounded-lg border bg-card p-3 shadow-sm">
                                            {/* Time & Badge */}
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {formatTime(log.timestamp)}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-[10px]',
                                                        actionBadge.className
                                                    )}
                                                >
                                                    {actionBadge.label}
                                                </Badge>
                                            </div>

                                            {/* User Info */}
                                            <div className="mb-2 flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                                                        {getInitials(log.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {log.user.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {log.user.role} • {log.module}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Context */}
                                            <p className="mb-1 text-sm font-medium">
                                                {log.context}
                                            </p>

                                            {/* Details */}
                                            <p className="text-xs text-muted-foreground">
                                                {log.details}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
