'use client';

import { useState } from 'react';
import { QRScanner } from '@/components/features/qr-scanner';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield, User } from 'lucide-react';

interface ScanResult {
    message: string;
    description?: string;
    student?: {
        name: string;
        id: string;
        grade: string;
        status: string;
    };
    error?: string;
}

export default function PublicScanPage() {
    const [result, setResult] = useState<ScanResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleScan = async (qrCode: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/qr/scan?code=${encodeURIComponent(qrCode)}`);
            const data: ScanResult = await response.json();

            setResult(data);
        } catch (err) {
            setResult({
                message: 'Official Use Only',
                error: 'Failed to scan QR code',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">SARASI Institute - QR Scan</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container flex max-w-md flex-1 flex-col items-center justify-center p-4 py-8">
                <div className="w-full space-y-6">
                    {/* Info Card */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <div className="text-sm">
                                    <p className="font-semibold text-primary">
                                        Official Institute Use Only
                                    </p>
                                    <p className="mt-1 text-muted-foreground">
                                        This QR code is for official institute identification purposes.
                                        Students should scan their ID cards only at designated institute stations.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner */}
                    <QRScanner
                        onScan={handleScan}
                    />

                    {/* Loading State */}
                    {isLoading && (
                        <Card>
                            <CardContent className="flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                                    <p className="mt-4 text-sm text-muted-foreground">Scanning...</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Result Display */}
                    {result && !isLoading && (
                        <Card className={result.error ? 'border-destructive/50' : 'border-green-500/50'}>
                            <CardContent className="p-6">
                                {result.error ? (
                                    // Error State
                                    <div className="flex items-center gap-3 text-destructive">
                                        <AlertCircle className="h-8 w-8 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">{result.message}</p>
                                            <p className="text-sm">{result.error}</p>
                                        </div>
                                    </div>
                                ) : (
                                    // Success State - Limited Info Only
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Shield className="h-5 w-5" />
                                            <p className="font-semibold">{result.message}</p>
                                        </div>

                                        {result.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {result.description}
                                            </p>
                                        )}

                                        {result.student && (
                                            <div className="rounded-lg border bg-muted/30 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                                        <User className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{result.student.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {result.student.id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Grade:</span>{' '}
                                                        <span className="font-medium">{result.student.grade}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Status:</span>{' '}
                                                        <span className="font-medium capitalize">{result.student.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground text-center">
                                            For detailed information, please contact the institute administration.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} SARASI Institute. All rights reserved.</p>
            </footer>
        </div>
    );
}
