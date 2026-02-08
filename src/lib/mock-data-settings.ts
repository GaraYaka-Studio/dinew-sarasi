// ============================================================================
// SETTINGS DATA
// ============================================================================

export interface SettingsFormData {
    // Institute Profile
    logoUrl?: string;
    instituteName: string;
    address: string;
    phone: string;
    email?: string;
    website?: string;

    // App Settings
    receiptFooter: string;
    smsEnabled: boolean;
    academicYear: string;

    // Danger Zone
    maintenanceMode: boolean;
}

export const DEFAULT_SETTINGS: SettingsFormData = {
    logoUrl: undefined,
    instituteName: 'Sarasi Institute',
    address: '123, Makola,\nKiribathgoda',
    phone: '+94 11 234 5678',
    email: 'info@sarasinstitute.lk',
    website: 'www.sarasinstitute.lk',

    receiptFooter: 'Terms & Conditions:\n - Please bring this receipt for any inquiries\nThank you for your payment!',
    smsEnabled: true,
    academicYear: '2026',

    maintenanceMode: false,
};
