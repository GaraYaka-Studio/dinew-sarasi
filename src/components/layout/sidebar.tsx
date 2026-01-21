import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className, ...props }: SidebarProps) {
    return (
        <aside
            className={cn(
                // General Layout: Fixed width, Full height, Fixed position
                "fixed inset-y-0 left-0 w-64 border-r bg-background",
                // Hiding on Mobile: Hidden by default (handled by Sheet on mobile), Visible on md+
                "hidden md:block",
                className
            )}
            {...props}
        >
            <div className="flex h-16 items-center border-b px-6">
                <h2 className="text-xl font-bold tracking-tight">Sarasi Institute</h2>
            </div>
            <div className="p-4">
                {/* Placeholder for navigation items */}
                <div className="space-y-4 py-4">
                    <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-muted/50 animate-pulse" />
                    <div className="h-4 w-5/6 rounded bg-muted/50 animate-pulse" />
                </div>
            </div>
        </aside>
    )
}
