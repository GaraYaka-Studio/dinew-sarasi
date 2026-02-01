import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

interface StudentSearchProps {
    onSearch: (query: string) => void;
    onClear: () => void;
}

export function StudentSearch({ onSearch, onClear }: StudentSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F1') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                inputRef.current?.blur();
                onClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClear]);

    return (
        <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-5 w-5" />
            </div>
            <Input
                ref={inputRef}
                className="h-12 w-full pl-10 text-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="Scan ID, Barcode or Search Name (F1)..."
                autoFocus
                onChange={(e) => {
                    // Simulating instant search or scan
                    if (e.target.value.length > 2) {
                        onSearch(e.target.value);
                    }
                }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden text-xs text-muted-foreground sm:block">
                Press <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">F1</kbd> to focus
            </div>
        </div>
    );
}
