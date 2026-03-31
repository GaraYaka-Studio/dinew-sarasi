import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';

interface StudentSearchProps {
    onSearch: (query: string) => void;
    onClear: () => void;
}

export function StudentSearch({ onSearch, onClear }: StudentSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedQuery.length >= 2) {
                onSearch(debouncedQuery);
            } else if (debouncedQuery.length === 0) {
                onClear();
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [debouncedQuery, onSearch, onClear]);

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
                setDebouncedQuery(''); // Also clear input
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClear]);

    return (
        <div className="relative w-full">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                <Search className="h-5 w-5" />
            </div>
            <Input
                ref={inputRef}
                className="h-12 w-full pl-10 text-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="Scan ID, Barcode or Search Name (F1)..."
                autoFocus
                onChange={(e) => {
                    setDebouncedQuery(e.target.value);
                }}
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                Press{' '}
                <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">
                    F1
                </kbd>{' '}
                to focus
            </div>
        </div>
    );
}
