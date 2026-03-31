'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { type AuditAction, type AuditModule } from '@/types/reports';

interface AuditFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    actionFilter: AuditAction | 'ALL';
    onActionChange: (action: AuditAction | 'ALL') => void;
    moduleFilter: AuditModule | 'ALL';
    onModuleChange: (module: AuditModule | 'ALL') => void;
}

const actionOptions: { value: AuditAction | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'EXPORT', label: 'Export' },
];

const moduleOptions: { value: AuditModule | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Modules' },
    { value: 'Students', label: 'Students' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Classes', label: 'Classes' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Settings', label: 'Settings' },
    { value: 'System', label: 'System' },
];

export function AuditFilters({
    searchQuery,
    onSearchChange,
    actionFilter,
    onActionChange,
    moduleFilter,
    onModuleChange,
}: AuditFiltersProps) {
    return (
        <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by User, Action, or Description..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Select
                    value={actionFilter}
                    onValueChange={(value) =>
                        onActionChange(value as AuditAction | 'ALL')
                    }
                >
                    <SelectTrigger className="w-full lg:w-[160px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        {actionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={moduleFilter}
                    onValueChange={(value) =>
                        onModuleChange(value as AuditModule | 'ALL')
                    }
                >
                    <SelectTrigger className="w-full lg:w-[160px]">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        {moduleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
