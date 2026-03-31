'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StepPersonalProps {
    formData: {
        name: string;
        mobile: string;
        guardianName: string;
        guardianPhone: string;
        relationship: string;
        school: string;
        dob: string;
        address: string;
        gender: string;
    };
    onUpdate: (field: string, value: string) => void;
}

// Sri Lankan phone validation: 07X-XXXXXXX (10 digits starting with 07)
const SRILANKA_PHONE_REGEX = /^07[0-9]{8}$/;

export function StepPersonal({ formData, onUpdate }: StepPersonalProps) {
    // Calculate max date (today) for DOB
    const maxDate = useMemo(() => {
        return new Date().toISOString().split('T')[0];
    }, []);

    // Calculate minimum date (reasonable age: 100 years ago)
    const minDate = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 100);
        return date.toISOString().split('T')[0];
    }, []);

    // Phone validation - use useMemo for derived state
    const phoneError = useMemo(() => {
        if (!formData.mobile) return '';
        const cleanPhone = formData.mobile.replace(/[\s-]/g, '');
        if (!SRILANKA_PHONE_REGEX.test(cleanPhone)) {
            return 'Please enter a valid phone number (07X-XXXXXXX)';
        }
        return '';
    }, [formData.mobile]);

    const guardianPhoneError = useMemo(() => {
        if (!formData.guardianPhone) return '';
        const cleanPhone = formData.guardianPhone.replace(/[\s-]/g, '');
        if (!SRILANKA_PHONE_REGEX.test(cleanPhone)) {
            return 'Please enter a valid phone number (07X-XXXXXXX)';
        }
        return '';
    }, [formData.guardianPhone]);

    return (
        <div className="space-y-6">
            {/* Identity Section */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Student Identity
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Kamal Perera"
                            value={formData.name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className="h-11"
                            required
                            minLength={2}
                            maxLength={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile (WhatsApp) *</Label>
                        <Input
                            id="mobile"
                            type="tel"
                            placeholder="077-1234567"
                            value={formData.mobile}
                            onChange={(e) => onUpdate('mobile', e.target.value)}
                            className={`h-11 ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            required
                            pattern="^07[0-9]{8}$"
                            maxLength={10}
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity(
                                    'Please enter a valid Sri Lankan phone number (07X-XXXXXXX)'
                                );
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity('');
                                // Only allow numbers
                                const value = e.currentTarget.value;
                                const numericOnly = value.replace(
                                    /[^0-9]/g,
                                    ''
                                );
                                if (value !== numericOnly) {
                                    onUpdate('mobile', numericOnly);
                                }
                            }}
                        />
                        {phoneError && (
                            <p className="text-xs text-red-500">{phoneError}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <Input
                            id="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => onUpdate('dob', e.target.value)}
                            className="h-11"
                            required
                            min={minDate}
                            max={maxDate}
                        />
                        <p className="text-xs text-muted-foreground">
                            Student must be between 5-25 years old
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => onUpdate('gender', value)}
                            required
                        >
                            <SelectTrigger id="gender" className="h-11">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="school">School *</Label>
                        <Input
                            id="school"
                            placeholder="Ex: Royal College"
                            value={formData.school}
                            onChange={(e) => onUpdate('school', e.target.value)}
                            className="h-11"
                            required
                            minLength={2}
                            maxLength={150}
                        />
                    </div>
                </div>
            </div>

            {/* Guardian Section */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Guardian Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="guardianName">Guardian Name *</Label>
                        <Input
                            id="guardianName"
                            placeholder="Ex: Mr. Kamal Silva"
                            value={formData.guardianName}
                            onChange={(e) =>
                                onUpdate('guardianName', e.target.value)
                            }
                            className="h-11"
                            required
                            minLength={2}
                            maxLength={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                        <Input
                            id="guardianPhone"
                            type="tel"
                            placeholder="077-1234567"
                            value={formData.guardianPhone}
                            onChange={(e) =>
                                onUpdate('guardianPhone', e.target.value)
                            }
                            className={`h-11 ${guardianPhoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            required
                            pattern="^07[0-9]{8}$"
                            maxLength={10}
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity(
                                    'Please enter a valid Sri Lankan phone number (07X-XXXXXXX)'
                                );
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity('');
                                // Only allow numbers
                                const value = e.currentTarget.value;
                                const numericOnly = value.replace(
                                    /[^0-9]/g,
                                    ''
                                );
                                if (value !== numericOnly) {
                                    onUpdate('guardianPhone', numericOnly);
                                }
                            }}
                        />
                        {guardianPhoneError && (
                            <p className="text-xs text-red-500">
                                {guardianPhoneError}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship *</Label>
                        <Select
                            value={formData.relationship}
                            onValueChange={(value) =>
                                onUpdate('relationship', value)
                            }
                            required
                        >
                            <SelectTrigger id="relationship" className="h-11">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Father">Father</SelectItem>
                                <SelectItem value="Mother">Mother</SelectItem>
                                <SelectItem value="Guardian">
                                    Guardian
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <textarea
                            id="address"
                            placeholder="Ex: 125/3, Galle Road, Colombo 03"
                            value={formData.address}
                            onChange={(e) =>
                                onUpdate('address', e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                            required
                            minLength={10}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">
                            Tip: Separate Address Line, City, and District with
                            commas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
