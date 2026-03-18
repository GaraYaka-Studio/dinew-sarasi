import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';

export async function POST() {
	const supabase = await createClient();

	// Get user before logout for audit log
	const { data: { user } } = await supabase.auth.getUser();

	await supabase.auth.signOut();

	// Log the logout to audit log if user was logged in
	if (user) {
		await db.insert(auditLogs).values({
			user_id: user.id,
			action: 'LOGOUT',
			details: {
				module: 'Authentication',
				context: 'User Logout',
				details: `User ${user.email} logged out`,
				email: user.email,
				timestamp: new Date().toISOString(),
			},
		} as any);
	}

	return NextResponse.json({ success: true });
}
