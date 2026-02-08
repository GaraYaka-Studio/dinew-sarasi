'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';

interface InstituteProfileCardProps {
    logoUrl?: string;
    instituteName: string;
    address: string;
    phone: string;
    email?: string;
    website?: string;
    onChange: (field: string, value: string) => void;
    onLogoChange: (file: File) => void;
}

export function InstituteProfileCard({
    logoUrl,
    instituteName,
    address,
    phone,
    email,
    website,
    onChange,
    onLogoChange,
}: InstituteProfileCardProps) {
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onLogoChange(file);
        }
    };

    return (
        <Card className="p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold">Institute Profile</h3>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Institute Name */}
                    <div className="space-y-2">
                        <Label htmlFor="instituteName">Institute Name</Label>
                        <Input
                            id="instituteName"
                            value={instituteName}
                            onChange={(e) => onChange('instituteName', e.target.value)}
                            placeholder="Enter institute name"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => onChange('address', e.target.value)}
                            placeholder="Enter institute address"
                            rows={3}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone / Hotline</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            placeholder="+94 XX XXX XXXX"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email || ''}
                            onChange={(e) => onChange('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                            id="website"
                            value={website || ''}
                            onChange={(e) => onChange('website', e.target.value)}
                            placeholder="www.example.com"
                        />
                    </div>
                </div>

                {/* Logo Uploader */}
                <div className="flex flex-col items-center gap-3 lg:w-48">
                    <Avatar className="h-32 w-32 border-2 border-dashed">
                        <AvatarImage src={logoUrl} />
                        <AvatarFallback className="bg-muted">
                            <Building2 className="h-12 w-12 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <input
                            type="file"
                            id="logo-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoUpload}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                                document.getElementById('logo-upload')?.click()
                            }
                        >
                            <Upload className="mr-2 h-3 w-3" />
                            Change
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        Recommended: Square image, PNG or JPG
                    </p>
                </div>
            </div>
        </Card>
    );
}
