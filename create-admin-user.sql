-- Script to create an admin user for Amarbis Admin Dashboard
-- 
-- Instructions:
-- 1. Replace 'your-email@example.com' with the email of an existing user
-- 2. Run this query in your Supabase SQL Editor
-- 3. The user will then be able to log into the admin dashboard

-- Check if user exists and make them admin
UPDATE users 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, name, "isAdmin", created_at 
FROM users 
WHERE "isAdmin" = true;

-- Optional: Create admin verification record for the admin user
-- This gives the admin user a verified badge too
INSERT INTO user_verifications (
    id,
    user_id,
    admin_verified,
    admin_verified_at,
    verification_level,
    trust_score,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    id,
    true,
    NOW(),
    'VERIFIED',
    1.0,
    NOW(),
    NOW()
FROM users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
    admin_verified = true,
    admin_verified_at = NOW(),
    verification_level = 'VERIFIED';
