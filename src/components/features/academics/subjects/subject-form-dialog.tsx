import {
    useState,
    useMemo,
    useEffect,
    useEffectEvent,
    useActionState,
} from 'react';

import { toast } from 'sonner';

import { addSubject } from '@/lib/db/insert';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

import { GRADES, SECTIONS } from '@/lib/constants';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SubjectFormDialogProps {
    trigger: React.ReactNode;
}

export function SubjectFormDialog({ trigger }: SubjectFormDialogProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [formValues, setFormValues] = useState({
        subjectName: '',
        section: '',
    });
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

    // Auto-generate subject code from name using useMemo
    const subjectCode = useMemo(() => {
        if (formValues.subjectName.trim()) {
            const code = formValues.subjectName
                .toUpperCase()
                .split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .slice(0, 4);
            return (
                code +
                '-' +
                (formValues.section
                    ? formValues.section.toUpperCase().slice(0, 2)
                    : 'GEN')
            );
        }
        return '';
    }, [formValues.subjectName, formValues.section]);

    const addSubjectWithCodes = addSubject.bind(
        null,
        selectedGrades,
        subjectCode
    );
    const [state, formAction, pending] = useActionState(addSubjectWithCodes, {
        success: false,
        status: 0,
        error: null,
    });

    const toggleGrade = (grade: string) => {
        setSelectedGrades((prev) =>
            prev.includes(grade)
                ? prev.filter((g) => g !== grade)
                : [...prev, grade]
        );
    };

    const closeForm = useEffectEvent(() => {
        setOpen(false);
    });

    const clearForm = useEffectEvent(() => {
        setFormValues({
            subjectName: '',
            section: '',
        });
        setSelectedGrades([]);
    });

    useEffect(() => {
        if (!open) clearForm();
    }, [open]);

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Subject added successfully!');
            closeForm();
        }
    }, [state]);

    const formContent = (
        <form action={formAction} className="space-y-6">
            {/* Subject Name */}
            <div className="space-y-2">
                <Label htmlFor="subject-name">
                    Subject Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="subjectName"
                    name="subjectName"
                    defaultValue={formValues.subjectName}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            subjectName: e.target.value,
                        })
                    }
                    placeholder="e.g., Mathematics"
                    required
                />
            </div>

            {/* Subject Code (Auto-generated) */}
            <div className="space-y-2">
                <Label htmlFor="subject-code">Subject Code</Label>
                <Input
                    id="subjectCode"
                    name="subjectCode"
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
                <Select
                    name="section"
                    defaultValue={formValues.section}
                    onValueChange={(v) =>
                        setFormValues({
                            ...formValues,
                            section: v,
                        })
                    }
                >
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
                    disabled={pending}
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={
                        pending ||
                        !formValues.subjectName.trim() ||
                        selectedGrades.length === 0
                    }
                >
                    {pending ? 'Saving...' : 'Save Subject'}
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
