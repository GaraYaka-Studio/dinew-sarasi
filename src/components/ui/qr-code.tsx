'use client';

import { useEffect, useState, useRef } from 'react';
import QRCodeGenerator from 'qrcode';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { Button } from './button';

interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    className?: string;
    showDownload?: boolean;
    downloadFilename?: string;
}

export function QRCode({
    value,
    size = 200,
    level = 'M',
    includeMargin = false,
    className,
    showDownload = false,
    downloadFilename = 'qr-code.png',
}: QRCodeProps) {
    const [dataUrl, setDataUrl] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!value) return;

        const generateQR = async () => {
            try {
                setError(null);
                const url = await QRCodeGenerator.toDataURL(value, {
                    width: size,
                    errorCorrectionLevel: level,
                    margin: includeMargin ? 4 : 0,
                });
                setDataUrl(url);
            } catch (err) {
                setError('Failed to generate QR code');
                console.error('QR code generation error:', err);
            }
        };

        generateQR();
    }, [value, size, level, includeMargin]);

    const handleDownload = () => {
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = downloadFilename;
        link.click();
    };

    if (error) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted',
                    className
                )}
                style={{ width: size, height: size }}
            >
                <p className="text-sm text-destructive">{error}</p>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            {dataUrl ? (
                <>
                    <img
                        src={dataUrl}
                        alt="QR Code"
                        width={size}
                        height={size}
                        className="rounded-lg border border-border bg-white"
                        style={{ width: size, height: size }}
                    />
                    {showDownload && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download QR
                        </Button>
                    )}
                </>
            ) : (
                <div
                    className="animate-pulse rounded-lg bg-muted"
                    style={{ width: size, height: size }}
                />
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
