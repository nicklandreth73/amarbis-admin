@echo off
echo Starting Amarbis Admin Dashboard...
echo.
echo Dashboard URL: http://localhost:3003
echo.
echo Note: You need to create an admin user first!
echo Run this SQL in your database:
echo UPDATE users SET "isAdmin" = true WHERE email = 'your-email@example.com';
echo.
cd /d C:\dating-app-platform\apps\admin-dashboard
npm run dev
