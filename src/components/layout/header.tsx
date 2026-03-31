'use client';

import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { MobileNav } from '@/components/layout/mobile-nav';
import { UserMenu } from '@/components/user-menu';
import type { AuthUser } from '@/lib/auth';

export function Header() {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        }
        fetchUser();
    }, []);

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b bg-background px-4 md:px-6">
            {/* Mobile Menu Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="flex w-64 flex-col p-0 sm:w-80"
                >
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SheetDescription className="hidden">
                        Main Navigation Menu
                    </SheetDescription>
                    <div className="flex-1 overflow-y-auto px-1 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <h2 className="mb-4 px-2 text-xl font-bold tracking-tight">
                            Sarasi Institute
                        </h2>
                        <MobileNav />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Header Content */}
            <div className="ml-4 flex flex-1 items-center justify-between">
                {/* Placeholder for Breadcrumbs / Title */}
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />

                {/* User Menu / Actions */}
                {user ? (
                    <UserMenu user={user} />
                ) : (
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                )}
            </div>
        </header>
    );
}
