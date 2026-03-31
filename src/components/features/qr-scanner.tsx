'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraOff, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRScannerProps {
    onScan: (result: string) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
    showIndicator?: boolean;
    showPreview?: boolean;
    previewSize?: number;
    onBeep?: () => void;
}

/**
 * Background QR Scanner with Mini Preview
 *
 * Runs the camera in the background with a small thumbnail preview
 * for alignment. Detects QR codes and triggers the onScan callback.
 *
 * Gracefully handles camera unavailability without breaking the app.
 */
export function QRScanner({
    onScan,
    onError,
    enabled = true,
    showIndicator = true,
    showPreview = true,
    previewSize = 120,
    onBeep,
}: QRScannerProps) {
    const [isActive, setIsActive] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [lastScan, setLastScan] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(
        null
    );

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isRunningRef = useRef(false); // Track if scanner is actually running
    const reactId = useId();
    const elementId = `qr-scanner-${reactId}`;
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Only run on client side
    useEffect(() => {
        setIsMounted(true);
        return () => {
            // Cleanup scanner on unmount
            if (scannerRef.current && isRunningRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
    }, []);

    // Check camera availability before starting
    useEffect(() => {
        if (!isMounted || !enabled) return;

        const checkCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                setCameraAvailable(devices && devices.length > 0);

                if (devices && devices.length > 0) {
                    // Cameras available, start scanner
                    startScanner();
                } else {
                    // No cameras found
                    setCameraAvailable(false);
                    setHasError(false);
                    setErrorMessage('');
                }
            } catch (err) {
                // Error checking cameras (likely permission denied)
                console.warn('Camera check failed:', err);
                setCameraAvailable(false);
                setHasError(true);
                setErrorMessage('Camera access denied');
                onError?.(err as Error);
            }
        };

        checkCameras();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isMounted]);

    const startScanner = async () => {
        if (isStarting || isRunningRef.current) return;

        try {
            setIsStarting(true);
            setHasError(false);
            setErrorMessage('');

            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(elementId);
            }

            const scanner = scannerRef.current;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText: string) => {
                    // QR Code detected
                    if (isProcessing) return;

                    // Don't process the same QR twice in quick succession
                    if (decodedText === lastScan) {
                        if (!processingTimeoutRef.current) {
                            processingTimeoutRef.current = setTimeout(() => {
                                setLastScan('');
                                processingTimeoutRef.current = null;
                            }, 2000);
                        }
                        return;
                    }

                    setLastScan(decodedText);
                    setIsProcessing(true);

                    // Play beep sound
                    if (onBeep) {
                        onBeep();
                    } else {
                        playBeep();
                    }

                    // Call the callback with the scanned data
                    onScan(decodedText);

                    // Reset processing state after a short delay
                    setTimeout(() => {
                        setIsProcessing(false);
                    }, 500);
                },
                () => {
                    // Ignore frame processing errors
                }
            );

            isRunningRef.current = true;
            setIsActive(true);
            setIsStarting(false);
        } catch (err) {
            const error = err as Error;
            console.error('Failed to start scanner:', error);
            isRunningRef.current = false;
            setIsActive(false);
            setIsStarting(false);
            setHasError(true);
            setErrorMessage(error.message || 'Camera unavailable');
            onError?.(error);
        }
    };

    const stopScanner = async () => {
        try {
            if (scannerRef.current && isRunningRef.current) {
                await scannerRef.current.stop();
                isRunningRef.current = false;
                setIsActive(false);
            }
        } catch (err) {
            // Ignore stop errors - scanner might not be running
            console.warn('Error stopping scanner:', err);
            isRunningRef.current = false;
            setIsActive(false);
        }
    };

    const playBeep = () => {
        try {
            const AudioContextClass =
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof AudioContext;
                    }
                ).webkitAudioContext;
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.1
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch {
            // Ignore audio errors
        }
    };

    // Don't render anything during SSR to prevent hydration mismatch
    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Video element - hidden or small preview */}
            <div
                className={cn(
                    'overflow-hidden rounded-lg bg-black',
                    showPreview && `w-[${previewSize}px] h-[${previewSize}px]`
                )}
            >
                <div
                    id={elementId}
                    className={cn(
                        'w-full',
                        showPreview ? 'aspect-square' : 'hidden'
                    )}
                />
            </div>

            {/* Mini status indicator */}
            {showIndicator && (
                <div className="flex items-center gap-2">
                    {hasError ? (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>{errorMessage || 'Camera unavailable'}</span>
                        </div>
                    ) : cameraAvailable === false ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CameraOff className="h-3.5 w-3.5" />
                            <span>No camera</span>
                        </div>
                    ) : isActive ? (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                            <div className="relative">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                            </div>
                            <span>Scanner active</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Starting...</span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

/**
 * Hook to detect hardware scanner input globally
 *
 * Hardware scanners work as keyboard wedges - they type the data
 * quickly and end with Enter. This hook detects that pattern.
 */
export function useHardwareScanner(
    onScan: (result: string) => void,
    enabled: boolean = true,
    onBeep?: () => void
) {
    const bufferRef = useRef<string>('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastKeyTime = useRef<number>(0);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input/textarea (let it work normally)
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            const now = Date.now();
            const timeSinceLastKey = now - lastKeyTime.current;
            lastKeyTime.current = now;

            // Hardware scanners type very fast (< 50ms between keys)
            // If there's a long gap, clear the buffer
            if (timeSinceLastKey > 100) {
                bufferRef.current = '';
            }

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (e.key === 'Enter') {
                // Enter key - this completes the scan
                const scannedData = bufferRef.current.trim();
                if (scannedData.length > 0) {
                    // Valid scan detected
                    onScan(scannedData);

                    // Play beep
                    if (onBeep) {
                        onBeep();
                    }

                    // Clear buffer
                    bufferRef.current = '';
                }
            } else if (e.key.length === 1) {
                // Regular character - add to buffer
                bufferRef.current += e.key;

                // Clear buffer if no more input within 100ms
                timeoutRef.current = setTimeout(() => {
                    bufferRef.current = '';
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, onScan, onBeep]);
}
