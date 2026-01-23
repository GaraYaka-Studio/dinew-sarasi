'use client';

import { NavList, SystemNav } from '@/components/layout/nav-elements';

export function MobileNav() {
    return (
        <div className="flex flex-col space-y-1">
            <NavList />
            <div className="pt-4">
                <SystemNav />
            </div>
        </div>
    );
}
