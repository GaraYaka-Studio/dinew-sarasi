/**
 * Create Super Admin User
 *
 * This script creates a super admin user in both Supabase Auth and the profiles table.
 *
 * USAGE:
 * 1. Go to Supabase Dashboard → Authentication → Users
 * 2. Click "Add user" → "Create new user"
 * 3. Enter email and password
 * 4. Copy the user ID (UUID) from the created user
 * 5. Run this script: npx tsx scripts/create-super-admin.ts <USER_ID> <EMAIL> <NAME>
 *
 * EXAMPLE:
 * npx tsx scripts/create-super-admin.ts "123e4567-e89b-12d3-a456-426614174000" "admin@example.com" "Super Admin"
 */

import '../envConfig';
import { db } from '../src/db';
import { profiles } from '../src/db/schema';

async function createSuperAdmin() {
    const userId = process.argv[2];
    const email = process.argv[3];
    const fullName = process.argv[4] || 'Super Admin';

    if (!userId || !email) {
        console.error('❌ Missing required arguments');
        console.log('');
        console.log(
            'Usage: npx tsx scripts/create-super-admin.ts <USER_ID> <EMAIL> [FULL_NAME]'
        );
        console.log('');
        console.log('Steps to create super admin:');
        console.log('1. Go to Supabase Dashboard → Authentication → Users');
        console.log('2. Click "Add user" → "Create new user"');
        console.log('3. Enter email and password, then click "Create user"');
        console.log('4. Click on the newly created user');
        console.log('5. Copy the User ID (UUID)');
        console.log(
            `6. Run: npx tsx scripts/create-super-admin.ts "<USER_ID>" "email@example.com" "Full Name"`
        );
        console.log('');
        process.exit(1);
    }

    // Check if profile already exists
    const existing = await db.query.profiles?.findFirst({
        where: (profiles, { eq }) => eq(profiles.id, userId),
    });

    if (existing) {
        console.log('⚠️  Profile already exists for this user');
        console.log(`   Email: ${existing.email}`);
        console.log(`   Role: ${existing.role}`);
        process.exit(0);
    }

    // Create profile
    await db.insert(profiles).values({
        id: userId,
        email,
        full_name: fullName,
        role: 'admin',
    });

    console.log('✅ Super admin profile created successfully!');
    console.log('');
    console.log('Details:');
    console.log(`  User ID: ${userId}`);
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${fullName}`);
    console.log(`  Role: admin`);
    console.log('');
    console.log('You can now login at: http://localhost:3000/login');
}

createSuperAdmin().catch(console.error);
