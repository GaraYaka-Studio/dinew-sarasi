import { useState } from 'react';

import { getInitials } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

import { Subject, Teacher } from '@/types/schema.types';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface SubjectDetailsProps {
    subject: Subject;
    teachers: Teacher[];
    variant?: 'icon' | 'button';
}

export function SubjectDetails({
    subject,
    teachers,
    variant = 'icon',
}: SubjectDetailsProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const trigger =
        variant === 'icon' ? (
            <Button variant="ghost" size="icon" title="View Details">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View Subject Details</span>
            </Button>
        ) : (
            <Button variant="ghost" size="icon" className="h-10 w-10">
                <Eye className="h-5 w-5" />
                <span className="sr-only">View Subject Details</span>
            </Button>
        );

    const content = (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                    <Badge variant="secondary">{subject.code}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Subject Information
                </p>
            </div>

            <Separator />

            {/* Assigned Teachers */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold">Assigned Teachers</h4>
                <div className="space-y-2">
                    {teachers.map((teacher, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                    {getInitials(teacher.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{teacher.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Applicable Grades */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold">Applicable Grades</h4>
                <div className="flex flex-wrap gap-2">
                    {subject.grades.map((grade, index) => (
                        <Badge key={index} variant="outline">
                            {grade}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Edit Subject
                </Button>
                <Button
                    variant="destructive"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => setOpen(false)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );

    // Desktop: Dialog
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Subject Details</DialogTitle>
                        <DialogDescription>
                            View and manage subject information.
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        );
    }

    // Mobile: Sheet (Bottom Drawer)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent side="bottom" className="h-[85%]">
                <SheetHeader>
                    <SheetTitle>Subject Details</SheetTitle>
                    <SheetDescription>
                        View and manage subject information.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto pb-6">{content}</div>
            </SheetContent>
        </Sheet>
    );
}
