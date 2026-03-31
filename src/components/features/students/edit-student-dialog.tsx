'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepPersonal } from './wizard/step-personal';
import { StepAcademic } from './wizard/step-academic';
import { cn } from '@/lib/utils';
import { updateStudent } from '@/lib/db/update';
import { Student } from '@/types/schema.types';

interface EditStudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    student: Student | null;
    onStudentUpdated?: () => void;
}

interface FormData {
    // Step 1: Personal
    name: string;
    mobile: string;
    guardianName: string;
    guardianPhone: string;
    relationship: string;
    school: string;
    dob: string;
    address: string;
    gender: string;
    // Step 2: Academic
    grade: string;
    batch: string;
    photoMode: 'webcam' | 'upload' | 'skip';
    photoData?: string;
    // Step 3: Payment
    selectedClasses: string[];
    paymentMode: 'later' | 'now' | 'free';
}

const TOTAL_STEPS = 2; // Personal + Academic only (no payment for edit)

export function EditStudentDialog({
    isOpen,
    onOpenChange,
    student,
    onStudentUpdated,
}: EditStudentDialogProps) {
    // Helper to get initial form data from student
    const getInitialFormData = (student: Student | null): FormData => ({
        name: student?.full_name || '',
        mobile: student?.phone || '',
        guardianName: student?.guardian_name || '',
        guardianPhone: student?.guardian_phone || '',
        relationship: student?.guardian_relationship || '',
        school: student?.school || '',
        dob: student?.dob?.toString().split('T')[0] || '',
        address: student?.address || '',
        gender: student?.gender || '',
        grade: student?.current_grade || '',
        batch: student?.batch_year ? student.batch_year.toString() : '',
        photoMode: 'skip',
        selectedClasses: [],
        paymentMode: 'later',
    });

    // Use lazy initialization - Dialog will remount when student changes via key prop
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(() =>
        getInitialFormData(student)
    );

    const scrollRef = useRef<HTMLDivElement>(null);

    // Bind updateStudent with form data
    const personalInfo = {
        fullName: formData.name,
        phone: formData.mobile,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        relationship: formData.relationship,
        school: formData.school,
        dob: formData.dob,
        address: formData.address,
        gender: formData.gender,
    };

    const academicInfo = {
        grade: formData.grade,
        batch: formData.batch,
    };

    const updateStudentBound = student
        ? updateStudent.bind(null, student.id, personalInfo, academicInfo)
        : null;
    const [state, formAction, pending] = useActionState(
        updateStudentBound ||
            (() => ({ success: false, status: 0, error: null })),
        { success: false, status: 0, error: null }
    );

    // Scroll to top when step changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    const updateFormData = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(
                    formData.name &&
                    formData.mobile &&
                    formData.guardianName &&
                    formData.guardianPhone &&
                    formData.relationship &&
                    formData.school &&
                    formData.dob &&
                    formData.address &&
                    formData.gender
                );
            case 2:
                return !!(formData.grade && formData.batch);
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Handle success/error state
    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Student updated successfully');
            onOpenChange(false);
            if (onStudentUpdated) onStudentUpdated();
        }
    }, [state.success, state.error, onOpenChange, onStudentUpdated]);

    const isNextDisabled = !validateStep(currentStep) || pending;

    if (!student) return null;

    return (
        <Dialog key={student?.id} open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[95vh] max-h-[900px] w-full max-w-3xl flex-col p-0 sm:h-auto">
                {/* Visually Hidden Title for Screen Readers */}
                <DialogTitle className="sr-only">
                    Edit Student - {student.full_name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Update student information including personal details and
                    academic information.
                </DialogDescription>

                {/* Header with Stepper */}
                <div className="shrink-0 space-y-4 border-b p-6">
                    <div>
                        <h2 className="text-xl font-bold">Edit Student</h2>
                        <p className="text-sm text-muted-foreground">
                            Update information for {student.full_name}
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between">
                        {/* Desktop: Full Stepper */}
                        <div className="hidden w-full gap-2 sm:flex">
                            {['Personal', 'Academic'].map((label, idx) => {
                                const stepNum = idx + 1;
                                const isActive = currentStep === stepNum;
                                const isCompleted = currentStep > stepNum;

                                return (
                                    <div
                                        key={stepNum}
                                        className="flex flex-1 items-center"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                                                    isCompleted &&
                                                        'bg-green-500 text-white',
                                                    isActive &&
                                                        'bg-primary text-primary-foreground',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        'bg-muted text-muted-foreground'
                                                )}
                                            >
                                                {stepNum}
                                            </div>
                                            <span
                                                className={cn(
                                                    'text-sm font-medium',
                                                    isActive &&
                                                        'text-foreground',
                                                    !isActive &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        {stepNum < 2 && (
                                            <div className="mx-2 h-[2px] flex-1 bg-muted" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile: Simple Progress */}
                        <div className="flex w-full items-center justify-between sm:hidden">
                            <p className="text-sm font-medium">
                                Step {currentStep} of {TOTAL_STEPS}
                            </p>
                            <div className="flex gap-1">
                                {[1, 2].map((step) => (
                                    <div
                                        key={step}
                                        className={cn(
                                            'h-2 w-8 rounded-full transition-colors',
                                            currentStep >= step
                                                ? 'bg-primary'
                                                : 'bg-muted'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body: Scrollable Content */}
                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
                    <form
                        id="edit-student-form"
                        action={formAction}
                        className="p-6"
                    >
                        {currentStep === 1 && (
                            <StepPersonal
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        )}
                        {currentStep === 2 && (
                            <StepAcademic
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        )}
                    </form>
                </div>

                {/* Footer: Navigation */}
                <div className="shrink-0 border-t p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-muted-foreground"
                            disabled={pending}
                        >
                            Cancel
                        </Button>

                        <div className="flex gap-2">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={pending}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            )}
                            {currentStep === 2 ? (
                                <Button
                                    type="submit"
                                    form="edit-student-form"
                                    disabled={isNextDisabled}
                                >
                                    {pending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    disabled={isNextDisabled}
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
