'use client';

import { Search, Zap, UserCheck, RefreshCw } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ScanControlsProps {
    isRapidMode: boolean;
    onToggleMode: () => void;
    onSearch: (value: string) => void;
    currentCount?: number;
}

export function ScanControls({
    isRapidMode,
    onToggleMode,
    onSearch,
    currentCount = 0,
}: ScanControlsProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Auto-focus input when entering Rapid Mode or on mount
    useEffect(() => {
        if (!isRapidMode || (isRapidMode && !isSearchExpanded)) {
            inputRef.current?.focus();
        }
    }, [isRapidMode, isSearchExpanded]);

    return (
        <div className="flex flex-col w-full gap-[10px]"> {/* Exact 10px spacing */}

            {/* 1. Search Logic */}
            <div className={cn(
                "relative transition-all duration-300 w-full",
                isRapidMode ? "hidden md:block" : "block",
                isSearchExpanded && "block"
            )}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        placeholder={isRapidMode ? "Ready to Scan..." : "Search ID/Name..."}
                        className={cn(
                            "pl-10 h-10 md:h-12 text-base md:text-lg transition-colors bg-background",
                            isRapidMode && "border-primary/50 bg-primary/5 ring-primary/20"
                        )}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                {isRapidMode && (
                    <p className="mt-1 text-xs text-muted-foreground hidden md:block pl-1">
                        <span className="font-semibold text-primary">TIP:</span> Auto-submits on detection.
                    </p>
                )}
            </div>

            {/* 2. Controls Row (Toggle & Mobile Search Trigger) */}
            <div className={cn(
                "flex w-full gap-[10px]", // 10px gap for mobile row
                isRapidMode
                    ? "flex-row items-center justify-between md:flex-col" // Mobile: Row, Desktop: Column
                    : "flex-col"
            )}>

                {/* Mobile Search Trigger Icon (Only in Rapid Mode) */}
                {isRapidMode && !isSearchExpanded && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSearchExpanded(true)}
                        className="md:hidden shrink-0 h-14 w-14 bg-background" // Match button height
                    >
                        <Search className="h-6 w-6" />
                        <span className="sr-only">Open Search</span>
                    </Button>
                )}

                <Button
                    size={isRapidMode ? "default" : "lg"}
                    variant={isRapidMode ? "default" : "outline"}
                    className={cn(
                        "transition-all relative overflow-hidden group w-full",
                        // Removed flex-1 to prevent vertical stretching
                        "h-14 md:h-16",
                        isRapidMode
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20 flex-1 md:flex-none" // flex-1 only on mobile row
                            : "hover:bg-accent hover:text-accent-foreground bg-background"
                    )}
                    onClick={() => {
                        onToggleMode();
                        setIsSearchExpanded(false);
                    }}
                >
                    <div className="flex items-center justify-center gap-2 md:gap-3 z-10">
                        {isRapidMode ? (
                            <>
                                <Zap className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
                                <span className="text-base md:text-lg font-bold">STOP SCAN</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-base md:text-lg">Switch to Rapid Mode</span>
                            </>
                        )}
                    </div>
                    {/* Background Effect for Rapid Mode */}
                    {isRapidMode && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
                    )}
                </Button>

                {/* Mode Description */}
                <p className={cn(
                    "text-center text-xs text-muted-foreground",
                    isRapidMode ? "hidden md:block" : "block"
                )}>
                    {isRapidMode
                        ? "High-speed mode. Scans run instantly."
                        : "Manual mode. Search & Confirm."}
                </p>
            </div>

            {/* 3. Live Counter */}
            {/* Removed mt-auto, added to the stack with 10px gap */}
            <div className="w-full">
                <div className="flex items-center justify-between rounded-lg bg-card/50 p-3 md:p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-medium text-muted-foreground">Present Today</p>
                            <p className="text-xl md:text-2xl font-bold leading-none">{currentCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
