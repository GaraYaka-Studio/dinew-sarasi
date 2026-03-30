'use client';

import { useActionState, useEffect, useEffectEvent, useState } from 'react';

import { toast } from 'sonner';

import { User, GraduationCap } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { TEACHING_SUBJECTS } from '@/lib/constants';
import { addTeacher } from '@/lib/db/insert';

interface TeacherDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TeacherDialog({ isOpen, onOpenChange }: TeacherDialogProps) {
    const [formValues, setFormValues] = useState({
        fullName: '',
        displayName: '',
        nic: '',
        phone: '',
    });
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const addTeacherWithSubjects = addTeacher.bind(null, selectedSubjects);
    const [state, formAction, pending] = useActionState(
        addTeacherWithSubjects,
        { success: false, status: 0, error: null }
    );

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject]
        );
    };

    const clearForm = useEffectEvent(() => {
        setFormValues({
            fullName: '',
            displayName: '',
            nic: '',
            phone: '',
        });
        setSelectedSubjects([]);
    });

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Teacher added successfully!');
            onOpenChange(false);
            clearForm();
        }
    }, [state, onOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="flex h-[95vh] max-h-[900px] w-full max-w-lg flex-col p-0 sm:h-auto"
                showCloseButton={false}
            >
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>
                        Create a new teacher profile for the system.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form
                        id="add-teacher-form"
                        action={formAction}
                        className="space-y-6"
                    >
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <User className="h-4 w-4" /> Personal
                                Information
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        defaultValue={formValues.fullName}
                                        onChange={(e) => {
                                            setFormValues({
                                                ...formValues,
                                                fullName: e.target.value,
                                            });
                                        }}
                                        placeholder="e.g., Kamal Perera"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="displayName">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="displayName"
                                        name="displayName"
                                        defaultValue={formValues.displayName}
                                        onChange={(e) => {
                                            setFormValues({
                                                ...formValues,
                                                displayName: e.target.value,
                                            });
                                        }}
                                        placeholder="e.g., Mr. Kamal"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nic">NIC</Label>
                                        <Input
                                            id="nic"
                                            name="nic"
                                            defaultValue={formValues.nic}
                                            onChange={(e) => {
                                                setFormValues({
                                                    ...formValues,
                                                    nic: e.target.value,
                                                });
                                            }}
                                            placeholder="123456789V"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            defaultValue={formValues.phone}
                                            onChange={(e) => {
                                                setFormValues({
                                                    ...formValues,
                                                    phone: e.target.value,
                                                });
                                            }}
                                            placeholder="077-1234567"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information Section */}
                        <div className="space-y-4 border-t pt-2">
                            <h3 className="mt-2 flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <GraduationCap className="h-4 w-4" /> Academic
                                Information
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subjects">Subjects</Label>
                                    <div className="rounded-md border p-3">
                                        <div className="flex flex-wrap gap-2">
                                            {TEACHING_SUBJECTS.map(
                                                (subject) => (
                                                    <button
                                                        key={subject}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSubject(
                                                                subject
                                                            )
                                                        }
                                                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                            selectedSubjects.includes(
                                                                subject
                                                            )
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                        }`}
                                                    >
                                                        {subject}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                        {selectedSubjects.length === 0 && (
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Select subjects to teach...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="gap-2 border-t px-6 py-4 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={() => {
                            onOpenChange(false);
                            setFormValues({
                                fullName: '',
                                displayName: '',
                                nic: '',
                                phone: '',
                            });
                            setSelectedSubjects([]);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-teacher-form"
                        disabled={pending}
                        className="bg-black text-white hover:bg-black/90"
                    >
                        {pending ? 'Saving...' : 'Save Teacher'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
