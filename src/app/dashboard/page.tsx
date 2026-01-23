export default function DashboardPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder Stats Cards */}
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}
