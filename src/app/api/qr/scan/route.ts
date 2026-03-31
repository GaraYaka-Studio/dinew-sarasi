import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';

/**
 * Public QR Code Scan API
 *
 * This endpoint allows public QR code scanning for basic student information.
 * It does NOT require authentication and returns only limited, non-sensitive data.
 *
 * Security: Returns "Official Use Only" message with basic info only.
 * No phone, address, or payment details are exposed.
 *
 * Rate limiting should be implemented at the middleware level.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const qrCode = searchParams.get('code');

    if (!qrCode) {
        return NextResponse.json(
            { error: 'QR code required' },
            { status: 400 }
        );
    }

    // Input validation - QR code format check
    if (!qrCode.startsWith('QR-SRS-')) {
        return NextResponse.json(
            {
                message: 'Official Use Only',
                error: 'Invalid QR code format',
            },
            { status: 400 }
        );
    }

    try {
        const student = await db
            .select({
                fullName: students.full_name,
                studentId: students.student_id,
                currentGrade: students.current_grade,
                status: students.status,
            })
            .from(students)
            .where(eq(students.qr_code, qrCode))
            .limit(1);

        if (student.length === 0) {
            return NextResponse.json(
                {
                    message: 'Official Use Only',
                    error: 'Student not found',
                },
                { status: 404 }
            );
        }

        // Return limited student information - NO sensitive data
        return NextResponse.json({
            message: 'Official Use Only',
            description:
                'This QR code is for official institute identification purposes only.',
            student: {
                name: student[0].fullName,
                id: `SRS-${new Date().getFullYear()}-${String(student[0].studentId).padStart(3, '0')}`,
                grade: student[0].currentGrade || 'N/A',
                status: student[0].status || 'active',
            },
        });
    } catch (error) {
        console.error('QR scan error:', error);
        return NextResponse.json(
            {
                message: 'Official Use Only',
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
