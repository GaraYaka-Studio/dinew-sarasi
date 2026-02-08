'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { User, GraduationCap } from 'lucide-react';
import { TEACHER_SUBJECTS } from '@/lib/mock-data-teachers';

interface TeacherDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TeacherDialog({ isOpen, onOpenChange }: TeacherDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        setSelectedSubjects([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[95vh] max-h-[900px] w-full max-w-lg flex-col p-0 sm:h-auto">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>
                        Create a new teacher profile for the system.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form
                        id="add-teacher-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <User className="h-4 w-4" /> Personal Information
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
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
                                        placeholder="e.g., Mr. Kamal"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nic">NIC</Label>
                                        <Input
                                            id="nic"
                                            placeholder="123456789V"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="077-1234567"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Home address..."
                                        rows={3}
                                    />
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
                                            {TEACHER_SUBJECTS.map((subject) => (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleSubject(subject)
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
                                            ))}
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
                        onClick={() => {
                            onOpenChange(false);
                            setSelectedSubjects([]);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-teacher-form"
                        disabled={isLoading}
                        className="bg-black text-white hover:bg-black/90"
                    >
                        {isLoading ? 'Saving...' : 'Save Teacher'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
