import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Layers, GraduationCap, BookOpen, School, Shapes } from 'lucide-react';

export type FilterType = 'all' | 'category' | 'grade';

export interface ClassFilterState {
  type: FilterType;
  value: string;
}

interface ClassFiltersProps {
  activeFilter: ClassFilterState;
  onSelectFilter: (filter: ClassFilterState) => void;
  className?: string; // Allow external styling (e.g., hidden md:block)
}

// Hierarchy Definition
const FILTER_HIERARCHY = [
  {
    category: 'Primary',
    icon: School,
    grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
  },
  {
    category: 'Junior',
    icon: BookOpen,
    grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
  },
  {
    category: 'Ordinary Level',
    icon: Layers,
    grades: ['Grade 10', 'Grade 11'],
  },
  {
    category: 'Advanced Level',
    icon: GraduationCap,
    grades: ['Grade 12', 'Grade 13'],
  },
  {
    category: 'Other',
    icon: Shapes,
    grades: ['General', 'Beginner', 'Intermediate'],
  },
];

export function ClassFilters({ activeFilter, onSelectFilter, className }: ClassFiltersProps) {
  return (
    <div className={cn('flex flex-col space-y-4', className)}>
       {/* 1. All Classes Button (Top Level) */}
        <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Overview
            </h2>
            <Button
                variant={activeFilter.type === 'all' ? 'secondary' : 'ghost'}
                className={cn(
                    'w-full justify-start font-medium',
                    activeFilter.type === 'all' && 'bg-secondary text-secondary-foreground'
                )}
                onClick={() => onSelectFilter({ type: 'all', value: 'All Classes' })}
            >
                <Layers className="mr-2 h-4 w-4" />
                All Classes
            </Button>
        </div>


      {/* 2. Hierarchical Filters (Accordion) */}
      <div className="py-2">
           <h2 className="mb-2 px-7 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                By Section
           </h2>
          <Accordion type="single" collapsible className="w-full space-y-1 px-3">
            {FILTER_HIERARCHY.map((section) => (
              <AccordionItem key={section.category} value={section.category} className="border-none">
                <AccordionTrigger
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                    activeFilter.type === 'category' && activeFilter.value === section.category
                         ? 'bg-accent/50 text-accent-foreground' // Highlight if entire category selected (optional behavior)
                         : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                 // Optional: Click trigger to filter by category? 
                 // For now, let's keep standard accordion behavior (expand only)
                 // If user wants to filter by full 'Primary', they could, but requirements focus on grades.
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4" />
                    {section.category}
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pt-1 pb-1">
                  <div className="space-y-1">
                    {section.grades.map((grade) => (
                      <Button
                        key={grade}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'w-full justify-start pl-11 h-9 font-normal text-muted-foreground',
                          activeFilter.type === 'grade' && activeFilter.value === grade
                            ? 'bg-accent font-medium text-accent-foreground'
                            : 'hover:bg-accent/50 hover:text-accent-foreground'
                        )}
                        onClick={() => onSelectFilter({ type: 'grade', value: grade })}
                      >
                        {grade}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
      </div>
    </div>
  );
}
