'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, MessageCircle } from 'lucide-react';
import type { StudentDetail } from '@/lib/mock-data';

interface SheetHeaderProps {
    student: StudentDetail;
}

export function SheetHeader({ student }: SheetHeaderProps) {
    const handleWhatsApp = () => {
        const phone = student.guardian.phone.replace(/^0/, '94');
        window.open(`https://wa.me/${phone}`, '_blank');
    };

    const handlePrint = () => {
        // TODO: Implement ID card print logic
        console.log('Print ID Card:', student.studentId);
    };

    return (
        <div className="flex items-start gap-4 border-b pb-4">
            {/* Avatar */}
            <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                    {student.initials}
                </AvatarFallback>
            </Avatar>

            {/* Info Block */}
            <div className="flex-1">
                <h2 className="text-lg font-bold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">
                    {student.studentId}
                </p>

                {/* Badges */}
                <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                        variant={
                            student.status === 'active'
                                ? 'success'
                                : 'secondary'
                        }
                    >
                        {student.status === 'active' ? '● Active' : '● Left'}
                    </Badge>
                    {student.admissionStatus === 'PENDING' && (
                        <Badge variant="destructive">Adm. Pending</Badge>
                    )}
                </div>
            </div>

            {/* Action Icons */}
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrint}
                    title="Print ID Card"
                >
                    <Printer className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWhatsApp}
                    title="WhatsApp Guardian"
                    className="text-green-600 hover:text-green-700"
                >
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
