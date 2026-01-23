import { ZoneAActions } from '@/components/features/dashboard/zone-a-actions';
import { ZoneBSchedule } from '@/components/features/dashboard/zone-b-schedule';
import { ZoneCStats } from '@/components/features/dashboard/zone-c-stats';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Zone A: Actions & Live Status */}
            <ZoneAActions />

            {/* Zone B: Today's Schedule */}
            <ZoneBSchedule />

            {/* Zone C: Business & System Health */}
            <ZoneCStats />
        </div>
    );
}
