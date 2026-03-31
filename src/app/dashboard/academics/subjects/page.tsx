'use client';

import { useEffect, useState } from 'react';

import { getSubjects } from '@/lib/db/select';
import { Subject } from '@/types/schema.types';
import { SubjectCategory } from '@/types/constants.types';

import { CATEGORIES } from '@/lib/constants';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubjectTable } from '@/components/features/academics/subjects/subject-table';
import { SubjectListMobile } from '@/components/features/academics/subjects/subject-list-mobile';
import { SubjectFormDialog } from '@/components/features/academics/subjects/subject-form-dialog';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeTab, setActiveTab] = useState<SubjectCategory>('All');

    // Filter logic
    const filteredSubjects = subjects.filter((subject) => {
        if (activeTab === 'All') return true;
        return subject.category === activeTab;
    });

    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    return (
        <div className="flex h-full flex-col space-y-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
                <SubjectFormDialog
                    trigger={
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Subject
                        </Button>
                    }
                />
            </div>

            {/* Tabs - Desktop: Normal, Mobile: Scrollable */}
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as SubjectCategory)
                }
            >
                <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {CATEGORIES.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="whitespace-nowrap"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Content */}
            <div className="flex-1">
                {/* Mobile View (< lg) */}
                <div className="lg:hidden">
                    {filteredSubjects.length > 0 ? (
                        <SubjectListMobile subjects={subjects} />
                    ) : (
                        <div className="py-10 text-center text-muted-foreground">
                            No subjects found for this category.
                        </div>
                    )}
                </div>

                {/* Desktop View (>= lg) */}
                <div className="hidden lg:block">
                    {filteredSubjects.length > 0 ? (
                        <SubjectTable subjects={filteredSubjects} />
                    ) : (
                        <div className="rounded-md border bg-muted/20 p-10 text-center text-muted-foreground">
                            No subjects found for {activeTab}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
