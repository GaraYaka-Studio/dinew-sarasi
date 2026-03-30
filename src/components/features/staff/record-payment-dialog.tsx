'use client';

import { useActionState, useEffect, useEffectEvent, useState } from 'react';

import { toast } from 'sonner';

import { Wallet } from 'lucide-react';
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

import { recordTeacherPayment } from '@/lib/db/insert';

import { Teacher } from '@/types/schema.types';

interface RecordPaymentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teacher: Teacher;
}

export function RecordPaymentDialog({
    isOpen,
    onOpenChange,
    teacher,
}: RecordPaymentDialogProps) {
    const [formValues, setFormValues] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const recordTeacherPaymentWithId = recordTeacherPayment.bind(
        null,
        teacher.id
    );
    const [state, formAction, pending] = useActionState(
        recordTeacherPaymentWithId,
        { success: false, status: 0, error: null }
    );

    const clearForm = useEffectEvent(() => {
        setFormValues({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
    });

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Payment recorded successfully!');
            onOpenChange(false);
            clearForm();
        }
    }, [state, onOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Record Payment
                    </DialogTitle>
                    <DialogDescription>
                        Record a payment for <strong>{teacher.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (LKR)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="e.g., 50000"
                            defaultValue={formValues.amount}
                            onChange={(e) => {
                                setFormValues({
                                    ...formValues,
                                    amount: e.target.value,
                                });
                            }}
                            required
                            min="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={formValues.date}
                            onChange={(e) => {
                                setFormValues({
                                    ...formValues,
                                    date: e.target.value,
                                });
                            }}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="e.g., January salary payment"
                            defaultValue={formValues.notes}
                            onChange={(e) => {
                                setFormValues({
                                    ...formValues,
                                    notes: e.target.value,
                                });
                            }}
                            rows={2}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={pending}
                            onClick={() => {
                                setFormValues({
                                    amount: '',
                                    date: new Date()
                                        .toISOString()
                                        .split('T')[0],
                                    notes: '',
                                });
                                onOpenChange(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={pending}
                            className="bg-black text-white hover:bg-black/90"
                        >
                            {pending ? 'Recording...' : 'Record Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
