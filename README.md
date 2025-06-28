# Amarbis Admin Dashboard

A secure, production-ready admin dashboard for managing the Amarbis dating platform.

## Features

### User Management
- Search users by email, name, ID, or IP address
- Advanced filtering (verification status, subscription tier, account status)
- Ban/unban users with automatic IP blocking
- Reset user passwords
- Delete user accounts
- View detailed user information

### Admin Verification System
- **Manual user verification with admin badge**
- Review pending verifications
- Add verification notes
- Toggle verified status
- Users with admin verification show a special shield badge

### Reports & Moderation
- Review user reports
- Message moderation
- Photo verification
- Safety monitoring

### Analytics
- User statistics
- Verification rates
- Revenue tracking
- Growth metrics

### Activity Logging
- All admin actions are logged
- IP address tracking
- Detailed audit trail

## Setup

1. **Install dependencies:**
   ```bash
   cd apps/admin-dashboard
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database credentials (same as main app)

3. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

4. **Run database migrations:**
   ```bash
   cd ../main-dating-app-fresh
   npx prisma migrate dev
   ```

5. **Create admin user:**
   First, create a regular user account in the main app, then run:
   ```sql
   UPDATE users SET isAdmin = true WHERE email = 'your-admin@email.com';
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   The admin dashboard will be available at http://localhost:3003

## Deployment to Vercel

1. **Push to GitHub**

2. **Import to Vercel:**
   - Go to vercel.com
   - Import your repository
   - Set root directory to `apps/admin-dashboard`

3. **Configure environment variables in Vercel:**
   - All variables from `.env.local`
   - Set `NEXTAUTH_URL` to your production domain
   - Generate a secure `NEXTAUTH_SECRET`

4. **Deploy**

## Security Features

- Admin-only authentication
- Session timeout (1 hour default)
- IP whitelisting (optional)
- Rate limiting
- Secure headers
- Audit logging
- HTTPS only in production

## Admin Actions

### Verifying Users
1. Go to "Verification" page
2. Review user profiles and photos
3. Click "Review" and add optional notes
4. Click "Verify User" to grant admin verification
5. Verified users will show a blue shield badge

### Banning Users
1. Search for user in "Users" page
2. Click actions menu (three dots)
3. Select "Ban User"
4. User's IP will be automatically blocked

### Managing Reports
1. Go to "Reports" page
2. Review pending reports
3. Take appropriate action (warn, ban, dismiss)

## API Endpoints

- `GET /api/stats` - Dashboard statistics
- `GET /api/users` - Search and list users
- `POST /api/users/:id/ban` - Ban a user
- `POST /api/users/:id/unban` - Unban a user
- `POST /api/users/:id/verify` - Toggle admin verification
- `GET /api/verification/pending` - Get users pending verification
- `GET /api/activity/recent` - Recent admin activity

## Database Changes

The admin dashboard adds these fields to the main database:

### User Verification
- `adminVerified` - Boolean flag for admin verification
- `adminVerifiedAt` - Timestamp of verification
- `adminVerifiedBy` - Admin who verified
- `adminVerificationNote` - Optional notes
- `showVerifiedBadge` - Whether to display badge

### Admin Logs
- Complete audit trail of all admin actions
- IP address and user agent tracking

## Best Practices

1. **Regular Backups:** Always backup the database before major operations
2. **Two-Person Rule:** Have another admin review critical actions
3. **Documentation:** Document reasons for bans and major actions
4. **Privacy:** Respect user privacy - only access what's necessary
5. **Security:** Use strong passwords and enable 2FA when available

## Support

For issues or questions:
- Check logs in Vercel dashboard
- Review Prisma Studio for database issues
- Ensure all environment variables are set correctly
