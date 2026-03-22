# TechBorg LMS

A full-stack Learning Management System built with React and Node.js. Supports students, tutors, and admins with course management, certifications, rewards, payments, and more.

---

## Tech Stack

**Frontend**
- React 18 + Vite 6
- React Router DOM 7
- Lucide React, Recharts, Chart.js
- CSS Modules (custom dark theme)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose 7
- JWT Authentication
- Nodemailer (Zoho SMTP)
- Razorpay Payments
- Multer (file uploads)
- Helmet + express-rate-limit (security)

---

## Project Structure

```
tb-web/
├── Backend/
│   ├── api/index.js          # Centralized route registration
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, security, rate limiting
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── uploads/              # Uploaded files
│   ├── scripts/              # One-time migration scripts
│   ├── Server.js
│   └── .env
└── Frontend/
    ├── src/
    │   ├── AdminCms/         # CMS editors (admin)
    │   ├── Components/       # Navbar, Footer, SEO
    │   ├── Dashboard/        # Admin, Tutor, User dashboards
    │   ├── ExamGuide/        # Static exam guide pages
    │   ├── Legal/            # Privacy, Terms, Cookies, FAQ
    │   ├── Pages/            # All public pages
    │   ├── Profile/          # User/Tutor/Admin profiles
    │   ├── Routes/           # PagesRoute.jsx
    │   ├── Styles/           # CSS per section
    │   └── App.jsx
    └── .env
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Zoho Mail account (or any SMTP)
- Razorpay account (for payments)

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=8000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx

# Email (Zoho)
EMAIL_HOST=smtp.zoho.in
EMAIL_PORT=587
EMAIL_USER=support@yourdomain.com
EMAIL_PASS=your_app_password
EMAIL_FROM=TechBorg <support@yourdomain.com>

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## Features

### Authentication
- Student / Tutor / Admin role-based login
- JWT tokens, bcrypt password hashing
- Forgot password via email (reset link)
- Ban/unban users with reason

### Courses
- Admin creates and manages courses
- Tutors manage their own courses
- Students enroll, track progress, complete modules
- Enrollment accept/reject workflow

### Certificates
- Auto-generated certificate ID on course completion
- Printable/downloadable dark-themed certificate
- Public shareable URL: `/certificate/:certId`
- Certificate verification page (no login required)

### Rewards
- Students earn points on enrollment acceptance and course completion
- Tutors earn points per course, blog, enrollment, and learn content
- Leaderboard for tutors
- BorgCoins system for tutors

### Referral System
- Unique referral codes per user (`TB-XXXXXXXX`)
- 25 points awarded to referrer on signup
- Admin referral tracking dashboard

### Payments
- Razorpay integration for paid course enrollments
- Invoice generation and management

### Learn Content
- Tutors upload structured learn content (languages + modules)
- Students browse and read learn content
- Tutor rewards tied to learn content created

### Community
- Community posts and comments
- Public community feed

### Admin Panel
- Manage users, tutors, courses, blogs, enrollments, exams, invoices
- CMS for Home, About, Contact, Support, Privacy, Terms pages
- Visitor analytics with geo map
- Security dashboard (failed login logs)
- Notification management
- Referral tracking

### Other
- Job alerts and applications
- News section
- Innovation showcase
- Support categories
- SEO with React Helmet

---

## API Overview

All routes are prefixed with `/api`.

| Prefix | Description |
|---|---|
| `/auth` | Register, login, profile, password reset |
| `/courses` | Course CRUD |
| `/enrollments` | Enroll, status, certificates, verify |
| `/blogs` | Blog CRUD |
| `/learn` | Learn content |
| `/rewards` | Tutor rewards + leaderboard |
| `/student-rewards` | Student points |
| `/referral` | Referral codes and tracking |
| `/invoices` | Invoice management |
| `/payment` | Razorpay order + verify |
| `/exams` | Exam management |
| `/jobs` | Job listings |
| `/applications` | Job applications |
| `/notifications` | Notifications |
| `/community` | Posts and comments |
| `/progress` | Learning progress tracking |
| `/visitors` | Visitor analytics |
| `/security` | Security logs |
| `/borgcoins` | BorgCoin transactions |
| `/support` | Support categories |
| `/news` | News articles |
| `/innovations` | Innovation posts |
| `/about` | About page content |
| `/home` | Home page CMS content |
| `/contact` | Contact messages |

---

## Scripts

Backfill certificate IDs for existing completed enrollments:

```bash
cd Backend
node scripts/backfillCertIds.js
```

---

## Environment Notes

- Do **not** use `express-mongo-sanitize`, `xss-clean`, or `hpp` — incompatible with Express 5
- All `findByIdAndUpdate` calls use `$set` operator
- MongoDB Atlas: whitelist your IP under **Network Access**
- Zoho SMTP requires SMTP access enabled in mail settings and an App Password if 2FA is on
