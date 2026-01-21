import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export function Header() {
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
                <SheetContent side="left" className="w-64 sm:w-80">
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription className="hidden">Main Navigation Menu</SheetDescription>
                    <div className="px-1 py-6">
                        <h2 className="mb-4 text-xl font-bold tracking-tight px-2">Sarasi Institute</h2>
                        {/* Mobile Nav Placeholders */}
                        <div className="space-y-4 px-2">
                            <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
                            <div className="h-4 w-1/2 rounded bg-muted/50 animate-pulse" />
                            <div className="h-4 w-5/6 rounded bg-muted/50 animate-pulse" />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Header Content */}
            <div className="ml-4 flex flex-1 items-center justify-between">
                {/* Placeholder for Breadcrumbs / Title */}
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />

                {/* Placeholder for User Nav / Actions */}
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
        </header>
    )
}
