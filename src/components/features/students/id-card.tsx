'use client';

import { useRef } from 'react';
import { QRCode } from '@/components/ui/qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, Download } from 'lucide-react';

interface IDCardProps {
    student: {
        fullName: string;
        studentId: string; // Serial ID (number from database)
        qrCode: string; // QR code string
        photoUrl?: string;
        currentGrade?: string;
        phone?: string;
    };
    className?: string;
}

export function IDCard({ student, className }: IDCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Format the display ID (e.g., SRS-2025-001)
    const displayId = student.studentId
        ? `SRS-${new Date().getFullYear()}-${String(student.studentId).padStart(3, '0')}`
        : 'Pending...';

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && cardRef.current) {
            printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${student.fullName}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
              .card { width: 350px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: #1e40af; color: white; padding: 16px; text-align: center; }
              .header h3 { margin: 0; font-size: 18px; }
              .header p { margin: 4px 0 0 0; font-size: 12px; opacity: 0.9; }
              .content { padding: 24px; }
              .photo-container { text-align: center; margin-bottom: 16px; }
              .photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
              .photo-placeholder { width: 80px; height: 80px; border-radius: 50%; background: #dbeafe; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #1e40af; }
              .info { text-align: center; margin-bottom: 16px; }
              .info h4 { margin: 0 0 8px 0; font-size: 20px; font-weight: bold; color: #1f2937; }
              .info p { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e40af; }
              .info small { font-size: 14px; color: #6b7280; }
              .qr { text-align: center; margin: 16px 0; }
              .footer { border-top: 1px solid #e5e7eb; background: #f9fafb; padding: 12px; text-align: center; font-size: 11px; color: #6b7280; }
              @media print { body { background: white; } }
            </style>
          </head>
          <body>
            ${cardRef.current.innerHTML}
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${student.qrCode}`;
        link.download = `${student.fullName.replace(/\s+/g, '-')}-qr-code.txt`;
        link.click();
    };

    return (
        <div className={`space-y-4 ${className || ''}`}>
            {/* ID Card - Printable Area */}
            <Card
                ref={cardRef}
                className="w-full max-w-sm overflow-hidden border-2"
            >
                {/* Header */}
                <div className="bg-primary p-4 text-center text-primary-foreground">
                    <h3 className="text-lg font-bold">SARASI INSTITUTE</h3>
                    <p className="text-sm opacity-90">
                        Student Identification Card
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Photo Area */}
                    <div className="mb-4 text-center">
                        {student.photoUrl ? (
                            <img
                                src={student.photoUrl}
                                alt={student.fullName}
                                className="mx-auto h-20 w-20 rounded-full border-2 border-border object-cover"
                            />
                        ) : (
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-2xl font-bold text-primary">
                                    {student.fullName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Student Info */}
                    <div className="space-y-2 text-center">
                        <h4 className="text-xl font-bold">
                            {student.fullName}
                        </h4>
                        <p className="text-lg font-semibold text-primary">
                            {displayId}
                        </p>
                        {student.currentGrade && (
                            <p className="text-sm text-muted-foreground">
                                Grade: {student.currentGrade}
                            </p>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="my-4 flex justify-center">
                        <QRCode value={student.qrCode} size={150} level="H" />
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Scan QR code for quick verification
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t bg-muted/30 p-3 text-center text-xs text-muted-foreground">
                    Valid for academic year {new Date().getFullYear()}
                </div>
            </Card>

            {/* Action Buttons - Not Printed */}
            <div className="flex gap-2 print:hidden">
                <Button onClick={handlePrint} className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Card
                </Button>
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadQR}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Save QR
                </Button>
            </div>
        </div>
    );
}
