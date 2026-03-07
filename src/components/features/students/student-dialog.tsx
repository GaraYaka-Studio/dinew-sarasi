'use client';

import { useState, useRef, useEffect, useCallback, useActionState } from 'react';
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
import { StepPayment } from './wizard/step-payment';
import { StepSuccess } from './wizard/step-success';
import { cn } from '@/lib/utils';
import { addStudent } from '@/lib/db/insert';
import { getStudents, getClassesByGrade } from '@/lib/db/select';

interface StudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onStudentAdded?: () => void;
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
    selectedClasses: string[];
    // Step 3: Payment
    paymentMode: 'later' | 'now' | 'free';
    selectedMonths: Map<string, number[]>; // classId -> array of month indices
}

const TOTAL_STEPS = 4;

export function StudentDialog({ isOpen, onOpenChange, onStudentAdded }: StudentDialogProps) {
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
        gender: '',
        grade: '',
        batch: '',
        selectedClasses: [],
        paymentMode: 'later',
        selectedMonths: new Map(),
    });

    const [createdStudentId, setCreatedStudentId] = useState<string>('');
    const [createdQrCode, setCreatedQrCode] = useState<string>('');
    const [createdSerialId, setCreatedSerialId] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isSubmittingFromStep3 = useRef(false);
    const hasSubmitted = useRef(false);
    const prevGradeRef = useRef<string>(''); // Track grade changes to reset selectedClasses

    // Track class data (names, fees) for receipt generation
    const [classNamesMap, setClassNamesMap] = useState<Map<string, string>>(new Map());
    const [monthlyFees, setMonthlyFees] = useState<number>(0);

    // Prepare enrollment data for addStudent
    // Capture form data in refs at submission time to avoid re-render issues
    const selectedClassesRef = useRef<string[]>(formData.selectedClasses);
    const selectedMonthsRef = useRef<Map<string, number[]>>(formData.selectedMonths);
    const paymentDataRef = useRef<{ paymentMode: 'later' | 'now' | 'free'; admissionFee: number; monthlyFees: number; total: number }>({
        paymentMode: 'later',
        admissionFee: 0,
        monthlyFees: 0,
        total: 0,
    });

    // Update refs when formData changes
    useEffect(() => {
        selectedClassesRef.current = formData.selectedClasses;
        selectedMonthsRef.current = formData.selectedMonths;
    }, [formData.selectedClasses, formData.selectedMonths]);

    // Reset selectedClasses and selectedMonths when grade changes
    useEffect(() => {
        if (formData.grade && formData.grade !== prevGradeRef.current) {
            if (prevGradeRef.current !== '') {
                // Grade changed, clear selections
                console.log('[StudentDialog] Grade changed, resetting class selections');
                setFormData((prev) => ({
                    ...prev,
                    selectedClasses: [],
                    selectedMonths: new Map(),
                }));
            }
            prevGradeRef.current = formData.grade;
        }
    }, [formData.grade]);

    // Load class data and calculate payment totals when entering step 3
    useEffect(() => {
        if (currentStep === 3 && formData.grade && formData.selectedClasses.length > 0) {
            getClassesByGrade(formData.grade)
                .then((classes) => {
                    const nameMap = new Map<string, string>();
                    let totalMonthlyFees = 0;

                    // Build map of classId -> className
                    // Calculate monthly fees from selected months
                    classes.forEach((cls) => {
                        if (formData.selectedClasses.includes(cls.id)) {
                            nameMap.set(cls.id, cls.name);
                            const monthsForClass = formData.selectedMonths.get(cls.id) || [];
                            totalMonthlyFees += monthsForClass.length * Number(cls.monthlyFee);
                        }
                    });

                    setClassNamesMap(nameMap);
                    setMonthlyFees(totalMonthlyFees);

                    // Calculate admission fee
                    const admissionFee = formData.paymentMode === 'now' ? 1000 : 0;
                    const total = admissionFee + totalMonthlyFees;

                    paymentDataRef.current = {
                        paymentMode: formData.paymentMode,
                        admissionFee,
                        monthlyFees: totalMonthlyFees,
                        total,
                    };
                })
                .catch((error) => {
                    console.error('Failed to load classes for receipt:', error);
                });
        }
    }, [currentStep, formData.grade, formData.selectedClasses, formData.selectedMonths, formData.paymentMode]);

    const [state, formAction, pending] = useActionState(async (_prevState: unknown, formFormData: globalThis.FormData) => {
        // Prevent duplicate submissions
        if (hasSubmitted.current) {
            return {
                success: false,
                status: 429,
                error: 'Submission already in progress',
            };
        }

        // Build personal info from form data
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

        const enrollmentData = selectedClassesRef.current.length > 0
            ? { classIds: selectedClassesRef.current }
            : null;

        const paymentData = {
            paymentMode: formData.paymentMode,
            selectedMonths: formData.selectedMonths,
        };

        console.log('[StudentDialog] Starting submission, hasSubmitted was:', hasSubmitted.current);
        hasSubmitted.current = true;
        try {
            const result = await addStudent(personalInfo, academicInfo, enrollmentData, paymentData, _prevState, formFormData);
            console.log('[StudentDialog] Submission result:', result);
            return result;
        } catch (error) {
            console.error('[StudentDialog] Submission error:', error);
            // Reset on error to allow retry
            hasSubmitted.current = false;
            throw error;
        } finally {
            // Always reset after completion (success or error)
            // The success state will be handled by the useEffect above
            console.log('[StudentDialog] Submission finished, pending should be false now');
        }
    }, {
        success: false,
        status: 0,
        error: null,
        data: {
            studentId: '',
            serialId: 0,
            qrCode: '',
        },
    });

    // Scroll to top when step changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    // Reset submission flags when entering step 3
    useEffect(() => {
        console.log('[StudentDialog] Step changed to:', currentStep);
        if (currentStep === 3) {
            console.log('[StudentDialog] Resetting submission flags for step 3');
            hasSubmitted.current = false;
            isSubmittingFromStep3.current = false;
        }
    }, [currentStep]);

    const updateFormData = useCallback((field: string, value: string | string[] | Map<string, number[]>) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const validateStep = (step: number): { valid: boolean; message?: string } => {
        switch (step) {
            case 1:
                if (!formData.name?.trim()) return { valid: false, message: 'Name is required' };
                if (!formData.mobile?.trim()) return { valid: false, message: 'Mobile number is required' };
                if (!formData.guardianName?.trim()) return { valid: false, message: 'Guardian name is required' };
                if (!formData.guardianPhone?.trim()) return { valid: false, message: 'Guardian phone is required' };
                if (!formData.relationship?.trim()) return { valid: false, message: 'Relationship is required' };
                if (!formData.school?.trim()) return { valid: false, message: 'School is required' };
                if (!formData.dob?.trim()) return { valid: false, message: 'Date of birth is required' };
                if (!formData.address?.trim()) return { valid: false, message: 'Address is required' };
                if (!formData.gender?.trim()) return { valid: false, message: 'Gender is required' };
                return { valid: true };
            case 2:
                if (!formData.grade?.trim()) return { valid: false, message: 'Grade is required' };
                if (!formData.batch?.trim()) return { valid: false, message: 'Batch is required' };
                return { valid: true };
            case 3:
                return { valid: true }; // Payment is optional
            default:
                return { valid: true };
        }
    };

    const clearForm = useCallback(() => {
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
            gender: '',
            grade: '',
            batch: '',
            selectedClasses: [],
            paymentMode: 'later',
            selectedMonths: new Map(),
        });
        setCreatedStudentId('');
        setCreatedQrCode('');
        setCreatedSerialId(0);
        setClassNamesMap(new Map());
        setMonthlyFees(0);
        paymentDataRef.current = {
            paymentMode: 'later',
            admissionFee: 0,
            monthlyFees: 0,
            total: 0,
        };
        prevGradeRef.current = '';
        isSubmittingFromStep3.current = false;
        hasSubmitted.current = false;
    }, []);

    const closeDialog = useCallback(() => {
        onOpenChange(false);
        setTimeout(() => clearForm(), 300);
    }, [onOpenChange, clearForm]);

    const handleNext = () => {
        const validation = validateStep(currentStep);
        if (!validation.valid) {
            toast.error(validation.message || 'Please fill all required fields');
            return;
        }
        if (currentStep < 3) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleAddAnother = () => {
        clearForm();
    };

    const handlePrintId = () => {
        // TODO: Implement print logic
        console.log('Print ID for:', createdSerialId, createdQrCode);
    };

    // Handle success/error state
    useEffect(() => {
        console.log('[StudentDialog] State changed:', { success: state.success, error: state.error, pending });

        if (state.error) {
            toast.error(state.error);
            hasSubmitted.current = false;
        } else if (state.success && isSubmittingFromStep3.current) {
            // Extract student data from response
            const data = (state as any).data as { studentId?: string; qrCode?: string; serialId?: number } | undefined;
            if (data) {
                setCreatedStudentId(data.studentId || '');
                setCreatedQrCode(data.qrCode || '');
                setCreatedSerialId(data.serialId || 0);
            }
            setCurrentStep(4);
            isSubmittingFromStep3.current = false;
            hasSubmitted.current = false;
            // Refresh student list
            getStudents().then(() => {
                if (onStudentAdded) onStudentAdded();
            });
        }
    }, [state.success, state.error, pending, onStudentAdded]);

    // Reset submission state when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            hasSubmitted.current = false;
            isSubmittingFromStep3.current = false;
        }
    }, [isOpen]);

    const validation = validateStep(currentStep);
    // For step 3, only disable if actually submitting (pending is true during submission)
    // Don't include hasSubmitted in the check as it can get stuck
    const isNextDisabled = !validation.valid || pending;

    // Prepare payment data for StepSuccess
    const paymentDataForReceipt = (paymentDataRef.current.total > 0) ? {
        paymentMode: paymentDataRef.current.paymentMode,
        selectedMonths: formData.selectedMonths,
        admissionFee: paymentDataRef.current.admissionFee,
        monthlyFees: paymentDataRef.current.monthlyFees,
        total: paymentDataRef.current.total,
        grade: formData.grade,
        classNames: classNamesMap,
    } : undefined;

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
                                    'Success',
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
                    {/* Steps 1 & 2: No form wrapper - prevents accidental submission */}
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
                    </div>

                    {/* Step 3: Payment - ONLY this step has the form wrapper */}
                    {currentStep === 3 && (
                        <form id="add-student-form" action={formAction} className="p-6">
                            <StepPayment
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        </form>
                    )}

                    {currentStep === 4 && (
                        <div className="p-6">
                            <StepSuccess
                                studentData={{
                                    name: formData.name,
                                    studentId: createdStudentId,
                                    serialId: createdSerialId,
                                    qrCode: createdQrCode,
                                }}
                                paymentData={paymentDataForReceipt}
                                onPrintId={handlePrintId}
                                onAddAnother={handleAddAnother}
                                onClose={closeDialog}
                            />
                        </div>
                    )}
                </div>

                {/* Footer: Navigation */}
                {currentStep < 4 && (
                    <div className="shrink-0 border-t p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={closeDialog}
                                className="text-muted-foreground"
                                disabled={pending}
                                type="button"
                            >
                                Cancel
                            </Button>

                            <div className="flex gap-2">
                                {currentStep > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={pending}
                                        type="button"
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                )}
                                {currentStep === 3 ? (
                                    <Button
                                        type="submit"
                                        form="add-student-form"
                                        disabled={isNextDisabled}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log('[StudentDialog] Finish clicked - hasSubmitted:', hasSubmitted.current, 'pending:', pending);
                                            if (!pending) {
                                                const validation = validateStep(3);
                                                if (validation.valid) {
                                                    isSubmittingFromStep3.current = true;
                                                    // Trigger the form submission programmatically
                                                    const form = document.getElementById('add-student-form') as HTMLFormElement;
                                                    if (form) {
                                                        form.requestSubmit();
                                                    }
                                                } else {
                                                    toast.error(validation.message || 'Please fix errors before submitting');
                                                }
                                            }
                                        }}
                                    >
                                        {pending ? 'Saving...' : 'Finish'}
                                    </Button>
                                ) : (
                                    <Button onClick={handleNext} disabled={isNextDisabled} type="button">
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
