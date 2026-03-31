'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, User } from 'lucide-react';

import { StudentSearch } from '@/components/features/payments/collect/student-search';
import { StudentContext } from '@/components/features/payments/collect/student-context';
import { ClassSelector } from '@/components/features/payments/collect/class-selector';
import { FeeGrid } from '@/components/features/payments/collect/fee-grid';
import {
    PaymentTerminal,
    CartItem,
} from '@/components/features/payments/collect/payment-terminal';
import {
    ReceiptView,
    ReceiptItem,
} from '@/components/features/payments/collect/receipt-view';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { ClassFeeStructure, StudentDetail } from '@/lib/mock-data';
import { searchStudents, getStudentFeeStructure } from '@/lib/db/select';
import { recordPayment, PaymentCartItem } from '@/lib/db/insert';
import {
    transformToStudentDetail,
    transformToFeeStructure,
    StudentSearchResult,
} from '@/lib/db/transformers';

// ============================================================================
// Types
// ============================================================================

type PageState = 'search' | 'select_class' | 'payment' | 'receipt';

interface ReceiptData {
    receiptNumber: string;
    studentName: string;
    studentId: string;
    grade: string;
    items: ReceiptItem[];
    totalAmount: number;
    cashReceived: number;
    balance: number;
    date: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function FeesCollectionPage() {
    // State
    const [pageState, setPageState] = useState<PageState>('search');
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [feeClasses, setFeeClasses] = useState<ClassFeeStructure[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<StudentSearchResult[]>(
        []
    );
    const [selectedStudent, setSelectedStudent] =
        useState<StudentSearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

    // Derived
    const totalAmount = cart.reduce((acc, item) => acc + item.amount, 0);
    const totalClasses = feeClasses.length || 0;
    const totalUnpaidMonths = feeClasses.reduce(
        (sum, cls) => sum + cls.totalUnpaid,
        0
    );
    const totalDue = feeClasses.reduce((sum, cls) => sum + cls.totalDue, 0);

    // ============================================================================
    // Handlers
    // ============================================================================

    const handleSearch = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const results = await searchStudents(query);
            setSearchResults(results);

            // Auto-select first result if exact match (e.g., QR scan or exact student_id)
            if (results.length === 1) {
                handleSelectStudent(results[0]);
            }
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('Failed to search students');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectStudent = async (dbStudent: StudentSearchResult) => {
        setIsLoading(true);
        setSearchResults([]);

        try {
            // Fetch fee structure
            const feeStructure = await getStudentFeeStructure(dbStudent.id);

            // Transform to UI format
            const transformedStudent = transformToStudentDetail({
                ...dbStudent,
                enrolledClasses: feeStructure,
            });

            setStudent(transformedStudent);
            setFeeClasses(transformToFeeStructure(feeStructure));
            setSelectedStudent(dbStudent);
            setPageState('select_class');

            // Admission trap logic
            const isNewStudent = selectedStudent?.id !== dbStudent.id;
            if (dbStudent.admissionStatus === 'pending' && isNewStudent) {
                const admissionFee: CartItem = {
                    id: 'admission-fee',
                    label: 'Admission Fee',
                    subLabel: 'One-time registration fee',
                    amount: Number(dbStudent.admissionFee) || 1000,
                    type: 'admission',
                };
                setCart([admissionFee]);
                toast.warning(
                    'Admission Pending: Fee added to bill automatically.'
                );
            } else if (dbStudent.admissionStatus !== 'pending') {
                setCart([]);
            }
        } catch (error) {
            console.error('Failed to load student data:', error);
            toast.error('Failed to load student fee structure');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setStudent(null);
        setFeeClasses([]);
        setSelectedClassId(null);
        setCart([]);
        setIsSheetOpen(false);
        setSelectedStudent(null);
        setSearchResults([]);
        setPageState('search');
        setReceiptData(null);
    };

    const handleSelectClass = (classId: string) => {
        setSelectedClassId(classId);
        setPageState('payment');
    };

    const handleBackToClassSelection = () => {
        setSelectedClassId(null);
        setPageState('select_class');
    };

    const handleToggleMonth = (classId: string, monthIndex: number) => {
        // Find the class and month first to do validation
        const cls = feeClasses.find((c) => c.classId === classId);
        if (!cls) return;

        const month = cls.months[monthIndex];
        if (!month) return;

        // Validation checks
        if (month.isFuture) {
            toast.error('Cannot pay for future months');
            return;
        }
        if (month.isBeforeEnrollment) {
            toast.error('Cannot pay for months before enrollment');
            return;
        }

        const itemId = `${classId}-${monthIndex}`;

        // Handle deselection
        if (month.status === 'selected') {
            // Deselect - go back to unpaid
            setFeeClasses((prev) =>
                prev.map((c) => {
                    if (c.classId !== classId) return c;
                    return {
                        ...c,
                        months: c.months.map((m, idx) =>
                            idx === monthIndex
                                ? { ...m, status: 'unpaid' as const }
                                : m
                        ),
                    };
                })
            );
            setCart((prev) => prev.filter((item) => item.id !== itemId));
            return;
        }

        // Handle adding to cart (from unpaid or skipped state)
        if (month.status === 'unpaid' || month.status === 'skipped') {
            // Add to cart first
            const newItem: CartItem = {
                id: itemId,
                label: cls.className,
                subLabel: `${month.month} ${month.year}`,
                amount: month.amount - (month.paidAmount || 0),
                type: 'monthly_fee',
                classId,
                monthIndex,
            };
            setCart((prev) => [...prev, newItem]);

            // Then update the month status
            setFeeClasses((prev) =>
                prev.map((c) => {
                    if (c.classId !== classId) return c;
                    return {
                        ...c,
                        months: c.months.map((m, idx) =>
                            idx === monthIndex
                                ? { ...m, status: 'selected' as const }
                                : m
                        ),
                    };
                })
            );
            return;
        }

        // Handle partial payment
        if (month.status === 'partial') {
            const newItem: CartItem = {
                id: itemId,
                label: cls.className,
                subLabel: `${month.month} ${month.year}`,
                amount: month.amount - (month.paidAmount || 0),
                type: 'monthly_fee',
                classId,
                monthIndex,
            };
            setCart((prev) => [...prev, newItem]);

            setFeeClasses((prev) =>
                prev.map((c) => {
                    if (c.classId !== classId) return c;
                    return {
                        ...c,
                        months: c.months.map((m, idx) =>
                            idx === monthIndex
                                ? { ...m, status: 'selected' as const }
                                : m
                        ),
                    };
                })
            );
        }
    };

    const handleRemoveCartItem = (id: string) => {
        const item = cart.find((i) => i.id === id);
        if (
            item &&
            item.type === 'monthly_fee' &&
            item.classId &&
            item.monthIndex !== undefined
        ) {
            handleToggleMonth(item.classId, item.monthIndex);
        } else {
            setCart((prev) => prev.filter((i) => i.id !== id));
        }
    };

    const handleCompletePayment = async (cashReceived: number) => {
        if (!selectedStudent) return;

        setIsLoading(true);
        try {
            // Transform cart to payment items
            const paymentItems: PaymentCartItem[] = cart.map((item) => ({
                type: item.type === 'admission' ? 'admission' : 'monthly',
                classId: item.classId,
                monthIndex: item.monthIndex,
                year: new Date().getFullYear(),
                amount: item.amount,
            }));

            const result = await recordPayment(
                selectedStudent.id,
                paymentItems,
                totalAmount,
                'cash',
                null,
                null,
                new FormData()
            );

            if (result.success) {
                // Create receipt data
                const receipt: ReceiptData = {
                    receiptNumber: String(result.receiptNumber || ''),
                    studentName: student?.name || '',
                    studentId: student?.studentId || '',
                    grade: student?.grade || '',
                    items: cart.map((item) => ({
                        label: item.label,
                        amount: item.amount,
                    })),
                    totalAmount,
                    cashReceived,
                    balance: cashReceived - totalAmount,
                    date: new Date().toISOString(),
                };
                setReceiptData(receipt);
                setPageState('receipt');
            } else {
                toast.error(result.error || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Failed to process payment');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayAdmission = () => {
        if (cart.find((c) => c.type === 'admission')) return;

        const admissionFee: CartItem = {
            id: 'admission-fee',
            label: 'Admission Fee',
            subLabel: 'Manual add',
            amount: Number(student?.admissionFee) || 1000,
            type: 'admission',
        };
        setCart((prev) => [...prev, admissionFee]);
    };

    const handleReceiptPrint = () => {
        // TODO: Implement receipt printing
        toast.info('Receipt printing feature coming soon');
    };

    const handleReceiptClose = () => {
        handleClear();
    };

    // ============================================================================
    // Render
    // ============================================================================

    // Receipt State
    if (pageState === 'receipt' && receiptData) {
        return (
            <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-background">
                <ReceiptView
                    {...receiptData}
                    onClose={handleReceiptClose}
                    onPrint={handleReceiptPrint}
                />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-140px)] flex-col gap-0 overflow-hidden rounded-lg border bg-background shadow-sm md:flex-row md:gap-0">
            {/* Left Panel: Context & Selection (65%) */}
            <div className="flex flex-1 flex-col overflow-hidden border-r bg-muted/10 md:w-[65%]">
                {/* 1. Omni-Search Bar */}
                <div className="relative z-10 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <StudentSearch
                        onSearch={handleSearch}
                        onClear={handleClear}
                    />

                    {/* Search Results Dropdown */}
                    {searchResults.length > 1 && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border bg-background shadow-lg">
                            {searchResults.map((s) => (
                                <button
                                    key={s.id}
                                    className="w-full px-4 py-3 text-left transition-colors hover:bg-muted/50"
                                    onClick={() => handleSelectStudent(s)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">
                                                {s.fullName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {s.phone} • Grade:{' '}
                                                {s.grade || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            SRS-{s.studentId}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
                    {student ? (
                        <>
                            {/* 2. Student Context */}
                            <div className="animate-in duration-500 fade-in-50 slide-in-from-top-5">
                                <StudentContext
                                    student={student}
                                    onPayAdmission={handlePayAdmission}
                                    totalClasses={totalClasses}
                                    totalUnpaidMonths={totalUnpaidMonths}
                                    totalDue={totalDue}
                                />
                            </div>

                            {/* 3. Class Selector - stays visible when class is selected */}
                            {(pageState === 'select_class' ||
                                pageState === 'payment') && (
                                <div className="animate-in delay-75 duration-500 fade-in-50 slide-in-from-bottom-5">
                                    <ClassSelector
                                        classes={feeClasses}
                                        selectedClassId={selectedClassId}
                                        onSelectClass={handleSelectClass}
                                    />
                                </div>
                            )}

                            {/* 4. Fee Grid - shows when a class is selected */}
                            {selectedClassId && (
                                <div className="animate-in delay-75 duration-500 fade-in-50 slide-in-from-bottom-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                            Fee Payment
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleBackToClassSelection}
                                        >
                                            ← Change Class
                                        </Button>
                                    </div>
                                    <FeeGrid
                                        feeClasses={feeClasses}
                                        selectedClassId={selectedClassId}
                                        onToggleMonth={handleToggleMonth}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground opacity-70">
                            <User className="h-16 w-16" />
                            <p className="text-lg font-medium">
                                Search for a student to begin
                            </p>
                            <div className="text-sm">
                                Type name, phone, or student ID (min 2 chars)
                            </div>
                            {isLoading && (
                                <div className="text-sm text-primary">
                                    Searching...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: The Terminal (35%) - DESKTOP */}
            <div className="z-20 hidden h-full bg-card shadow-lg md:block md:w-[35%]">
                <PaymentTerminal
                    items={cart}
                    onRemoveItem={handleRemoveCartItem}
                    onComplete={handleCompletePayment}
                    onClear={handleClear}
                />
            </div>

            {/* Mobile Bottom Bar & Sheet */}
            <div className="md:hidden">
                {student && selectedClassId && (
                    <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t bg-background p-4 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Total Due
                                </p>
                                <p className="text-xl font-bold">
                                    {totalAmount.toLocaleString()} LKR
                                </p>
                            </div>
                            <Sheet
                                open={isSheetOpen}
                                onOpenChange={setIsSheetOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button
                                        size="lg"
                                        className="px-8 font-bold"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Review & Pay ({cart.length})
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="bottom"
                                    className="h-[90vh] rounded-t-2xl p-0"
                                >
                                    <SheetTitle className="sr-only">
                                        Payment Terminal
                                    </SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Complete your payment transaction
                                    </SheetDescription>
                                    <PaymentTerminal
                                        items={cart}
                                        onRemoveItem={handleRemoveCartItem}
                                        onComplete={(cash) => {
                                            handleCompletePayment(cash);
                                            setIsSheetOpen(false);
                                        }}
                                        onClear={handleClear}
                                    />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
