'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Clock, DollarSign, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepPaymentProps {
    formData: {
        selectedClasses: string[];
        paymentMode: 'later' | 'now' | 'free';
    };
    onUpdate: (field: string, value: string | string[]) => void;
}

const AVAILABLE_CLASSES = [
    { id: 'class-1', name: 'Combined Maths', grade: '2026 A/L', fee: 2500 },
    { id: 'class-2', name: 'Physics', grade: '2026 A/L', fee: 2000 },
    { id: 'class-3', name: 'Chemistry', grade: '2025 A/L', fee: 2000 },
    { id: 'class-4', name: 'English', grade: 'Grade 10', fee: 1500 },
];

export function StepPayment({ formData, onUpdate }: StepPaymentProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const toggleClass = (classId: string) => {
        const current = formData.selectedClasses || [];
        const updated = current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId];
        onUpdate('selectedClasses', updated);
    };

    const selectPaymentMode = (mode: 'later' | 'now' | 'free') => {
        onUpdate('paymentMode', mode);
    };

    const filteredClasses = AVAILABLE_CLASSES.filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Class Selection */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Select Classes
                </h3>
                <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search classes by name or grade..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 pl-10"
                    />
                </div>
                <div className="space-y-2">
                    {filteredClasses.map((cls) => (
                        <div
                            key={cls.id}
                            className={cn(
                                'flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50',
                                formData.selectedClasses?.includes(cls.id) &&
                                    'border-primary bg-primary/5'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id={cls.id}
                                    checked={
                                        formData.selectedClasses?.includes(
                                            cls.id
                                        ) || false
                                    }
                                    onChange={() => toggleClass(cls.id)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label
                                    htmlFor={cls.id}
                                    className="cursor-pointer"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {cls.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {cls.grade}
                                        </p>
                                    </div>
                                </Label>
                            </div>
                            <Badge variant="outline">Rs. {cls.fee}</Badge>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Mode */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Admission Payment
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                    {/* Pay Later */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'later'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-muted hover:border-orange-200'
                        )}
                        onClick={() => selectPaymentMode('later')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Pay Later</p>
                                    <p className="text-xs text-muted-foreground">
                                        Settle before 1st class
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pay Now */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'now'
                                ? 'border-green-500 bg-green-50'
                                : 'border-muted hover:border-green-200'
                        )}
                        onClick={() => selectPaymentMode('now')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Pay Now</p>
                                    <p className="text-xs text-muted-foreground">
                                        Rs. 1,000
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Free Card */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'free'
                                ? 'border-gray-500 bg-gray-50'
                                : 'border-muted hover:border-gray-200'
                        )}
                        onClick={() => selectPaymentMode('free')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <Gift className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Free Card</p>
                                    <p className="text-xs text-muted-foreground">
                                        Special admission
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
