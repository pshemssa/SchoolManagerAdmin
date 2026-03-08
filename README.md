# School Management System - Admin Application

## Overview
Administrative application for school staff to manage students, teachers, classes, fees, and verify parent devices. Provides comprehensive oversight of all school operations.

![alt text](image.png)

## Features
- **Dashboard**: Statistics overview of students, teachers, classes, and pending verifications

![alt text](image-1.png)

- **Student Management**: Create, update, delete students; add grades and attendance

![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)

- **Teacher Management**: Full CRUD operations for teacher records
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)
- **Class Management**: Manage classes

![alt text](image-9.png)
![alt text](image-10.png)
![alt text](image-11.png)

- **Fee Management**: 
  - View all transactions from all students
  - Approve/reject deposits with proof verification
  - Approve/reject refund requests
  - View proof documents (images/PDFs)

 ![alt text](image-13.png)

- **Device Verification**: Approve or reject parent device access requests

- **User Management**: View all registered users with student information

![alt text](image-15.png)

## Tech Stack
### Backend
- Node.js & Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- Helmet for security headers
- Express Rate Limit for API protection
- SHA-512 for password hashing

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS (via CDN)
- Lucide React for icons
- Responsive design with mobile sidebar

## Project Structure
```
admin-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── controllers/
│   │   │   ├── adminAuthController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── userManagementController.js
│   │   │   ├── studentManagementController.js
│   │   │   ├── teacherManagementController.js
│   │   │   ├── classManagementController.js
│   │   │   └── feeManagementController.js
│   │   ├── middlewares/
│   │   │   └── adminAuth.js
│   │   ├── routes/
│   │   │   └── admin.js
│   │   ├── services/
│   │   │   ├── adminAuthService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── userManagementService.js
│   │   │   ├── studentManagementService.js
│   │   │   ├── teacherManagementService.js
│   │   │   ├── classManagementService.js
│   │   │   └── feeManagementService.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js              # Creates default admin
│   │   └── migrations/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Teachers.jsx
│   │   │   ├── Classes.jsx
│   │   │   ├── Fees.jsx
│   │   │   └── Devices.jsx
│   │   ├── hooks/
│   │   │   └── usePendingDevicesCount.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd admin-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5001
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=your_secure_admin_jwt_secret
   NODE_ENV=development
   ```

4. Run Prisma migrations and seed:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```

Backend runs on `http://localhost:5001`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd admin-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:3001`

## Default Admin Credentials
After running `npx prisma db seed`:
- **Email**: admin@school.com
- **Password**: admin123

**Important**: Change these credentials in production!

## Database Schema

### Admin
- id (UUID)
- name, email, password (hashed)
- role (admin)
- createdAt

### User (Parents)
- id (UUID)
- name, email, password
- role (parent)
- deviceId, isVerified
- studentId (references Student)
- createdAt

### Student
- id (Integer, auto-increment, max 5 digits)
- name, faculty
- classId, feeBalance
- grades[], attendance[], transactions[], users[]
- createdAt

### Teacher
- id (UUID)
- name, email, password
- subject
- createdAt

### Class
- id (UUID)
- name, grade, teacherId
- schedules[]
- createdAt

### FeeTransaction
- id (UUID)
- studentId, type (deposit/withdraw)
- amount, status (pending/completed/rejected)
- description, proofUrl
- createdAt

### Grade
- id (UUID)
- studentId, subject, grade, marks
- createdAt

### Attendance
- id (UUID)
- studentId, date, status (present/absent)
- createdAt

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### Dashboard
- `GET /api/admin/dashboard/statistics` - Get overview statistics

### User Management
- `GET /api/admin/users` - Get all users with student info
- `GET /api/admin/users/pending` - Get pending verifications
- `PUT /api/admin/users/:userId/verify` - Verify user device
- `PUT /api/admin/users/:userId/reject` - Reject user device

### Student Management
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `POST /api/admin/students/:studentId/grades` - Add grade
- `POST /api/admin/students/:studentId/attendance` - Add attendance

### Teacher Management
- `GET /api/admin/teachers` - Get all teachers
- `GET /api/admin/teachers/:id` - Get teacher by ID
- `POST /api/admin/teachers` - Create teacher
- `PUT /api/admin/teachers/:id` - Update teacher
- `DELETE /api/admin/teachers/:id` - Delete teacher

### Class Management
- `GET /api/admin/classes` - Get all classes
- `GET /api/admin/classes/:id` - Get class by ID
- `POST /api/admin/classes` - Create class
- `PUT /api/admin/classes/:id` - Update class
- `DELETE /api/admin/classes/:id` - Delete class

### Fee Management
- `GET /api/admin/fees/transactions` - Get all transactions
- `GET /api/admin/fees/transactions/:id` - Get transaction by ID
- `PUT /api/admin/fees/deposits/:id/approve` - Approve deposit
- `PUT /api/admin/fees/deposits/:id/reject` - Reject deposit
- `PUT /api/admin/fees/refunds/:id/approve` - Approve refund
- `PUT /api/admin/fees/refunds/:id/reject` - Reject refund

## Key Features Explained

### Device Verification
1. Parents register in client app
2. Admin sees pending devices in Devices page
3. Admin can see parent name, email, and linked student
4. Admin clicks "Approve" or "Reject"
5. Only approved devices can login

### Student Management
1. Admin creates student with name and faculty
2. Student ID is auto-generated (integer)
3. Admin can add grades (subject, grade, marks)
4. Admin can record attendance (date, status)
5. Parents register using this student ID

### Fee Transaction Management
1. Admin sees all transactions from all students
2. Filter by: All, Pending, Approved, Rejected
3. Click "View Proof" to see uploaded document
4. Approve deposits: balance is added to student
5. Reject deposits: no balance change
6. Approve refunds: balance stays deducted
7. Reject refunds: balance is restored

### Teacher & Class Management
1. Create teachers with name, email, subject
2. Create classes with name, grade, teacher
3. Update or delete as needed
4. Full CRUD operations available

## Admin Workflows

### Onboarding New Student
1. Navigate to Students page
2. Click "Add Student"
3. Enter name and faculty
4. Student ID is auto-generated
5. Share student ID with parent for registration

### Verifying Parent Device
1. Navigate to Devices page
2. See pending verification requests
3. Check parent name and linked student
4. Click "Approve" to grant access

### Processing Fee Payment
1. Navigate to Fees page
2. Filter by "Pending"
3. Click "View Proof" to see payment evidence
4. Click "Approve" to add balance
5. Click "Reject" to deny payment

### Adding Grades
1. Navigate to Students page
2. Click on student
3. Click "Add Grade"
4. Enter subject, grade letter, and marks
5. Submit

### Recording Attendance
1. Navigate to Students page
2. Click on student
3. Click "Add Attendance"
4. Select date and status (Present/Absent)
5. Submit

## Security Features
- SHA-512 password hashing
- JWT token authentication
- Admin-only access control
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- Input validation and sanitization
- CORS protection
- Separate admin authentication

## Dashboard Statistics
- Total Students
- Total Teachers
- Total Classes
- Pending Device Verifications
- Total Fee Collected
- Total Refunds
- Pending Transactions

## Fee Management Features
- View all transactions across all students
- Search by student name or description
- Filter by status (All/Pending/Approved)
- View proof documents before approval
- Approve/reject with one click
- Automatic balance calculations
- Transaction history with timestamps

## Device Management Features
- View all registered users
- Filter: All, Pending, Approved
- See linked student for each parent
- Approve/reject device access
- Real-time pending count in sidebar badge

## Environment Variables

### Backend (.env)
```env
PORT=5001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_admin_jwt_secret_min_32_chars
NODE_ENV=development
```

## Production Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`
4. Seed admin: `npx prisma db seed`
5. Start server: `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Update API_URL in `src/services/api.js` to production backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder

### Database (Supabase/Railway)
- Use PostgreSQL database
- Same database as client-app
- Enable connection pooling
- Set up backups
- Configure SSL

## Troubleshooting

### Cannot Login
- Use default credentials: admin@school.com / admin123
- Ensure seed script ran successfully
- Check JWT_SECRET in .env
- Verify database connection

### No Pending Devices
- Ensure parents have registered in client app
- Check database for User records with isVerified=false
- Verify API endpoint is working

### Transactions Not Showing
- Check if client app has created transactions
- Verify database connection
- Check browser console for API errors
- Ensure Prisma client is generated

### Balance Not Updating
- Deposits: Balance updates only after admin approval
- Refunds: Balance deducted immediately, restored if rejected
- Check transaction status in database
- Verify Prisma migrations are applied

## Development Notes
- All API calls require admin JWT authentication
- Admin token stored in localStorage as 'adminToken'
- Sidebar shows pending device count badge
- Pagination: 12 items per page for transactions
- Student ID is auto-incrementing integer (max 5 digits)
- Faculty field replaces email for students
- Tailwind CSS loaded via CDN in index.html

## Testing Checklist
- [ ] Login with default admin credentials
- [ ] View dashboard statistics
- [ ] Create new student
- [ ] Add grade to student
- [ ] Record attendance for student
- [ ] Create teacher
- [ ] Create class
- [ ] Verify parent device
- [ ] View pending transactions
- [ ] View proof document
- [ ] Approve deposit
- [ ] Reject refund
- [ ] Check balance updated correctly

## Seed Script
The seed script (`prisma/seed.js`) creates:
- Default admin account (admin@school.com / admin123)

Run with: `npx prisma db seed`


