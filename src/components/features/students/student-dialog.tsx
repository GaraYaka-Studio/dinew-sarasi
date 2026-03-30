'use client';

import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useActionState,
} from 'react';
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
import { StepSuccess } from './wizard/step-success';
import { cn } from '@/lib/utils';
import { addStudent } from '@/lib/db/insert';
import { getStudents } from '@/lib/db/select';

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
}

const TOTAL_STEPS = 3;

export function StudentDialog({
    isOpen,
    onOpenChange,
    onStudentAdded,
}: StudentDialogProps) {
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
    });

    const [createdStudentId, setCreatedStudentId] = useState<string>('');
    const [createdQrCode, setCreatedQrCode] = useState<string>('');
    const [createdSerialId, setCreatedSerialId] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isSubmittingFromStep2 = useRef(false);
    const hasSubmitted = useRef(false);
    const prevGradeRef = useRef<string>(''); // Track grade changes to reset selectedClasses

    // Prepare enrollment data for addStudent
    // Capture form data in refs at submission time to avoid re-render issues
    const selectedClassesRef = useRef<string[]>(formData.selectedClasses);

    // Update refs when formData changes
    useEffect(() => {
        selectedClassesRef.current = formData.selectedClasses;
    }, [formData.selectedClasses]);

    // Reset selectedClasses when grade changes
    useEffect(() => {
        if (formData.grade && formData.grade !== prevGradeRef.current) {
            if (prevGradeRef.current !== '') {
                // Grade changed, clear selections
                console.log(
                    '[StudentDialog] Grade changed, resetting class selections'
                );
                setFormData((prev) => ({
                    ...prev,
                    selectedClasses: [],
                }));
            }
            prevGradeRef.current = formData.grade;
        }
    }, [formData.grade]);

    const [state, formAction, pending] = useActionState(
        async (_prevState: unknown, formFormData: globalThis.FormData) => {
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

            const enrollmentData =
                selectedClassesRef.current.length > 0
                    ? { classIds: selectedClassesRef.current }
                    : null;

            console.log(
                '[StudentDialog] Starting submission, hasSubmitted was:',
                hasSubmitted.current
            );
            hasSubmitted.current = true;
            try {
                const result = await addStudent(
                    personalInfo,
                    academicInfo,
                    enrollmentData,
                    null,
                    _prevState,
                    formFormData
                );
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
                console.log(
                    '[StudentDialog] Submission finished, pending should be false now'
                );
            }
        },
        {
            success: false,
            status: 0,
            error: null,
            data: {
                studentId: '',
                serialId: 0,
                qrCode: '',
            },
        }
    );

    // Scroll to top when step changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    // Reset submission flags when entering step 2 (academic)
    useEffect(() => {
        console.log('[StudentDialog] Step changed to:', currentStep);
        if (currentStep === 2) {
            console.log(
                '[StudentDialog] Resetting submission flags for step 2'
            );
            hasSubmitted.current = false;
            isSubmittingFromStep2.current = false;
        }
    }, [currentStep]);

    const updateFormData = useCallback(
        (field: string, value: string | string[]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const validateStep = (
        step: number
    ): { valid: boolean; message?: string } => {
        switch (step) {
            case 1:
                if (!formData.name?.trim())
                    return { valid: false, message: 'Name is required' };
                if (!formData.mobile?.trim())
                    return {
                        valid: false,
                        message: 'Mobile number is required',
                    };
                if (!formData.guardianName?.trim())
                    return {
                        valid: false,
                        message: 'Guardian name is required',
                    };
                if (!formData.guardianPhone?.trim())
                    return {
                        valid: false,
                        message: 'Guardian phone is required',
                    };
                if (!formData.relationship?.trim())
                    return {
                        valid: false,
                        message: 'Relationship is required',
                    };
                if (!formData.school?.trim())
                    return { valid: false, message: 'School is required' };
                if (!formData.dob?.trim())
                    return {
                        valid: false,
                        message: 'Date of birth is required',
                    };
                if (!formData.address?.trim())
                    return { valid: false, message: 'Address is required' };
                if (!formData.gender?.trim())
                    return { valid: false, message: 'Gender is required' };
                return { valid: true };
            case 2:
                if (!formData.grade?.trim())
                    return { valid: false, message: 'Grade is required' };
                if (!formData.batch?.trim())
                    return { valid: false, message: 'Batch is required' };
                return { valid: true };
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
        });
        setCreatedStudentId('');
        setCreatedQrCode('');
        setCreatedSerialId(0);
        prevGradeRef.current = '';
        isSubmittingFromStep2.current = false;
        hasSubmitted.current = false;
    }, []);

    const closeDialog = useCallback(() => {
        onOpenChange(false);
        setTimeout(() => clearForm(), 300);
    }, [onOpenChange, clearForm]);

    const handleNext = () => {
        const validation = validateStep(currentStep);
        if (!validation.valid) {
            toast.error(
                validation.message || 'Please fill all required fields'
            );
            return;
        }
        if (currentStep < 2) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        } else if (currentStep === 2) {
            // Submit from step 2 (Academic)
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const validation = validateStep(2);
        if (!validation.valid) {
            toast.error(
                validation.message || 'Please fix errors before submitting'
            );
            return;
        }
        isSubmittingFromStep2.current = true;
        // Trigger the form submission programmatically
        const form = document.getElementById(
            'add-student-form'
        ) as HTMLFormElement;
        if (form) {
            form.requestSubmit();
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
        console.log('[StudentDialog] State changed:', {
            success: state.success,
            error: state.error,
            pending,
        });

        if (state.error) {
            toast.error(state.error);
            hasSubmitted.current = false;
        } else if (state.success && isSubmittingFromStep2.current) {
            // Extract student data from response
            const data = (state.success === true ? state.data : undefined) as
                | { studentId?: string; qrCode?: string; serialId?: number }
                | undefined;
            if (data) {
                setCreatedStudentId(data.studentId || '');
                setCreatedQrCode(data.qrCode || '');
                setCreatedSerialId(data.serialId || 0);
            }
            setCurrentStep(3);
            isSubmittingFromStep2.current = false;
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
            isSubmittingFromStep2.current = false;
        }
    }, [isOpen]);

    const validation = validateStep(currentStep);
    const isNextDisabled = !validation.valid || pending;

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
                    information, academic details, and class enrollment.
                </DialogDescription>

                {/* Header with Stepper */}
                {currentStep < 3 && (
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
                                {['Personal', 'Academic', 'Success'].map(
                                    (label, idx) => {
                                        const stepNum = idx + 1;
                                        const isActive =
                                            currentStep === stepNum;
                                        const isCompleted =
                                            currentStep > stepNum;

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
                                                {stepNum < 3 && (
                                                    <div className="mx-2 h-[2px] flex-1 bg-muted" />
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* Mobile: Simple Progress */}
                            <div className="flex w-full items-center justify-between sm:hidden">
                                <p className="text-sm font-medium">
                                    Step {currentStep} of {TOTAL_STEPS - 1}
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
                )}

                {/* Body: Scrollable Content */}
                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
                    {/* Step 1: Personal - No form wrapper */}
                    {currentStep === 1 && (
                        <div className="p-6">
                            <StepPersonal
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        </div>
                    )}

                    {/* Step 2: Academic - Form wrapper for submission */}
                    {currentStep === 2 && (
                        <form
                            id="add-student-form"
                            action={formAction}
                            className="p-6"
                        >
                            <StepAcademic
                                formData={formData}
                                onUpdate={updateFormData}
                            />
                        </form>
                    )}

                    {/* Step 3: Success */}
                    {currentStep === 3 && (
                        <div className="p-6">
                            <StepSuccess
                                studentData={{
                                    name: formData.name,
                                    studentId: createdStudentId,
                                    serialId: createdSerialId,
                                    qrCode: createdQrCode,
                                }}
                                onPrintId={handlePrintId}
                                onAddAnother={handleAddAnother}
                                onClose={closeDialog}
                            />
                        </div>
                    )}
                </div>

                {/* Footer: Navigation */}
                {currentStep < 3 && (
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
                                {currentStep === 2 ? (
                                    <Button
                                        type="submit"
                                        form="add-student-form"
                                        disabled={isNextDisabled}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log(
                                                '[StudentDialog] Finish clicked - hasSubmitted:',
                                                hasSubmitted.current,
                                                'pending:',
                                                pending
                                            );
                                            if (!pending) {
                                                const validation =
                                                    validateStep(2);
                                                if (validation.valid) {
                                                    isSubmittingFromStep2.current = true;
                                                    // Trigger the form submission programmatically
                                                    const form =
                                                        document.getElementById(
                                                            'add-student-form'
                                                        ) as HTMLFormElement;
                                                    if (form) {
                                                        form.requestSubmit();
                                                    }
                                                } else {
                                                    toast.error(
                                                        validation.message ||
                                                            'Please fix errors before submitting'
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        {pending ? 'Saving...' : 'Finish'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        disabled={isNextDisabled}
                                        type="button"
                                    >
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
