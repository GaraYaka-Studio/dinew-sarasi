'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle } from 'lucide-react';

interface DangerZoneCardProps {
    maintenanceMode: boolean;
    onChange: (value: boolean) => void;
}

export function DangerZoneCard({
    maintenanceMode,
    onChange,
}: DangerZoneCardProps) {
    return (
        <Card className="border-red-200 bg-red-50/30 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/20">
            <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Danger Zone
                </h3>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white/50 p-4 dark:border-red-900 dark:bg-black/20">
                <div className="space-y-0.5">
                    <Label
                        htmlFor="maintenanceMode"
                        className="text-red-900 dark:text-red-100"
                    >
                        Maintenance Mode
                    </Label>
                    <p className="text-xs text-red-700 dark:text-red-300">
                        Suspend staff access to the system
                    </p>
                </div>
                <Switch
                    id="maintenanceMode"
                    checked={maintenanceMode}
                    onCheckedChange={onChange}
                />
            </div>
        </Card>
    );
}
