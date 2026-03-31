import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, auditLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user has a profile
        const profile = await db
            .select()
            .from(profiles)
            .where(eq(profiles.id, data.user.id))
            .limit(1);

        if (!profile[0]) {
            return NextResponse.json(
                { error: 'User profile not found. Contact administrator.' },
                { status: 403 }
            );
        }

        // Check if user is admin or staff (can login)
        const allowedRoles = ['admin', 'staff', 'teacher'];
        if (!profile[0].role || !allowedRoles.includes(profile[0].role)) {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 403 }
            );
        }

        // Log the login to audit log
        await db.insert(auditLogs).values({
            user_id: profile[0].id,
            action: 'LOGIN',
            details: {
                module: 'Authentication',
                context: 'User Login',
                details: `User ${profile[0].email} logged in as ${profile[0].role}`,
                email: profile[0].email,
                role: profile[0].role,
                timestamp: new Date().toISOString(),
            } satisfies Record<string, unknown>,
        });

        return NextResponse.json({
            success: true,
            user: {
                id: profile[0].id,
                email: profile[0].email,
                role: profile[0].role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
