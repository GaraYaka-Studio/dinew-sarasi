import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SubjectFormDialogProps {
    trigger: React.ReactNode;
}

const GRADES = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);

const SECTIONS = [
    { value: 'primary', label: 'Primary (1-5)' },
    { value: 'junior', label: 'Junior (6-9)' },
    { value: 'ol', label: 'Ordinary Level (10-11)' },
    { value: 'al', label: 'Advanced Level (12-13)' },
];

export function SubjectFormDialog({ trigger }: SubjectFormDialogProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [subjectName, setSubjectName] = useState('');
    const [section, setSection] = useState('');
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

    // Auto-generate subject code from name using useMemo
    const subjectCode = useMemo(() => {
        if (subjectName.trim()) {
            const code = subjectName
                .toUpperCase()
                .split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .slice(0, 4);
            return (
                code +
                '-' +
                (section ? section.toUpperCase().slice(0, 2) : 'GEN')
            );
        }
        return '';
    }, [subjectName, section]);

    const toggleGrade = (grade: string) => {
        setSelectedGrades((prev) =>
            prev.includes(grade)
                ? prev.filter((g) => g !== grade)
                : [...prev, grade]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Handle form submission
        console.log({ subjectName, subjectCode, section, selectedGrades });
        setOpen(false);
        // Reset form
        setSubjectName('');
        setSection('');
        setSelectedGrades([]);
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Name */}
            <div className="space-y-2">
                <Label htmlFor="subject-name">
                    Subject Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="subject-name"
                    placeholder="e.g., Mathematics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                />
            </div>

            {/* Subject Code (Auto-generated) */}
            <div className="space-y-2">
                <Label htmlFor="subject-code">Subject Code</Label>
                <Input
                    id="subject-code"
                    value={subjectCode}
                    disabled
                    className="bg-muted"
                    placeholder="Auto-generated"
                />
                <p className="text-xs text-muted-foreground">
                    Automatically generated from subject name
                </p>
            </div>

            {/* Section (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="section">Section (Optional)</Label>
                <Select value={section} onValueChange={setSection}>
                    <SelectTrigger id="section">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        {SECTIONS.map((sec) => (
                            <SelectItem key={sec.value} value={sec.value}>
                                {sec.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grade Selector (Toggle Grid) */}
            <div className="space-y-3">
                <Label>
                    Applicable Grades <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                    Select all that apply
                </p>
                <div className="flex flex-wrap gap-2">
                    {GRADES.map((grade) => (
                        <button
                            key={grade}
                            type="button"
                            onClick={() => toggleGrade(grade)}
                            className={cn(
                                'min-h-[40px] rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                                selectedGrades.includes(grade)
                                    ? 'border-transparent bg-black text-white hover:bg-black/90'
                                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            Gr {grade.split(' ')[1]}
                        </button>
                    ))}
                </div>
                {selectedGrades.length === 0 && (
                    <p className="text-xs text-red-500">
                        Please select at least one grade
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={
                        !subjectName.trim() || selectedGrades.length === 0
                    }
                >
                    Save Subject
                </Button>
            </div>
        </form>
    );

    // Desktop: Dialog
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Subject</DialogTitle>
                        <DialogDescription>
                            Add a new subject and assign it to applicable
                            grades.
                        </DialogDescription>
                    </DialogHeader>
                    {formContent}
                </DialogContent>
            </Dialog>
        );
    }

    // Mobile: Sheet (Bottom Drawer)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent side="bottom" className="h-[90%]">
                <SheetHeader>
                    <SheetTitle>Create New Subject</SheetTitle>
                    <SheetDescription>
                        Add a new subject and assign it to applicable grades.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto pb-6">{formContent}</div>
            </SheetContent>
        </Sheet>
    );
}
