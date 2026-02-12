'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, User } from 'lucide-react';

import { StudentSearch } from '@/components/features/payments/collect/student-search';
import { StudentContext } from '@/components/features/payments/collect/student-context';
import { FeeGrid } from '@/components/features/payments/collect/fee-grid';
import {
    PaymentTerminal,
    CartItem,
} from '@/components/features/payments/collect/payment-terminal';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    MOCK_FEE_STRUCTURE,
    ClassFeeStructure,
    StudentDetail,
} from '@/lib/mock-data';

export default function FeesCollectionPage() {
    // State
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [feeClasses, setFeeClasses] = useState<ClassFeeStructure[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Derived
    const totalAmount = cart.reduce((acc, item) => acc + item.amount, 0);

    // Handlers
    const handleSearch = () => {
        // Simulate API Fetch
        const mockData = MOCK_FEE_STRUCTURE;
        setStudent(mockData.student);
        setFeeClasses(JSON.parse(JSON.stringify(mockData.feeClasses))); // Deep copy to allow visual state changes

        // Admission Trap Logic
        if (mockData.student.admissionStatus === 'PENDING') {
            const admissionFee: CartItem = {
                id: 'admission-fee',
                label: 'Admission Fee',
                subLabel: 'One-time registration fee',
                amount: 1000, // Should come from config
                type: 'admission',
            };
            setCart([admissionFee]);
            toast.warning(
                'Admission Pending: Fee added to bill automatically.'
            );
        } else {
            setCart([]);
        }
    };

    const handleClear = () => {
        setStudent(null);
        setFeeClasses([]);
        setCart([]);
        setIsSheetOpen(false);
    };

    const handleToggleMonth = (classId: string, monthIndex: number) => {
        setFeeClasses((currentClasses) => {
            return currentClasses.map((cls) => {
                if (cls.classId !== classId) return cls;

                const updatedMonths = [...cls.months];
                const targetMonth = cls.months[monthIndex];

                // Toggle Logic in Cart
                const itemId = `${classId}-${monthIndex}`;

                if (targetMonth.status === 'selected') {
                    // Deselect
                    targetMonth.status = 'unpaid'; // Revert to unpaid (or partial if logic was deeper)
                    setCart((prev) =>
                        prev.filter((item) => item.id !== itemId)
                    );
                } else if (targetMonth.status !== 'paid') {
                    // Select
                    targetMonth.status = 'selected';

                    const newItem: CartItem = {
                        id: itemId,
                        label: `${cls.className}`,
                        subLabel: `${targetMonth.month} ${targetMonth.year}`,
                        amount: targetMonth.amount, // Or remaining due if partial (simplified for now)
                        type: 'monthly_fee',
                        classId,
                        monthIndex,
                    };
                    setCart((prev) => [...prev, newItem]);
                }

                return { ...cls, months: updatedMonths };
            });
        });
    };

    const handleRemoveCartItem = (id: string) => {
        // If it's a monthly fee, we need to uncheck the grid
        const item = cart.find((i) => i.id === id);
        if (
            item &&
            item.type === 'monthly_fee' &&
            item.classId &&
            item.monthIndex !== undefined
        ) {
            handleToggleMonth(item.classId, item.monthIndex); // Re-use toggle logic to deselect
        } else {
            setCart((prev) => prev.filter((i) => i.id !== id));
        }
    };

    const handleCompletePayment = (cashReceived: number) => {
        console.log('Processing Payment...', {
            ...student,
            cart,
            cashReceived,
        });
        toast.success('Payment Recorded Successfully', {
            description: `Receipt generated for ${student?.name}. Amount: ${totalAmount} LKR`,
        });

        // Reset or Print logic
        handleClear();
    };

    const handlePayAdmission = () => {
        if (cart.find((c) => c.type === 'admission')) return;

        const admissionFee: CartItem = {
            id: 'admission-fee',
            label: 'Admission Fee',
            subLabel: 'Manual add',
            amount: 1000,
            type: 'admission',
        };
        setCart((prev) => [...prev, admissionFee]);
    };

    return (
        <div className="flex h-[calc(100vh-140px)] flex-col gap-0 overflow-hidden rounded-lg border bg-background shadow-sm md:flex-row md:gap-0">
            {/* Left Panel: Context & Selection (65%) */}
            <div className="flex flex-1 flex-col overflow-hidden border-r bg-muted/10 md:w-[65%]">
                {/* 1. Omni-Search Bar */}
                <div className="z-10 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <StudentSearch
                        onSearch={handleSearch}
                        onClear={handleClear}
                    />
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
                                />
                            </div>

                            {/* 3. Fee Selection Grids */}
                            <div className="animate-in delay-75 duration-500 fade-in-50 slide-in-from-bottom-5">
                                <h3 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                                    Select Fees
                                </h3>
                                <FeeGrid
                                    feeClasses={feeClasses}
                                    onToggleMonth={handleToggleMonth}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground opacity-70">
                            <User className="h-16 w-16" />
                            <p className="text-lg font-medium">
                                Scan Student ID or Search to begin
                            </p>
                            <div className="text-sm">
                                Type any 3 chars (e.g. &quot;kav&quot;) to
                                simulate scan
                            </div>
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
                {student && (
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
