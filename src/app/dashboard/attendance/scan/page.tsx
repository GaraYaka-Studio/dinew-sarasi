'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AttendanceHeader } from '@/components/features/attendance/scan/attendance-header';
import { ScanControls } from '@/components/features/attendance/scan/scan-controls';
import { StudentResultCard } from '@/components/features/attendance/scan/student-result-card';
import { cn } from '@/lib/utils';
import {
    searchStudentsForAttendance,
    getStudentForAttendance,
    markAttendance,
    getSessionAttendanceCount,
} from '@/lib/db/attendance';
import { getCurrentDate } from '@/lib/utils/time';

// ============================================================================
// Types
// ============================================================================

interface StudentDisplayData {
    uuid: string;
    name: string;
    id: string;
    image: string | undefined;
    hasPaid: boolean;
    arrears: number;
    attendanceHistory: boolean[];
    isEnrolled: boolean;
}

type ScanStatus = 'idle' | 'active' | 'loading';
type ScanMode = 'normal' | 'rapid';
type BeepType = 'success' | 'warning' | 'error';

// ============================================================================
// Audio Feedback
// ============================================================================

function playBeep(type: BeepType): void {
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        switch (type) {
            case 'success':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;
            case 'warning':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.setValueAtTime(600, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'error':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                gainNode.gain.setValueAtTime(0.25, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
        }
    } catch {
        console.warn('Audio play failed');
    }
}

// ============================================================================
// Page Component
// ============================================================================

export default function AttendanceScanPage() {
    // State
    const [scanMode, setScanMode] = useState<ScanMode>('normal');
    const [student, setStudent] = useState<StudentDisplayData | undefined>(undefined);
    const [status, setStatus] = useState<ScanStatus>('idle');
    const [activeClass, setActiveClass] = useState<string>('');
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [currentCount, setCurrentCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Refs to avoid stale closures
    const activeClassRef = useRef(activeClass);
    const activeSessionRef = useRef(activeSession);
    const scanModeRef = useRef(scanMode);

    // Keep refs in sync
    useEffect(() => { activeClassRef.current = activeClass; }, [activeClass]);
    useEffect(() => { activeSessionRef.current = activeSession; }, [activeSession]);
    useEffect(() => { scanModeRef.current = scanMode; }, [scanMode]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load attendance count when session changes
    const loadAttendanceCount = async () => {
        if (!activeSession) return;
        try {
            const count = await getSessionAttendanceCount(activeSession, getCurrentDate());
            setCurrentCount(count);
        } catch {
            console.error('Failed to load attendance count');
        }
    };

    useEffect(() => {
        if (activeSession) {
            loadAttendanceCount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession]);

    const clearStudentAfterDelay = useCallback((delay: number) => {
        setTimeout(() => {
            setStudent(undefined);
            setStatus('idle');
        }, delay);
    }, []);

    const handleMarkAttendanceInternal = async (studentId: string, studentName: string) => {
        const currentClass = activeClassRef.current;
        const currentSession = activeSessionRef.current;
        const currentMode = scanModeRef.current;

        if (!currentClass || !currentSession) {
            toast.error('Please select a class and session first');
            return;
        }

        try {
            const result = await markAttendance({
                studentId,
                classId: currentClass,
                sessionId: currentSession,
                date: getCurrentDate(),
                status: 'present',
            });

            if (result.success) {
                playBeep('success');
                toast.success('Attendance Marked!', {
                    description: `${studentName} - Present`,
                    duration: 2000,
                });
                setCurrentCount(prev => prev + 1);

                if (currentMode === 'rapid') {
                    clearStudentAfterDelay(2500);
                }
            } else if (result.alreadyMarked) {
                playBeep('warning');
                toast.warning('Already Marked', {
                    description: `Attendance for ${studentName} has already been recorded`,
                    duration: 3000,
                });

                if (currentMode === 'rapid') {
                    clearStudentAfterDelay(3000);
                }
            } else {
                playBeep('error');
                toast.error('Failed to Mark', {
                    description: result.error || 'An error occurred',
                });
            }
        } catch {
            playBeep('error');
            toast.error('Failed to Mark Attendance', { description: 'An error occurred' });
        }
    };

    const handleModeToggle = useCallback(() => {
        setScanMode(prev => prev === 'normal' ? 'rapid' : 'normal');
        setStudent(undefined);
        setStatus('idle');
    }, []);

    const handleSearch = useCallback(async (query: string) => {
        const currentClass = activeClassRef.current;
        const currentSession = activeSessionRef.current;
        const currentMode = scanModeRef.current;

        // Validate inputs
        if (!currentClass || !currentSession) {
            if (query.length > 3) {
                toast.error('Please select a class and session first');
            }
            return;
        }

        if (query.length < 2) {
            setStudent(undefined);
            setStatus('idle');
            return;
        }

        setStatus('loading');

        // Debounce search
        setTimeout(async () => {
            try {
                const searchResults = await searchStudentsForAttendance(query, currentClass);

                if (searchResults.length === 0) {
                    setStatus('idle');
                    setStudent(undefined);
                    playBeep('error');
                    toast.error('Student not found', {
                        description: 'No student found with this ID in the selected class',
                    });
                    return;
                }

                const studentData = await getStudentForAttendance(searchResults[0].id, currentClass);

                if (!studentData || !studentData.isEnrolled) {
                    setStatus('idle');
                    setStudent(undefined);
                    playBeep('error');
                    toast.error('Student Not Enrolled', {
                        description: studentData?.fullName
                            ? `${studentData.fullName} is not enrolled in this class`
                            : 'Failed to load student data',
                    });
                    return;
                }

                const displayData: StudentDisplayData = {
                    uuid: studentData.id,
                    name: studentData.fullName,
                    id: `ST-${studentData.studentId}`,
                    image: studentData.photoUrl ?? undefined,
                    hasPaid: studentData.paymentStatus?.hasPaid || false,
                    arrears: studentData.paymentStatus?.arrears || 0,
                    attendanceHistory: studentData.attendanceHistory,
                    isEnrolled: true,
                };

                setStudent(displayData);
                setStatus('active');

                if (currentMode === 'rapid') {
                    await handleMarkAttendanceInternal(studentData.id, displayData.name);
                }
            } catch {
                setStatus('idle');
                setStudent(undefined);
                playBeep('error');
                toast.error('Search failed', { description: 'An error occurred' });
            }
        }, 300);
    }, []);

    const handleMarkPresent = useCallback(async () => {
        if (student?.uuid) {
            await handleMarkAttendanceInternal(student.uuid, student.name);
        }
    }, [student]);

    const handleCancel = useCallback(() => {
        setStudent(undefined);
        setStatus('idle');
    }, []);

    // Conditional Header Rendering
    const showHeader = !(isMobile && scanMode === 'rapid');

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-background">
            {showHeader && (
                <AttendanceHeader
                    activeClass={activeClass}
                    activeSession={activeSession}
                    onClassChange={setActiveClass}
                    onSessionChange={setActiveSession}
                    className="shrink-0"
                />
            )}

            <main className="flex h-full flex-col overflow-hidden md:flex-row">
                {/* LEFT PANEL: Controls */}
                <section
                    className={cn(
                        'w-full shrink-0 overflow-y-auto border-b bg-card/30 p-3 transition-all md:h-full md:w-[35%] md:border-r md:border-b-0 md:p-6',
                        scanMode === 'rapid' ? 'h-auto' : ''
                    )}
                >
                    <ScanControls
                        isRapidMode={scanMode === 'rapid'}
                        onToggleMode={handleModeToggle}
                        onSearch={handleSearch}
                        currentCount={currentCount}
                    />
                </section>

                {/* RIGHT PANEL: Results */}
                <section className="relative flex-1 overflow-y-auto bg-background p-4 md:p-8">
                    <StudentResultCard
                        status={status === 'loading' ? 'idle' : status}
                        student={student}
                        onMarkPresent={scanMode === 'normal' ? handleMarkPresent : undefined}
                        onCancel={scanMode === 'normal' ? handleCancel : undefined}
                    />
                </section>
            </main>
        </div>
    );
}
