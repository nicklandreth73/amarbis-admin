@echo off
echo Running database migration for admin features...
echo.

cd /d C:\dating-app-platform\apps\main-dating-app-fresh

echo Creating migration for admin verification fields...
call npx prisma migrate dev --name add_admin_verification

echo.
echo Migration complete!
echo.
echo You can now create an admin user by running this SQL command:
echo UPDATE users SET "isAdmin" = true WHERE email = 'your-email@example.com';
echo.
pause
