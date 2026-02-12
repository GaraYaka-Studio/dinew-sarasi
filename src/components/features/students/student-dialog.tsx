'use client';

import { useState, useRef, useEffect } from 'react';
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
import { StepPayment } from './wizard/step-payment';
import { StepSuccess } from './wizard/step-success';
import { cn } from '@/lib/utils';

interface StudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
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
    // Step 2: Academic
    grade: string;
    batch: string;
    photoMode: 'webcam' | 'upload' | 'skip';
    photoData?: string;
    // Step 3: Payment
    selectedClasses: string[];
    paymentMode: 'later' | 'now' | 'free';
}

const TOTAL_STEPS = 4;

export function StudentDialog({ isOpen, onOpenChange }: StudentDialogProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        mobile: '',
        guardianName: '',
        guardianPhone: '',
        relationship: '',
        school: '',
        dob: '',
        address: '',
        grade: '',
        batch: '',
        photoMode: 'skip',
        selectedClasses: [],
        paymentMode: 'later',
    });

    const [generatedStudentId, setGeneratedStudentId] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

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
                    formData.address
                );
            case 2:
                return !!(formData.grade && formData.batch);
            case 3:
                return true; // Optional selections
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep === 3) {
            // Submit form and move to success
            const newStudentId = `SRS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
            setGeneratedStudentId(newStudentId);
            setCurrentStep(4);
        } else if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleReset = () => {
        setCurrentStep(1);
        setFormData({
            name: '',
            mobile: '',
            guardianName: '',
            guardianPhone: '',
            relationship: '',
            school: '',
            dob: '',
            address: '',
            grade: '',
            batch: '',
            photoMode: 'skip',
            selectedClasses: [],
            paymentMode: 'later',
        });
        setGeneratedStudentId('');
    };

    const handleAddAnother = () => {
        handleReset();
    };

    const handlePrintId = () => {
        // TODO: Implement print logic
        console.log('Print ID for:', generatedStudentId);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset after dialog closes
        setTimeout(() => {
            handleReset();
        }, 300);
    };

    const isNextDisabled = !validateStep(currentStep);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[95vh] max-h-[900px] w-full max-w-3xl flex-col p-0 sm:h-auto">
                {/* Visually Hidden Title for Screen Readers */}
                <DialogTitle className="sr-only">
                    Register New Student - Step {currentStep} of{' '}
                    {TOTAL_STEPS - 1}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Multi-step wizard to register a new student with personal
                    information, academic details, class enrollment, and payment
                    options.
                </DialogDescription>

                {/* Header with Stepper */}
                {currentStep < 4 && (
                    <div className="shrink-0 space-y-4 border-b p-6">
                        <div>
                            <h2 className="text-xl font-bold">
                                Register New Student
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Complete the registration wizard to add a new
                                student.
                            </p>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center justify-between">
                            {/* Desktop: Full Stepper */}
                            <div className="hidden w-full gap-2 sm:flex">
                                {[
                                    'Personal',
                                    'Academic',
                                    'Payment',
                                    'Review',
                                ].map((label, idx) => {
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
                                            {stepNum < 4 && (
                                                <div className="mx-2 h-[2px] flex-1 bg-muted" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile: Simple Progress */}
                            <div className="flex w-full items-center justify-between sm:hidden">
                                <p className="text-sm font-medium">
                                    Step {currentStep} of {TOTAL_STEPS - 1}
                                </p>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map((step) => (
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
                )}

                {/* Body: Scrollable Content */}
                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
                    <div className="p-6">
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
                        {currentStep === 3 && (
                            <StepPayment
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        )}
                        {currentStep === 4 && (
                            <StepSuccess
                                studentData={{
                                    name: formData.name,
                                    studentId: generatedStudentId,
                                }}
                                onPrintId={handlePrintId}
                                onAddAnother={handleAddAnother}
                                onClose={handleClose}
                            />
                        )}
                    </div>
                </div>

                {/* Footer: Navigation */}
                {currentStep < 4 && (
                    <div className="shrink-0 border-t p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                className="text-muted-foreground"
                            >
                                Cancel
                            </Button>

                            <div className="flex gap-2">
                                {currentStep > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    onClick={handleNext}
                                    disabled={isNextDisabled}
                                >
                                    {currentStep === 3 ? 'Finish' : 'Next'}
                                    {currentStep < 3 && (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
