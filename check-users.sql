-- Quick script to check for existing users and make one an admin
-- Run this in Supabase SQL Editor

-- First, let's see what users exist
SELECT id, email, name, "isAdmin", created_at 
FROM users 
ORDER BY created_at DESC
LIMIT 10;

-- After you identify a user, uncomment and run this with their email:
-- UPDATE users SET "isAdmin" = true WHERE email = 'YOUR_EMAIL_HERE';
