'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface AppSettingsCardProps {
    receiptFooter: string;
    smsEnabled: boolean;
    academicYear: string;
    onChange: (field: string, value: string | boolean) => void;
}

export function AppSettingsCard({
    receiptFooter,
    smsEnabled,
    academicYear,
    onChange,
}: AppSettingsCardProps) {
    return (
        <Card className="p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold">Application Settings</h3>

            <div className="space-y-6">
                {/* Receipt Footer */}
                <div className="space-y-2">
                    <Label htmlFor="receiptFooter">Receipt Footer</Label>
                    <p className="text-xs text-muted-foreground">
                        Terms & conditions that appear on printed receipts
                    </p>
                    <Textarea
                        id="receiptFooter"
                        value={receiptFooter}
                        onChange={(e) => onChange('receiptFooter', e.target.value)}
                        placeholder="Enter receipt footer text..."
                        rows={4}
                    />
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="smsEnabled">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                            Send payment confirmation SMS to students
                        </p>
                    </div>
                    <Switch
                        id="smsEnabled"
                        checked={smsEnabled}
                        onCheckedChange={(checked) =>
                            onChange('smsEnabled', checked)
                        }
                    />
                </div>

                {/* Current Academic Year */}
                <div className="space-y-2">
                    <Label htmlFor="academicYear">Current Academic Year</Label>
                    <Input
                        id="academicYear"
                        value={academicYear}
                        onChange={(e) => onChange('academicYear', e.target.value)}
                        placeholder="2026"
                    />
                </div>
            </div>
        </Card>
    );
}
