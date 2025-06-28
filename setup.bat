@echo off
echo Setting up Amarbis Admin Dashboard...
echo.

cd /d C:\dating-app-platform\apps\admin-dashboard

echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local and configure it
echo 2. Run the database migration in the main app folder
echo 3. Create an admin user by updating a user's isAdmin field to true
echo 4. Start the dev server with: npm run dev
echo.
echo The admin dashboard will run on http://localhost:3003
pause
