'use client';

import { useState, useEffect, useMemo } from 'react';
import { AuditFilters } from '@/components/features/reports/audit-filters';
import { AuditTimeline } from '@/components/features/reports/audit-timeline';
import { getAuditLogs } from '@/lib/db/reports';
import type { AuditAction, AuditModule, AuditLogRecord } from '@/types/reports';
import { Shield, Loader2 } from 'lucide-react';

// Helper functions (moved from mock-data-audit.ts)
const getDateKey = (timestamp: string): string => {
    return timestamp.split('T')[0];
};

const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const formatDateHeader = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (getDateKey(today.toISOString()) === dateStr) {
        return `Today - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (getDateKey(yesterday.toISOString()) === dateStr) {
        return `Yesterday - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const groupLogsByDate = (logs: AuditLogRecord[]): Record<string, AuditLogRecord[]> => {
    return logs.reduce(
        (acc, log) => {
            const dateKey = getDateKey(log.timestamp);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(log);
            return acc;
        },
        {} as Record<string, AuditLogRecord[]>
    );
};

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<AuditAction | 'ALL'>('ALL');
    const [moduleFilter, setModuleFilter] = useState<AuditModule | 'ALL'>('ALL');

    // Data loading state
    const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch audit logs when filters change
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAuditLogs({
                    action: actionFilter,
                });
                setAuditLogs(data);
            } catch (err) {
                console.error('Error fetching audit logs:', err);
                setError('Failed to load audit logs');
                setAuditLogs([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [actionFilter]);

    // Filter logs based on search (client-side for search query)
    const filteredLogs = useMemo(() => {
        return auditLogs.filter((log) => {
            const matchesSearch =
                searchQuery === '' ||
                log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [auditLogs, searchQuery]);

    // Group filtered logs by date
    const groupedLogs = useMemo(() => {
        return groupLogsByDate(filteredLogs);
    }, [filteredLogs]);

    const hasLogs = filteredLogs.length > 0;

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b bg-card px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        System Audit Logs
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track all system activities and changes
                    </p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                        </span>
                    ) : (
                        <>
                            {filteredLogs.length}{' '}
                            {filteredLogs.length === 1 ? 'record' : 'records'}
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <AuditFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                actionFilter={actionFilter}
                onActionChange={setActionFilter}
                moduleFilter={moduleFilter}
                onModuleChange={setModuleFilter}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    // Loading State
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="mt-4 text-sm text-muted-foreground">
                                Loading audit logs...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    // Error State
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Shield className="mx-auto h-12 w-12 text-destructive" />
                            <h3 className="mt-4 text-lg font-semibold">
                                Error Loading Logs
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {error}
                            </p>
                        </div>
                    </div>
                ) : hasLogs ? (
                    <AuditTimeline groupedLogs={groupedLogs} />
                ) : (
                    // Empty State
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">
                                No audit logs found
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {searchQuery ||
                                actionFilter !== 'ALL' ||
                                moduleFilter !== 'ALL'
                                    ? 'Try adjusting your filters to see more results.'
                                    : 'No audit logs have been recorded yet.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
