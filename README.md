# School Management System - Admin Application

## Overview
This is the administrative application for school staff to manage users, verify devices, monitor activities, and oversee all school operations.

## Features
- **Admin Authentication**: Secure login for administrators
- **User Management**: View all users and verify device IDs
- **Device Verification**: Approve or reject user device registrations
- **Dashboard Statistics**: 
  - Total students count
  - Total teachers count
  - Total fee collection
  - Average attendance rate
  - Pending verifications count
- **Real-time Monitoring**: View pending verifications and take action

## Tech Stack
### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Helmet for security headers
- Express Rate Limit for API protection
- SHA-512 for password hashing

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- Responsive design

## Project Structure
```
admin-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   copy .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/school_admin
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=development
   ```

5. Start MongoDB service

6. Create initial admin account (use MongoDB shell or script):
   ```javascript
   // In MongoDB shell
   use school_admin
   db.admins.insertOne({
     name: "Admin User",
     email: "admin@school.com",
     password: "hashed_password_here", // Use SHA-512 hash
     role: "admin",
     createdAt: new Date()
   })
   ```

7. Run the backend:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5001`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### User Management
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending` - Get pending verifications
- `PUT /api/admin/users/:userId/verify` - Verify user device
- `PUT /api/admin/users/:userId/reject` - Reject user device

### Dashboard
- `GET /api/admin/dashboard/statistics` - Get dashboard statistics

## Security Features
- SHA-512 password hashing
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- Input validation and sanitization
- CORS protection
- Admin-only access control

## Usage Flow

### Admin Login
1. Navigate to admin login page
2. Enter admin credentials
3. JWT token is issued upon successful authentication
4. Redirected to admin dashboard

### Device Verification
1. Dashboard shows pending verifications
2. Review user details and device ID
3. Click "Verify" to approve device
4. Click "Reject" to deny access
5. User can now login from verified device

### Monitoring Statistics
1. Dashboard displays real-time statistics:
   - Total students enrolled
   - Total teachers
   - Total fee collection amount
   - Average attendance percentage
   - Pending verifications count

## Dashboard Statistics Explained

### Total Students
Count of all registered students in the system

### Total Teachers
Count of all registered teachers

### Total Fee Collection
Sum of all completed deposit transactions

### Average Attendance
Calculated as: (Total present days / Total attendance records) × 100

### Pending Verifications
Number of users awaiting device verification

## Admin Responsibilities
1. **Verify New Users**: Review and approve device registrations
2. **Monitor Activities**: Track fee payments and academic records
3. **Manage Access**: Control who can access the system
4. **Review Statistics**: Monitor school performance metrics

## Development Notes
- All API calls require admin authentication
- Admin token is stored separately from client token
- Device verification is critical for security
- Statistics are calculated in real-time from database

## Creating Admin Accounts
To create a new admin account, you need to:

1. Hash the password using SHA-512:
   ```javascript
   const crypto = require('crypto');
   const password = 'your_password';
   const hashed = crypto.createHash('sha512').update(password).digest('hex');
   console.log(hashed);
   ```

2. Insert into MongoDB:
   ```javascript
   db.admins.insertOne({
     name: "Admin Name",
     email: "admin@example.com",
     password: "hashed_password_from_step_1",
     role: "admin",
     createdAt: new Date()
   })
   ```

## Testing
To test the application:
1. Create admin account in database
2. Login with admin credentials
3. Register a client account from client app
4. Verify the device from admin dashboard
5. Check statistics update correctly

## Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT secret (different from client app)
3. Configure MongoDB with authentication
4. Build frontend: `npm run build`
5. Serve frontend build with a web server
6. Use process manager (PM2) for backend
7. Set up reverse proxy (nginx)
8. Enable HTTPS
9. Restrict admin access by IP if possible

## Security Best Practices
- Use different JWT secrets for admin and client apps
- Regularly rotate JWT secrets
- Monitor admin login attempts
- Enable two-factor authentication (future enhancement)
- Keep admin credentials secure
- Regular security audits
- Limit admin account creation

## Troubleshooting
- **Cannot login**: Verify admin account exists in database
- **API errors**: Check backend is running and MongoDB is connected
- **Statistics not updating**: Ensure both databases are connected
- **CORS errors**: Verify backend CORS configuration

## Future Enhancements
- Two-factor authentication for admins
- Audit logs for admin actions
- Bulk user verification
- Advanced reporting and analytics
- Email notifications for pending verifications
- Role-based admin permissions (super admin, staff, etc.)

## Database Schema

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (SHA-512 hashed),
  role: String (default: 'admin'),
  createdAt: Date
}
```

### User Model (from client database)
```javascript
{
  name: String,
  email: String (unique),
  password: String (SHA-512 hashed),
  role: String (student/parent),
  deviceId: String,
  isVerified: Boolean,
  studentId: ObjectId,
  children: [ObjectId],
  createdAt: Date
}
```

## License
MIT

## Support
For issues and questions, please contact the development team.
