'use client';

import { useState } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Mock Data Structure
type Student = {
    id: string;
    name: string;
    studentId: string;
    scanTime: string;
    avatarUrl?: string;
};

type ClassSession = {
    id: string;
    className: string;
    time: string;
    totalPresent: number;
    students: Student[];
};

const MOCK_LOG_DATA: ClassSession[] = [
    {
        id: 'class-1',
        className: '2026 Revision',
        time: '08:00 AM',
        totalPresent: 8,
        students: [
            {
                id: 'att-1',
                name: 'Kamal Perera',
                studentId: 'S001',
                scanTime: '08:05 AM',
            },
            {
                id: 'att-2',
                name: 'Nimal Silva',
                studentId: 'S002',
                scanTime: '08:07 AM',
            },
            {
                id: 'att-3',
                name: 'Sunil Fernando',
                studentId: 'S003',
                scanTime: '08:10 AM',
            },
            {
                id: 'att-4',
                name: 'Priya Jayawardena',
                studentId: 'S004',
                scanTime: '08:12 AM',
            },
            {
                id: 'att-5',
                name: 'Amaya Wickramasinghe',
                studentId: 'S005',
                scanTime: '08:15 AM',
            },
            {
                id: 'att-6',
                name: 'Ruwan Mendis',
                studentId: 'S006',
                scanTime: '08:18 AM',
            },
            {
                id: 'att-7',
                name: 'Dilani Rathnayake',
                studentId: 'S007',
                scanTime: '08:20 AM',
            },
            {
                id: 'att-8',
                name: 'Chaminda Kumara',
                studentId: 'S008',
                scanTime: '08:22 AM',
            },
        ],
    },
    {
        id: 'class-2',
        className: 'Grade 10 Mathematics',
        time: '10:00 AM',
        totalPresent: 6,
        students: [
            {
                id: 'att-9',
                name: 'Sanduni Perera',
                studentId: 'S101',
                scanTime: '10:02 AM',
            },
            {
                id: 'att-10',
                name: 'Ashen Fernando',
                studentId: 'S102',
                scanTime: '10:05 AM',
            },
            {
                id: 'att-11',
                name: 'Kavindi Silva',
                studentId: 'S103',
                scanTime: '10:08 AM',
            },
            {
                id: 'att-12',
                name: 'Tharindu Jayasinghe',
                studentId: 'S104',
                scanTime: '10:10 AM',
            },
            {
                id: 'att-13',
                name: 'Nethmi Wijesinghe',
                studentId: 'S105',
                scanTime: '10:12 AM',
            },
            {
                id: 'att-14',
                name: 'Dinuka Rajapaksha',
                studentId: 'S106',
                scanTime: '10:15 AM',
            },
        ],
    },
    {
        id: 'class-3',
        className: '2025 Physics Theory',
        time: '02:00 PM',
        totalPresent: 30,
        students: [
            {
                id: 'att-15',
                name: 'Anura Bandara',
                studentId: 'S201',
                scanTime: '02:02 PM',
            },
            {
                id: 'att-16',
                name: 'Buddhika Saman',
                studentId: 'S202',
                scanTime: '02:03 PM',
            },
            {
                id: 'att-17',
                name: 'Chandana Kumara',
                studentId: 'S203',
                scanTime: '02:04 PM',
            },
            {
                id: 'att-18',
                name: 'Damith Perera',
                studentId: 'S204',
                scanTime: '02:05 PM',
            },
            {
                id: 'att-19',
                name: 'Eshan Fernando',
                studentId: 'S205',
                scanTime: '02:06 PM',
            },
            {
                id: 'att-20',
                name: 'Fathima Zahra',
                studentId: 'S206',
                scanTime: '02:07 PM',
            },
            {
                id: 'att-21',
                name: 'Gayan Silva',
                studentId: 'S207',
                scanTime: '02:08 PM',
            },
            {
                id: 'att-22',
                name: 'Hasini Rathnayake',
                studentId: 'S208',
                scanTime: '02:09 PM',
            },
            {
                id: 'att-23',
                name: 'Irfan Ahmed',
                studentId: 'S209',
                scanTime: '02:10 PM',
            },
            {
                id: 'att-24',
                name: 'Janaka Wijesinghe',
                studentId: 'S210',
                scanTime: '02:11 PM',
            },
            {
                id: 'att-25',
                name: 'Kavinda Rajapaksha',
                studentId: 'S211',
                scanTime: '02:12 PM',
            },
            {
                id: 'att-26',
                name: 'Lakshitha Gamage',
                studentId: 'S212',
                scanTime: '02:13 PM',
            },
            {
                id: 'att-27',
                name: 'Madushanka Silva',
                studentId: 'S213',
                scanTime: '02:14 PM',
            },
            {
                id: 'att-28',
                name: 'Nimali Perera',
                studentId: 'S214',
                scanTime: '02:15 PM',
            },
            {
                id: 'att-29',
                name: 'Oshadha Fernando',
                studentId: 'S215',
                scanTime: '02:16 PM',
            },
            {
                id: 'att-30',
                name: 'Pasan Jayawardena',
                studentId: 'S216',
                scanTime: '02:17 PM',
            },
            {
                id: 'att-31',
                name: 'Qadira Rizwan',
                studentId: 'S217',
                scanTime: '02:18 PM',
            },
            {
                id: 'att-32',
                name: 'Ravindu Bandara',
                studentId: 'S218',
                scanTime: '02:19 PM',
            },
            {
                id: 'att-33',
                name: 'Sameera Kumara',
                studentId: 'S219',
                scanTime: '02:20 PM',
            },
            {
                id: 'att-34',
                name: 'Tharindu Wickrama',
                studentId: 'S220',
                scanTime: '02:21 PM',
            },
            {
                id: 'att-35',
                name: 'Upeksha Silva',
                studentId: 'S221',
                scanTime: '02:22 PM',
            },
            {
                id: 'att-36',
                name: 'Vimukthi Perera',
                studentId: 'S222',
                scanTime: '02:23 PM',
            },
            {
                id: 'att-37',
                name: 'Waruna Fernando',
                studentId: 'S223',
                scanTime: '02:24 PM',
            },
            {
                id: 'att-38',
                name: 'Yashodha Kumari',
                studentId: 'S224',
                scanTime: '02:25 PM',
            },
            {
                id: 'att-39',
                name: 'Zainab Farook',
                studentId: 'S225',
                scanTime: '02:26 PM',
            },
            {
                id: 'att-40',
                name: 'Amila Rajapaksha',
                studentId: 'S226',
                scanTime: '02:27 PM',
            },
            {
                id: 'att-41',
                name: 'Binara Silva',
                studentId: 'S227',
                scanTime: '02:28 PM',
            },
            {
                id: 'att-42',
                name: 'Chamika Perera',
                studentId: 'S228',
                scanTime: '02:29 PM',
            },
            {
                id: 'att-43',
                name: 'Dinesh Fernando',
                studentId: 'S229',
                scanTime: '02:30 PM',
            },
            {
                id: 'att-44',
                name: 'Eranga Wickramasinghe',
                studentId: 'S230',
                scanTime: '02:31 PM',
            },
        ],
    },
];

export default function AttendanceLogPage() {
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    // Handle delete with confirmation
    const handleDelete = (studentName: string, attendanceId: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete attendance for ${studentName}?`
        );

        if (confirmed) {
            console.log(`Deleting attendance record: ${attendanceId}`);
            toast.success(`Deleted attendance for ${studentName}`);
            // In real implementation, call delete action here
        }
    };

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // අද දවස ගන්න
    const todayStr = new Date().toISOString().split('T')[0];

    // Logic: දිනේ "අද" නම් විතරක් Data පෙන්නන්න. නැත්නම් හිස් List එකක් යවන්න.
    const sessionsToDisplay = selectedDate === todayStr ? MOCK_LOG_DATA : [];
    const hasClasses = sessionsToDisplay.length > 0;

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Attendance Log
                </h1>

                {/* Date Picker */}
                <div className="relative">
                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-[200px] pl-9"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {hasClasses ? (
                    <div className="mx-auto max-w-4xl">
                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                        >
                            {sessionsToDisplay.map((classSession) => (
                                <AccordionItem
                                    key={classSession.id}
                                    value={classSession.id}
                                    className="overflow-hidden rounded-lg border bg-card"
                                >
                                    {/* Accordion Header */}
                                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                                        <div className="flex w-full items-center justify-between pr-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-base font-semibold">
                                                    {classSession.className}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {classSession.time}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="default"
                                                className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                                            >
                                                🟢 {classSession.totalPresent}{' '}
                                                Present
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>

                                    {/* Accordion Content - Student List */}
                                    <AccordionContent className="px-6 pb-4">
                                        <ScrollArea className="h-[400px]">
                                            <div className="space-y-2 pr-4">
                                                {classSession.students.map(
                                                    (student) => (
                                                        <div
                                                            key={student.id}
                                                            className="flex items-center justify-between rounded-md border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                                                        >
                                                            {/* Left: Time */}
                                                            <div className="w-20 text-sm text-muted-foreground">
                                                                {
                                                                    student.scanTime
                                                                }
                                                            </div>

                                                            {/* Center: Student Info */}
                                                            <div className="flex flex-1 items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage
                                                                        src={
                                                                            student.avatarUrl
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(
                                                                            student.name
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {
                                                                            student.studentId
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Right: Delete Button */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        student.name,
                                                                        student.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">
                                No records found
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No attendance records for the selected date.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
