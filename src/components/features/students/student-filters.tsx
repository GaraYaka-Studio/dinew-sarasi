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

const FilterContent = () => (
    <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search by name, ID, or phone..."
                className="w-full pl-9"
            />
        </div>
        <Select>
            <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
        </Select>
        <Select>
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
        <Select>
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
);

export function StudentFilters() {
    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden items-center gap-4 md:flex">
                <FilterContent />
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
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
