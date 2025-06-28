Write-Host "Setting up Amarbis Admin Dashboard..." -ForegroundColor Green
Write-Host ""

Set-Location -Path "C:\dating-app-platform\apps\admin-dashboard"

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env.local and configure it"
Write-Host "2. Run the database migration in the main app folder"
Write-Host "3. Create an admin user by updating a user's isAdmin field to true"
Write-Host "4. Start the dev server with: npm run dev"
Write-Host ""
Write-Host "The admin dashboard will run on http://localhost:3003" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
