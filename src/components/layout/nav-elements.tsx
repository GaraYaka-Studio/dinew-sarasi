'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { NAV_ITEMS, NavGroup } from '@/config/nav';

export function NavList() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <nav className="space-y-1">
            {/* Primary Entry */}
            <Link
                href={NAV_ITEMS.primary.href}
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(NAV_ITEMS.primary.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
            >
                <NAV_ITEMS.primary.icon className="h-5 w-5" />
                {NAV_ITEMS.primary.title}
            </Link>

            {/* Operations Section */}
            <div className="pt-4">
                <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {NAV_ITEMS.operations.title}
                </p>
                <Accordion type="single" collapsible className="space-y-1">
                    {NAV_ITEMS.operations.groups?.map((group) => (
                        <NavGroupItem
                            key={group.title}
                            group={group}
                            isActive={isActive}
                        />
                    ))}
                </Accordion>
            </div>

            {/* Academics Section */}
            <div className="pt-4">
                <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {NAV_ITEMS.academics.title}
                </p>
                <Accordion type="single" collapsible className="space-y-1">
                    {NAV_ITEMS.academics.groups?.map((group) => (
                        <NavGroupItem
                            key={group.title}
                            group={group}
                            isActive={isActive}
                        />
                    ))}
                </Accordion>
            </div>
        </nav>
    );
}

export function SystemNav() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="settings" className="border-none">
                <AccordionTrigger
                    className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                        'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    )}
                >
                    <div className="flex items-center gap-3">
                        {NAV_ITEMS.system.icon && (
                            <NAV_ITEMS.system.icon className="h-5 w-5" />
                        )}
                        {NAV_ITEMS.system.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                    <div className="space-y-1">
                        {NAV_ITEMS.system.items?.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md py-2 pr-3 pl-11 text-sm transition-colors',
                                    isActive(item.href)
                                        ? 'bg-accent font-medium text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

interface NavGroupItemProps {
    group: NavGroup;
    isActive: (href: string) => boolean;
}

function NavGroupItem({ group, isActive }: NavGroupItemProps) {
    return (
        <AccordionItem
            value={group.title}
            className="border-none"
        >
            <AccordionTrigger
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                    'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
            >
                <div className="flex items-center gap-3">
                    {group.icon && <group.icon className="h-5 w-5" />}
                    {group.title}
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
                <div className="space-y-1">
                    {group.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md py-2 pr-3 pl-11 text-sm transition-colors',
                                isActive(item.href)
                                    ? 'bg-accent font-medium text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
