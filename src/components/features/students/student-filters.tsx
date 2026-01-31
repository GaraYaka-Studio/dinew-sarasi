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

export function StudentFilters() {
    const FilterContent = () => (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, ID, or phone..."
                    className="pl-9 w-full"
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

    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:flex items-center gap-4">
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
