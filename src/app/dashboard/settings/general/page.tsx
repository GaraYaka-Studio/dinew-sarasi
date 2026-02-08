'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InstituteProfileCard } from '@/components/features/settings/institute-profile-card';
import { AppSettingsCard } from '@/components/features/settings/app-settings-card';
import { DangerZoneCard } from '@/components/features/settings/danger-zone-card';
import { DEFAULT_SETTINGS, type SettingsFormData } from '@/lib/mock-data-settings';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState<SettingsFormData>(DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field: string, value: string | boolean) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoChange = (file: File) => {
        // In real implementation, upload to server
        const url = URL.createObjectURL(file);
        setSettings((prev) => ({ ...prev, logoUrl: url }));
        toast.success('Logo updated successfully');
    };

    const handleSave = () => {
        setIsSaving(true);
        // TODO: Save to server via action
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings saved successfully');
        }, 1000);
    };

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b bg-card px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        General Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configure your institute information and system settings
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Institute Profile */}
                    <InstituteProfileCard
                        logoUrl={settings.logoUrl}
                        instituteName={settings.instituteName}
                        address={settings.address}
                        phone={settings.phone}
                        email={settings.email}
                        website={settings.website}
                        onChange={handleChange}
                        onLogoChange={handleLogoChange}
                    />

                    {/* Application Settings */}
                    <AppSettingsCard
                        receiptFooter={settings.receiptFooter}
                        smsEnabled={settings.smsEnabled}
                        academicYear={settings.academicYear}
                        onChange={handleChange}
                    />

                    {/* Danger Zone */}
                    <DangerZoneCard
                        maintenanceMode={settings.maintenanceMode}
                        onChange={(value) => handleChange('maintenanceMode', value)}
                    />
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="border-t bg-card p-4 lg:hidden">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full"
                    size="lg"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
