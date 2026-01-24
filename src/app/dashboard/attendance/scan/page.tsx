'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AttendanceHeader } from '@/components/features/attendance/scan/attendance-header';
import { ScanControls } from '@/components/features/attendance/scan/scan-controls';
import { StudentResultCard } from '@/components/features/attendance/scan/student-result-card';
import { cn } from '@/lib/utils';

// Mock Data for Demo
const MOCK_STUDENT = {
    name: "Dinew S. Bandara",
    id: "ST-2025-001",
    image: "",
    hasPaid: false,
    arrears: 2500,
    attendanceHistory: [true, true, false, true],
};

const MOCK_STUDENT_KAMAL = {
    name: "Kamal Perera",
    id: "ST-2025-888",
    image: "",
    hasPaid: true,
    arrears: 0,
    attendanceHistory: [true, true, true, true],
};

export default function AttendanceScanPage() {
    // State
    const [scanMode, setScanMode] = useState<'normal' | 'rapid'>('normal');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchQuery, setSearchQuery] = useState(''); // Keep for logic if needed
    const [student, setStudent] = useState<typeof MOCK_STUDENT | undefined>(undefined);
    const [status, setStatus] = useState<'idle' | 'active'>('idle');
    const [activeClass, setActiveClass] = useState("2026-revision");
    const [isMobile, setIsMobile] = useState(false);

    // Mobile Check for Header Hiding
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleModeToggle = () => {
        setScanMode((prev) => (prev === 'normal' ? 'rapid' : 'normal'));
        setStudent(undefined);
        setStatus('idle');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        // 1. Check for "Kamal" Mock
        if (lowerQuery.includes("kamal")) {
            if (scanMode === 'rapid') {
                simulateScanSuccess(MOCK_STUDENT_KAMAL);
            } else {
                setStudent(MOCK_STUDENT_KAMAL);
                setStatus('active');
            }
            return;
        }

        // 2. Generic Mock Logic (length > 5)
        if (query.length > 5) {
            console.log('Searching for:', query);
            if (scanMode === 'rapid') {
                simulateScanSuccess(MOCK_STUDENT);
            } else {
                setStudent(MOCK_STUDENT);
                setStatus('active');
            }
        }
    };

    const simulateScanSuccess = (studentData: typeof MOCK_STUDENT) => {
        setStudent(studentData);
        setStatus('active');
        toast.success("Attendance Marked!", {
            description: `${studentData.name} - Present`,
            duration: 2000,
        });

        setTimeout(() => {
            setStudent(undefined);
            setStatus('idle');
            setSearchQuery('');
        }, 3000);
    };

    const handleMarkPresent = () => {
        toast.success("Attendance Marked Successfully");
        setStudent(undefined);
        setStatus('idle');
        setSearchQuery('');
    };

    const handleCancel = () => {
        setStudent(undefined);
        setStatus('idle');
        setSearchQuery('');
    };

    // Conditional Header Rendering: Hide if Mobile AND Rapid Mode
    const showHeader = !(isMobile && scanMode === 'rapid');

    return (
        <div className="flex min-h-screen flex-col bg-background h-screen overflow-hidden">
            {/* Sticky Header - Conditional */}
            {showHeader && (
                <AttendanceHeader
                    activeClass={activeClass}
                    onClassChange={setActiveClass}
                    className="shrink-0"
                />
            )}

            {/* Main Content Area - Split View */}
            <main className="flex flex-col md:flex-row h-full overflow-hidden">

                {/* LEFT PANEL: Controls (30-35%) */}
                <section className={cn(
                    "w-full shrink-0 border-b bg-card/30 p-3 md:h-full md:w-[35%] md:border-b-0 md:border-r md:p-6 overflow-y-auto transition-all",
                    scanMode === 'rapid' ? "h-auto" : "" // Allow height to shrink/grow based on content in rapid
                )}>
                    <ScanControls
                        isRapidMode={scanMode === 'rapid'}
                        onToggleMode={handleModeToggle}
                        onSearch={handleSearch}
                        currentCount={24}
                    />
                </section>

                {/* RIGHT PANEL: Results (65-70%) */}
                <section className="flex-1 bg-background p-4 md:p-8 overflow-y-auto relative">
                    <StudentResultCard
                        status={status}
                        student={student}
                        onMarkPresent={scanMode === 'normal' ? handleMarkPresent : undefined}
                        onCancel={scanMode === 'normal' ? handleCancel : undefined}
                    />
                </section>

            </main>
        </div>
    );
}
