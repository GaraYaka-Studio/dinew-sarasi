'use client';

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ClassItem } from '@/lib/mock-data-classes';
import { ClassOverviewTab } from './sheet/class-overview-tab';
import { ClassStudentsTab } from './sheet/class-students-tab';
import { Edit, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClassSheetProps {
    classItem: ClassItem | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClassSheet({
    classItem,
    isOpen,
    onOpenChange,
}: ClassSheetProps) {
    if (!classItem) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-xl">
                {/* Visually Hidden Title/Desc for Accessibility */}
                <SheetTitle className="sr-only">
                    {classItem.subject} - {classItem.grade}
                </SheetTitle>
                <SheetDescription className="sr-only">
                    View class details, teacher info, and enrolled students.
                </SheetDescription>

                {/* Fixed Header */}
                <div className="shrink-0 border-b bg-muted/5 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                {classItem.grade} - {classItem.subject}
                            </h2>
                            <div className="mt-2 flex gap-2">
                                <Badge variant="secondary">
                                    {classItem.medium}
                                </Badge>
                                <Badge variant="outline">
                                    {classItem.category}
                                </Badge>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" title="Edit Class">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Tabs */}
                <Tabs
                    defaultValue="overview"
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <TabsList className="w-full shrink-0 justify-start rounded-none border-b px-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                    </TabsList>

                    <div className="min-h-0 flex-1 overflow-y-auto bg-background">
                        <div className="p-6">
                            <TabsContent
                                value="overview"
                                className="mt-0 space-y-4"
                            >
                                <ClassOverviewTab classItem={classItem} />
                            </TabsContent>
                            <TabsContent
                                value="students"
                                className="mt-0 space-y-4"
                            >
                                <ClassStudentsTab classItem={classItem} />
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>

                {/* Fixed Footer */}
                <div className="shrink-0 border-t bg-muted/5 p-4 sm:p-6">
                    <Button
                        variant="destructive"
                        className="w-full text-sm text-white sm:w-auto"
                        size="sm"
                    >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Class
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
