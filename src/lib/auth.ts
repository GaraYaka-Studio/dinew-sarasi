import { createClient } from './supabase/server';
import { db } from '../db';
import { profiles } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
	id: string;
	email: string;
	fullName?: string;
	role: 'admin' | 'staff' | 'teacher';
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
	const supabase = await createClient();

	const { data: { user }, error } = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	// Get user profile from database
	const profile = await db
		.select()
		.from(profiles)
		.where(eq(profiles.id, user.id))
		.limit(1);

	if (!profile[0]) {
		return null;
	}

	return {
		id: profile[0].id,
		email: profile[0].email,
		fullName: (profile[0] as any).full_name,
		role: (profile[0] as any).role as 'admin' | 'staff' | 'teacher',
	};
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	const user = await getCurrentUser();
	return user !== null;
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
	const user = await getCurrentUser();
	return user?.role === 'admin';
}

/**
 * Sign out the current user
 */
export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
}
