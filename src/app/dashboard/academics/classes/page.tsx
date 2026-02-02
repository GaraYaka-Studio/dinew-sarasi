'use client';

import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ClassFilters, ClassFilterState } from '@/components/features/academics/classes/class-filters';
import { ClassTable } from '@/components/features/academics/classes/class-table';
import { ClassListMobile } from '@/components/features/academics/classes/class-list-mobile';
import { CLASS_DATA } from '@/lib/mock-data-classes';

export default function ClassesPage() {
  const [activeFilter, setActiveFilter] = useState<ClassFilterState>({
    type: 'all',
    value: 'All Classes',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter logic
  const filteredClasses = CLASS_DATA.filter((item) => {
    if (activeFilter.type === 'all') return true;
    
    if (activeFilter.type === 'category') {
        return item.category === activeFilter.value;
    }

    if (activeFilter.type === 'grade') {
        // Precise matching or partial match for cases like "Grade 12 (2027)"
        return item.grade.includes(activeFilter.value);
    }
    
    return true;
  });

  return (
    <div className="flex h-full flex-col space-y-4 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
        <div className="flex items-center gap-2">
          {/* Mobile Filter Trigger */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80%]">
              <SheetHeader>
                <SheetTitle>Filter Classes</SheetTitle>
                <SheetDescription>
                  Select a grade or category to filter.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 h-full overflow-y-auto">
                <ClassFilters
                  activeFilter={activeFilter}
                  onSelectFilter={(filter) => {
                    setActiveFilter(filter);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Class
          </Button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Main Content (Left Panel - 75%) */}
        <div className="flex-1">
          {/* Mobile View (< lg) */}
          <div className="lg:hidden">
             {filteredClasses.length > 0 ? (
                <ClassListMobile data={filteredClasses} />
             ) : (
                <div className="text-center py-10 text-muted-foreground">
                    No classes found for this filter.
                </div>
             )}
          </div>

          {/* Desktop View (>= lg) */}
          <div className="hidden lg:block">
             {filteredClasses.length > 0 ? (
                <ClassTable data={filteredClasses} />
             ) : (
                 <div className="border rounded-md p-10 text-center text-muted-foreground bg-muted/20">
                    No classes found for {activeFilter.value}.
                 </div>
             )}
          </div>
        </div>

        {/* Filter Sidebar (Right Panel - 25%) */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="sticky top-20">
            <ClassFilters
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
