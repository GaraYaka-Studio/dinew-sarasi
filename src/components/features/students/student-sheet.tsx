'use client';

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StudentDetail } from '@/lib/mock-data';
import { SheetHeader } from './sheet/sheet-header';
import { SheetFooter } from './sheet/sheet-footer';
import { TabProfile } from './sheet/tab-profile';
import { TabPayments } from './sheet/tab-payments';
import { TabAttendance } from './sheet/tab-attendance';
import { TabClasses } from './sheet/tab-classes';

interface StudentSheetProps {
    student: StudentDetail | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentSheet({
    student,
    isOpen,
    onOpenChange,
}: StudentSheetProps) {
    if (!student) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-xl">
                {/* Visually Hidden Title for Screen Readers */}
                <SheetTitle className="sr-only">
                    {student.name} - Student Profile
                </SheetTitle>
                <SheetDescription className="sr-only">
                    View and manage student information including profile,
                    payments, attendance, and classes.
                </SheetDescription>

                {/* Fixed Header */}
                <div className="shrink-0 border-b p-6">
                    <SheetHeader student={student} />
                </div>

                {/* Scrollable Tabs Content */}
                <Tabs
                    defaultValue="profile"
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <TabsList className="w-full shrink-0 justify-start rounded-none border-b px-6">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="payments">Payments</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                    </TabsList>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="p-6">
                            <TabsContent value="profile" className="mt-0">
                                <TabProfile student={student} />
                            </TabsContent>

                            <TabsContent value="payments" className="mt-0">
                                <TabPayments student={student} />
                            </TabsContent>

                            <TabsContent value="attendance" className="mt-0">
                                <TabAttendance student={student} />
                            </TabsContent>

                            <TabsContent value="classes" className="mt-0">
                                <TabClasses student={student} />
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>

                {/* Fixed Footer */}
                <div className="shrink-0 border-t p-6">
                    <SheetFooter
                        student={student}
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
