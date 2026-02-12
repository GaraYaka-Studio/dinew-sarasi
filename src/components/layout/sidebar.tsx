'use client';

import { cn } from '@/lib/utils';
import { NavList, SystemNav } from '@/components/layout/nav-elements';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
    return (
        <aside
            className={cn(
                // General Layout: Fixed width, Full height, Fixed position
                'fixed inset-y-0 left-0 w-64 border-r bg-card',
                // Hiding on Mobile: Hidden by default (handled by Sheet on mobile), Visible on md+
                'hidden md:flex md:flex-col',
                className
            )}
            {...props}
        >
            {/* Header */}
            <div className="flex h-16 items-center border-b px-6">
                <h2 className="text-xl font-bold tracking-tight">
                    Sarasi Institute
                </h2>
            </div>

            {/* Navigation Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-3 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <NavList />
            </div>

            {/* System Section (Pinned at Bottom) */}
            <div className="border-t bg-card p-3">
                <SystemNav />
            </div>
        </aside>
    );
}
