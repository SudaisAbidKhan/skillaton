# CUSIT Smart Campus Portal - MERN Stack

A comprehensive campus management system built with MERN stack featuring role-based access, complaint management, event registration, and FYP (Final Year Project) coordination.

## 🎯 Features Implemented

### ✅ Student Module (Fully Implemented)

- **Authentication**: Secure login/registration with JWT
- **Dashboard**: Overview with statistics and announcements
- **Complaints Management**:
  - Submit complaints with category and priority
  - Track complaint status
  - View admin responses
  - Delete submitted complaints
- **Event Registration**:
  - Browse available events
  - Register for events with seat limit validation
  - View registration history
  - Cancel registrations
- **FYP (Final Year Project)**:
  - Send partner requests to other students
  - Accept/reject partner requests
  - Form groups (2-person teams)
  - Create project proposals
  - Send supervisor requests (max 3 teachers)
  - Auto-rejection of pending requests when one is accepted
- **Profile Management**:
  - View/update profile information
  - View account details

### 📊 Database Models

- User (with roles: student, admin, teacher)
- Complaint (with status workflow)
- Event & EventRegistration (with capacity management)
- FYPGroup, FYPProject (with supervisor tracking)
- PartnerRequest, SupervisorRequest
- Notification/Announcement
- Milestone

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Server Setup

1. **Install dependencies**:

   ```bash
   cd server
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start server**:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Client Setup

1. **Install dependencies**:

   ```bash
   cd client
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env.local
   # Make sure VITE_API_BASE_URL points to server
   ```

3. **Start client**:
   ```bash
   npm run dev
   # Client runs on http://localhost:5173
   ```

## 🎨 Styling

- **Theme**: Dark Blue & White (MS Word Blue Color Scheme)
- **Framework**: Tailwind CSS v4
- **Colors**:
  - Primary: `#1e40af` (Blue-800)
  - Background: `#0f172a` (Slate-900)
  - Surface: `#1e293b` (Slate-800)
  - Text: White / Slate-400

- **No extra CSS files**: All styles use Tailwind utility classes inline
- **Notifications**: React Toastify (dark theme)

## 📁 Project Structure

```
client/
├── src/
│   ├── api/
│   │   ├── axiosConfig.js
│   │   ├── complaints.js
│   │   ├── events.js
│   │   ├── fyp.js
│   │   ├── notifications.js
│   │   └── users.js
│   ├── Components/
│   │   ├── common/         # Navbar, Sidebar, Modal, etc.
│   │   ├── dashboard/      # Stats, Announcements, Activity
│   │   ├── complaints/     # Form, Card components
│   │   ├── events/         # Event and Registration components
│   │   └── fyp/            # Partner, Project, Supervisor components
│   └── Pages/
│       ├── auth/           # Login page
│       ├── student/        # All student pages
│       ├── Home.jsx
│       └── About.jsx

server/
├── models/
│   ├── user.model.js
│   ├── complaint.model.js
│   ├── event.model.js
│   ├── eventRegistration.model.js
│   ├── fypGroup.model.js
│   ├── fypProject.model.js
│   ├── partnerRequest.model.js
│   ├── supervisorRequest.model.js
│   ├── notification.model.js
│   └── milestone.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── complaint.controller.js
│   ├── event.controller.js
│   ├── fyp.controller.js
│   └── notification.controller.js
├── routes/
│   ├── auth.route.js
│   ├── complaint.route.js
│   ├── event.route.js
│   ├── fyp.route.js
│   └── notification.route.js
├── middleware/
│   ├── userAuth.js
│   └── roleCheck.js
├── config/
│   └── mongoDB.js
├── app.js
└── index.js
```

## 📝 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Complaints

- `POST /api/v1/complaints/submit` - Submit complaint
- `GET /api/v1/complaints/my-complaints` - Get student's complaints
- `GET /api/v1/complaints/:id` - Get complaint details
- `DELETE /api/v1/complaints/:id` - Delete complaint (student)
- `GET /api/v1/complaints/` - Get all complaints (admin)
- `PUT /api/v1/complaints/:id/respond` - Respond to complaint (admin)

### Events

- `GET /api/v1/events/` - Get all events
- `GET /api/v1/events/:id` - Get event details
- `POST /api/v1/events/register` - Register for event
- `GET /api/v1/events/my-registrations` - Get student registrations
- `DELETE /api/v1/events/registration/:id` - Cancel registration
- `POST /api/v1/events/create` - Create event (admin)

### FYP

- `POST /api/v1/fyp/partner-request/send` - Send partner request
- `GET /api/v1/fyp/partner-request/pending` - Get pending requests
- `POST /api/v1/fyp/partner-request/accept` - Accept request
- `POST /api/v1/fyp/partner-request/reject` - Reject request
- `GET /api/v1/fyp/my-group` - Get group details
- `POST /api/v1/fyp/project/create` - Create FYP project
- `POST /api/v1/fyp/supervisor-request/send` - Send supervisor request
- `GET /api/v1/fyp/supervisor-request/pending` - Get pending supervisor requests
- `POST /api/v1/fyp/supervisor-request/accept` - Accept supervisor request
- `POST /api/v1/fyp/supervisor-request/reject` - Reject supervisor request

### Notifications

- `GET /api/v1/notifications/` - Get announcements
- `POST /api/v1/notifications/mark-read` - Mark as read
- `GET /api/v1/notifications/unread-count` - Get unread count
- `POST /api/v1/notifications/create` - Create announcement (admin)

## 🔐 Authentication

- JWT-based authentication with 7-day expiry
- Passwords hashed with bcryptjs
- Cookies used for token storage
- Role-based access control (RBAC)

## 📋 Complaint Workflow

1. Student submits complaint with category and priority
2. Admin reviews and acknowledges
3. Admin provides response and marks as resolved/rejected
4. Student can view status updates throughout workflow

**Statuses**: submitted → under_review → acknowledged → resolved/rejected

## 👥 FYP Workflow

### Partner Formation

1. Student A sends partner request to Student B
2. Student B accepts/rejects
3. On acceptance: Group formed with A as leader
4. All other pending requests auto-rejected

### Project & Supervisor Assignment

1. Group leader creates project proposal
2. Leader sends supervisor requests (can send to max 3 teachers)
3. Teacher accepts/rejects request
4. On acceptance: Assigned to project
5. All other pending supervisor requests auto-rejected

## 🎓 Test Account (Manual Creation)

Use any email/password combination for testing. Remember to hash password with bcryptjs before storing.

Example using MongoDB:

```javascript
// In MongoDB shell
db.users.insertOne({
  name: "Test Student",
  email: "student@cusit.edu.pk",
  password: "$2a$10$...", // bcrypt hash of "password123"
  role: "student",
  department: "CS",
  semester: 6,
  studentId: "2020-CS-001",
});
```

## 🚧 TODO - Components Not Yet Implemented

- Admin Dashboard
- Admin Complaint Management
- Admin Event Management
- Admin User Management
- Admin FYP Review
- Teacher Dashboard
- Teacher Supervisor Request Management
- Milestone Management UI
- Advanced Search & Filters
- Real-time Notifications (WebSocket)
- File Uploads (Cloudinary integration)

## 🛠️ Technologies Used

**Frontend**:

- React 19
- Vite
- React Router v7
- Axios
- Tailwind CSS v4
- React Toastify

**Backend**:

- Node.js
- Express.js
- MongoDB/Mongoose
- JWT
- bcryptjs
- CORS

## 📞 Support

For issues or questions:

1. Check the Models to understand data structure
2. Review Controller logic for business rules
3. Test API endpoints using Postman/Thunder Client
4. Check browser console for frontend errors

## 📄 License

MIT License - Built for CUSIT Hackathon

---

**Note**: This system is designed for local campus network deployment. For production, ensure proper security measures, input validation, and error handling are in place.
