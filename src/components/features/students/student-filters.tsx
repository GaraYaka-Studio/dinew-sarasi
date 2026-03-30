'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Search, Filter } from 'lucide-react';
import { useRef } from 'react';
import { QRScanner, useHardwareScanner } from '@/components/features/qr-scanner';

interface StudentFiltersProps {
    onSearchChange?: (query: string) => void;
    enableScanner?: boolean;
    onGradeChange?: (grade: string) => void;
    onBatchChange?: (batch: string) => void;
    onStatusChange?: (status: string) => void;
    selectedGrade?: string;
    selectedBatch?: string;
    selectedStatus?: string;
    grades?: string[]; // Dynamic grades from database
}

const FilterContent = ({
    onSearchChange,
    enableScanner = true,
    onGradeChange,
    onBatchChange,
    onStatusChange,
    selectedGrade,
    selectedBatch,
    selectedStatus,
    grades = [],
}: {
    onSearchChange?: (query: string) => void;
    enableScanner?: boolean;
    onGradeChange?: (grade: string) => void;
    onBatchChange?: (batch: string) => void;
    onStatusChange?: (status: string) => void;
    selectedGrade?: string;
    selectedBatch?: string;
    selectedStatus?: string;
    grades?: string[];
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Global hardware scanner - works anywhere on page
    useHardwareScanner(
        (result) => {
            onSearchChange?.(result);
            inputRef.current?.focus();
        },
        enableScanner
    );

    // Beep sound function
    const playBeep = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch {
            // Ignore audio errors
        }
    };

    return (
        <>
            <div className="flex w-full flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        placeholder="Search by name, ID, phone, or QR code..."
                        className="w-full pl-9"
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>

                {/* Small Camera Preview Thumbnail */}
                {enableScanner && (
                    <QRScanner
                        onScan={(result) => {
                            onSearchChange?.(result);
                            inputRef.current?.focus();
                        }}
                        enabled={true}
                        showIndicator={false}
                        showPreview={true}
                        previewSize={80}
                        onBeep={playBeep}
                    />
                )}

                <Select value={selectedGrade || 'all'} onValueChange={onGradeChange}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                                {grade}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedBatch || 'all'} onValueChange={onBatchChange}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="2025">2025 A/L</SelectItem>
                        <SelectItem value="2026">2026 A/L</SelectItem>
                        <SelectItem value="2027">2027 O/L</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedStatus || 'all'} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Scanner Status Text */}
            {enableScanner && (
                <p className="text-xs text-muted-foreground">
                    ✓ Scanner active • Hardware or camera • Beep on success
                </p>
            )}
        </>
    );
};

export function StudentFilters({
    onSearchChange,
    enableScanner = true,
    onGradeChange,
    onBatchChange,
    onStatusChange,
    selectedGrade,
    selectedBatch,
    selectedStatus,
    grades,
}: StudentFiltersProps) {
    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden items-center gap-4 md:flex">
                <FilterContent
                    onSearchChange={onSearchChange}
                    enableScanner={enableScanner}
                    onGradeChange={onGradeChange}
                    onBatchChange={onBatchChange}
                    onStatusChange={onStatusChange}
                    selectedGrade={selectedGrade}
                    selectedBatch={selectedBatch}
                    selectedStatus={selectedStatus}
                    grades={grades}
                />
            </div>

            {/* Mobile View - Sheet */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters & Search
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                        <SheetHeader>
                            <SheetTitle>Search & Filters</SheetTitle>
                            <SheetDescription>
                                Narrow down students by grade, batch, or status.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-6">
                            <FilterContent
                                onSearchChange={onSearchChange}
                                enableScanner={enableScanner}
                                onGradeChange={onGradeChange}
                                onBatchChange={onBatchChange}
                                onStatusChange={onStatusChange}
                                selectedGrade={selectedGrade}
                                selectedBatch={selectedBatch}
                                selectedStatus={selectedStatus}
                                grades={grades}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
