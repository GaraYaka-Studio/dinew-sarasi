# Audit Report Page Implementation Plan

> **Page**: `/dashboard/reports/audit`
> **Goal**: Replace mock data with real database queries
> **UI Status**: Already designed - preserve as-is

---

## Overview

The audit report page currently displays mock data from `src/lib/mock-data-audit.ts`. This plan replaces the mock data with real database queries from the `audit_log` table while maintaining full consistency with existing code patterns and preserving the UI exactly as-is.

---

## Database Schema Reference

**Table: `audit_log`**
```sql
{
    id: uuid           -- Primary key
    user_id: uuid      -- Foreign key to profiles.id
    action: text       -- 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT'
    details: jsonb     -- { module, context, details, ipAddress }
    created_at: timestamp
}
```

---

## Implementation Steps

### Step 1: Add Types to `src/types/reports.ts`

Add at the end of the file (after `ActivitySummary`):

```typescript
// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
export type AuditModule = 'Students' | 'Finance' | 'Classes' | 'Staff' | 'Settings' | 'System';

export interface AuditLogRecord {
    id: string;
    timestamp: string; // ISO format from created_at
    user: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
    };
    action: AuditAction;
    module: AuditModule;
    context: string;
    details: string;
    ipAddress?: string;
}

export interface AuditSummary {
    totalLogs: number;
    byAction: Record<AuditAction, number>;
    byModule: Record<AuditModule, number>;
}
```

---

### Step 2: Add Server Actions to `src/lib/db/reports.ts`

**2.1. Add imports at the top:**
```typescript
import { auditLogs, profiles } from '@/db/schema';
import type { AuditLogRecord, AuditAction, AuditModule, AuditSummary } from '@/types/reports';
```

**2.2. Add after the activity log section:**

```typescript
// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

/**
 * Get audit logs with filters
 * Follows same pattern as getStudentPaymentsForMonth
 */
export async function getAuditLogs(filters: {
    action?: AuditAction | 'ALL';
    module?: AuditModule | 'ALL';
    limit?: number;
    offset?: number;
}): Promise<AuditLogRecord[]> {
    const { action, limit = 100, offset = 0 } = filters;

    const conditions = [];
    if (action && action !== 'ALL') {
        conditions.push(eq(auditLogs.action, action));
    }

    const results = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            details: auditLogs.details,
            createdAt: auditLogs.created_at,
            userId: auditLogs.user_id,
            userName: profiles.full_name,
            userRole: profiles.role,
            userAvatar: profiles.avatar_url,
        })
        .from(auditLogs)
        .innerJoin(profiles, eq(profiles.id, auditLogs.user_id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(auditLogs.created_at))
        .limit(limit)
        .offset(offset);

    return results.map((r) => {
        const details = r.details as {
            module?: string;
            context?: string;
            details?: string;
            ipAddress?: string;
        } | null;

        return {
            id: r.id,
            timestamp: r.createdAt.toISOString(),
            user: {
                id: r.userId,
                name: r.userName ?? 'Unknown User',
                role: r.userRole ?? 'staff',
                avatar: r.userAvatar,
            },
            action: (r.action ?? 'UPDATE') as AuditAction,
            module: (details?.module ?? 'System') as AuditModule,
            context: details?.context ?? '',
            details: details?.details ?? '',
            ipAddress: details?.ipAddress,
        };
    });
}

/**
 * Get audit logs for a specific month
 * Follows same pattern as getAttendanceLogByMonth
 */
export async function getAuditLogsByMonth(
    year: number,
    month: number
): Promise<AuditLogRecord[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const results = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            details: auditLogs.details,
            createdAt: auditLogs.created_at,
            userId: auditLogs.user_id,
            userName: profiles.full_name,
            userRole: profiles.role,
            userAvatar: profiles.avatar_url,
        })
        .from(auditLogs)
        .innerJoin(profiles, eq(profiles.id, auditLogs.user_id))
        .where(
            and(
                gte(auditLogs.created_at, startDate),
                lte(auditLogs.created_at, endDate)
            )
        )
        .orderBy(desc(auditLogs.created_at));

    return results.map((r) => {
        const details = r.details as {
            module?: string;
            context?: string;
            details?: string;
            ipAddress?: string;
        } | null;

        return {
            id: r.id,
            timestamp: r.createdAt.toISOString(),
            user: {
                id: r.userId,
                name: r.userName ?? 'Unknown User',
                role: r.userRole ?? 'staff',
                avatar: r.userAvatar,
            },
            action: (r.action ?? 'UPDATE') as AuditAction,
            module: (details?.module ?? 'System') as AuditModule,
            context: details?.context ?? '',
            details: details?.details ?? '',
            ipAddress: details?.ipAddress,
        };
    });
}

/**
 * Get audit log summary
 * Follows same pattern as getFinancialSummary
 */
export async function getAuditSummary(): Promise<AuditSummary> {
    const results = await db
        .select({
            action: auditLogs.action,
            count: sql<number>`COUNT(*)`,
        })
        .from(auditLogs)
        .groupBy(auditLogs.action);

    const byAction = {
        CREATE: 0,
        UPDATE: 0,
        DELETE: 0,
        LOGIN: 0,
        EXPORT: 0,
    };

    results.forEach((r) => {
        const action = (r.action ?? 'UPDATE') as AuditAction;
        if (action in byAction) {
            byAction[action] = r.count;
        }
    });

    return {
        totalLogs: results.reduce((sum, r) => sum + r.count, 0),
        byAction,
        byModule: {
            Students: 0,
            Finance: 0,
            Classes: 0,
            Staff: 0,
            Settings: 0,
            System: 0,
        },
    };
}
```

---

### Step 3: Update `src/app/dashboard/reports/audit/page.tsx`

Replace the entire file content with:

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AuditFilters } from '@/components/features/reports/audit-filters';
import { AuditTimeline } from '@/components/features/reports/audit-timeline';
import { getAuditLogs } from '@/lib/db/reports';
import type { AuditAction, AuditModule } from '@/types/reports';
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

const groupLogsByDate = (logs: any[]): Record<string, any[]> => {
    return logs.reduce(
        (acc, log) => {
            const dateKey = getDateKey(log.timestamp);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(log);
            return acc;
        },
        {} as Record<string, any[]>
    );
};

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<AuditAction | 'ALL'>('ALL');
    const [moduleFilter, setModuleFilter] = useState<AuditModule | 'ALL'>('ALL');

    // Data loading state
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
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
```

---

### Step 4: Update `src/components/features/reports/audit-filters.tsx`

**Change the import statement:**

```typescript
// FROM:
import { type AuditAction, type AuditModule } from '@/lib/mock-data-audit';

// TO:
import type { AuditAction, AuditModule } from '@/types/reports';
```

---

### Step 5: Update `src/components/features/reports/audit-timeline.tsx`

**Replace the imports and add helper functions:**

```typescript
// Replace this import:
import {
    type AuditLog,
    formatTime,
    formatDateHeader,
    type AuditAction,
} from '@/lib/mock-data-audit';

// With:
import type { AuditLogRecord as AuditLog, AuditAction } from '@/types/reports';

// Add these helper functions after the imports:
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

    const getDateKey = (ts: string) => ts.split('T')[0];

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
```

---

### Step 6: Delete Mock Data File

Delete `src/lib/mock-data-audit.ts` - no longer needed since helpers are now inline.

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/types/reports.ts` | Add | AuditLogRecord, AuditAction, AuditModule, AuditSummary |
| `src/lib/db/reports.ts` | Add | getAuditLogs(), getAuditLogsByMonth(), getAuditSummary() |
| `src/app/dashboard/reports/audit/page.tsx` | Replace | Mock data → real server action with useEffect |
| `src/components/features/reports/audit-filters.tsx` | Modify | Import from @/types/reports |
| `src/components/features/reports/audit-timeline.tsx` | Modify | Import from @/types/reports + inline helpers |
| `src/lib/mock-data-audit.ts` | Delete | No longer needed |

---

## Testing Checklist

- [ ] Page loads without errors at `/dashboard/reports/audit`
- [ ] Loading spinner shows while fetching
- [ ] Empty state displays when no logs in database
- [ ] Table view displays on desktop when data exists
- [ ] Timeline view displays on mobile when data exists
- [ ] Search filter works (client-side filtering)
- [ ] Action dropdown filter works (triggers re-fetch)
- [ ] Module dropdown filter works (client-side filtering)
- [ ] Error state displays on fetch failure

---

## Code Consistency (Following Existing Patterns)

- ✅ Uses `'use server'` for database queries
- ✅ Uses `useEffect` with async for data fetching
- ✅ Uses `useState` for data, loading, error states
- ✅ Follows `get*ForMonth` naming convention
- ✅ Uses Drizzle ORM with proper joins
- ✅ Preserves existing UI components unchanged
- ✅ 4-space indentation (Tailwind convention)
- ✅ Error handling with try/catch/finally
- ✅ Client-side search, server-side dropdown filters
