# Admin Dashboard - Quick Start Guide

## ✅ Setup Complete!

A test admin user has been created for you:

- **Email:** admin@test.com
- **Password:** admin123

## Starting the Dashboard

1. Start the server:
   ```bash
   cd C:\dating-app-platform\apps\admin-dashboard
   npm run dev
   ```

2. Open http://localhost:3003 in your browser

3. Login with the test admin credentials above

## Important Notes

- Clear your browser cookies if you get authentication errors
- The dashboard runs on port 3003 (different from main app on 3002)
- All admin actions are logged for security

## Troubleshooting

If you get JWT errors:
1. Stop the server (Ctrl+C)
2. Clear browser cookies for localhost
3. Delete the `.next` folder
4. Restart the server

## Features Available

- **User Management**: Search, ban/unban, verify users
- **Admin Verification**: Give users the verified badge
- **Activity Logs**: Track all admin actions
- **Statistics**: View platform metrics
- **Reports**: Handle user reports (coming soon)

## Production Deployment

For production on Vercel:
1. Change the test admin password
2. Set proper environment variables
3. Enable IP whitelisting for extra security
