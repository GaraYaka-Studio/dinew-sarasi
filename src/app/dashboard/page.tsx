export default function DashboardPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder Stats Cards */}
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="h-4 w-1/3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
            </div>
        </div>
    );
}
