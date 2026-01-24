'use client';

import {
    TrendingUp,
    AlertTriangle,
    UserPlus,
    Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, systemServices } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function StatCard({
    label,
    value,
    trend,
    status,
    icon: Icon,
}: {
    label: string;
    value: string;
    trend?: string;
    status?: 'neutral' | 'warning' | 'critical' | 'success';
    icon: React.ElementType;
}) {
    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'text-emerald-600';
            case 'critical':
                return 'text-destructive';
            case 'warning':
                return 'text-orange-600';
            default:
                return 'text-foreground';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={cn('text-2xl font-bold', getStatusColor())}>
                    {value}
                </div>
                {trend && (
                    <p className="text-xs text-muted-foreground">{trend}</p>
                )}
            </CardContent>
        </Card>
    );
}

function SystemStatusCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    System Services
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {/* Desktop: Full Details */}
                <div className="hidden space-y-3 md:block">
                    {systemServices.map((service) => (
                        <div
                            key={service.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'h-2 w-2 rounded-full',
                                        service.status === 'online' &&
                                        'bg-emerald-500',
                                        service.status === 'offline' &&
                                        'bg-red-500',
                                        service.status === 'degraded' &&
                                        'bg-yellow-500'
                                    )}
                                />
                                <span className="text-sm font-medium">
                                    {service.name}
                                </span>
                            </div>
                            {service.details && (
                                <span className="text-xs text-muted-foreground">
                                    {service.details}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile: Compact Dots */}
                <div className="flex flex-col gap-2 md:hidden">
                    <div className="text-2xl font-bold">
                        {systemServices.filter((s) => s.status === 'online').length}/
                        {systemServices.length}
                    </div>
                    <div className="flex items-center gap-2">
                        {systemServices.map((service) => (
                            <div
                                key={service.name}
                                className={cn(
                                    'h-3 w-3 rounded-full',
                                    service.status === 'online' &&
                                    'bg-emerald-500',
                                    service.status === 'offline' && 'bg-red-500',
                                    service.status === 'degraded' &&
                                    'bg-yellow-500'
                                )}
                                title={service.name}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        All systems operational
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function ZoneCStats() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Revenue Card */}
            <StatCard
                label={dashboardStats[0].label}
                value={dashboardStats[0].value}
                trend={dashboardStats[0].trend}
                status={dashboardStats[0].status}
                icon={TrendingUp}
            />

            {/* Arrears Card (Critical) */}
            <StatCard
                label={dashboardStats[1].label}
                value={dashboardStats[1].value}
                status={dashboardStats[1].status}
                icon={AlertTriangle}
            />

            {/* New Students Card */}
            <StatCard
                label={dashboardStats[2].label}
                value={dashboardStats[2].value}
                trend={dashboardStats[2].trend}
                status={dashboardStats[2].status}
                icon={UserPlus}
            />

            {/* System Status Card */}
            <SystemStatusCard />
        </div>
    );
}
