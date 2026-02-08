'use client';

import { useState, useMemo } from 'react';
import { AuditFilters } from '@/components/features/reports/audit-filters';
import { AuditTimeline } from '@/components/features/reports/audit-timeline';
import {
    AUDIT_LOGS,
    groupLogsByDate,
    type AuditAction,
    type AuditModule,
} from '@/lib/mock-data-audit';
import { Shield } from 'lucide-react';

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<AuditAction | 'ALL'>('ALL');
    const [moduleFilter, setModuleFilter] = useState<AuditModule | 'ALL'>('ALL');

    // Filter logs based on search and filters
    const filteredLogs = useMemo(() => {
        return AUDIT_LOGS.filter((log) => {
            // Search filter
            const matchesSearch =
                searchQuery === '' ||
                log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details.toLowerCase().includes(searchQuery.toLowerCase());

            // Action filter
            const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

            // Module filter
            const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;

            return matchesSearch && matchesAction && matchesModule;
        });
    }, [searchQuery, actionFilter, moduleFilter]);

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
                    {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'}
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
                {hasLogs ? (
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
                                {searchQuery || actionFilter !== 'ALL' || moduleFilter !== 'ALL'
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
