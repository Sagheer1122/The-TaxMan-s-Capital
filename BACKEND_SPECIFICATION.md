# Master Specification & Prompt: Express.js Backend & Full-Stack Integration
## Project: The TaxMan's Capital (CA & ACCA Career & Learning Platform)

---

## 1. Executive Summary & Architectural Overview

This document serves as the complete technical blueprint and master AI prompt for transitioning **The TaxMan's Capital** from mock/Supabase data handling to a custom, high-performance **Node.js + Express.js REST API** backend paired with a **MongoDB (Mongoose)** or **PostgreSQL (Prisma/Sequelize)** database.

### Core Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, Lucide Icons, Custom Animated Cursor & Toast Notification System.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose (or PostgreSQL with Prisma).
- **Authentication**: JWT (JSON Web Tokens) with HTTP Authorization Header (`Bearer <token>`) & Bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Roles include `user` (Student/Professional) and `admin` / `team_head`.

---

## 2. Database Models & Schema Definitions

### 2.1 User Schema (`users`)
```json
{
  "_id": "ObjectId",
  "full_name": "String (Required)",
  "username": "String (Required, Unique)",
  "email": "String (Required, Unique)",
  "password_hash": "String (Required)",
  "role": "Enum ['user', 'admin', 'team_head'] (Default: 'user')",
  "avatar_url": "String",
  "level": "Enum ['PRC', 'CAF', 'CFAP', 'MSA', 'ACCA', 'Qualified'] (Default: 'CAF')",
  "phone": "String",
  "city": "String",
  "institution": "String",
  "papers_cleared": "Number (Default: 0)",
  "cv_url": "String",
  "saved_jobs": ["ObjectId (Ref: Job)"],
  "created_at": "Date",
  "updated_at": "Date"
}
```

### 2.2 Job / Placement Schema (`jobs`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "company": "String (Required)",
  "location": "String (Required, e.g. Lahore, Karachi, Dubai, UAE)",
  "level": "String (e.g. CA CAF Qualified, ACCA Member)",
  "job_type": "Enum ['Articleship', 'Internship', 'Full-time', 'Contract']",
  "is_overseas": "Boolean (Default: false)",
  "deadline": "String or Date",
  "description": "String",
  "requirements": ["String"],
  "posted_by": "ObjectId (Ref: User)",
  "created_at": "Date"
}
```

### 2.3 Resource Schema (`resources`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "description": "String",
  "category": "Enum ['PRC', 'CAF', 'Training/Induction', 'CFAP & SCS (Finals)', 'CA Qualified', 'ACCA']",
  "type": "Enum ['PDF', 'DOCX', 'ZIP', 'XLSX', 'LINK']",
  "downloads": "Number (Default: 0)",
  "tag": "String (e.g. Audit, CV, Tax)",
  "tag_color": "String",
  "btn_color": "String",
  "download_url": "String (Required)",
  "is_featured": "Boolean (Default: false)",
  "created_at": "Date"
}
```

### 2.4 Announcement Schema (`announcements`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "summary": "String",
  "content": "String (Full Rich Text / Markdown)",
  "category": "Enum ['Jobs & Inductions', 'Official Notices', 'Competitions', 'Study Updates', 'Community Updates', 'General', 'Event', 'Alert']",
  "event_date": "String",
  "is_pinned": "Boolean (Default: false)",
  "created_at": "Date"
}
```

### 2.5 Event Schema (`events`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "desc": "String",
  "date": "String (e.g. July 25, 2026)",
  "time": "String (e.g. 04:00 PM PKT)",
  "speaker": {
    "name": "String",
    "title": "String",
    "organization": "String",
    "role": "String"
  },
  "status": "Enum ['Upcoming', 'Live', 'Recorded']",
  "qual_target": "String (e.g. CAF & ACCA)",
  "location": "String (e.g. Zoom Live / Lahore Expo)",
  "meeting_link": "String",
  "recording_url": "String",
  "registered_users": ["ObjectId (Ref: User)"],
  "created_at": "Date"
}
```

### 2.6 Counseling / Contact Message Schema (`messages`)
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (Ref: User, Optional)",
  "name": "String (Required)",
  "email": "String (Required)",
  "phone": "String",
  "subject": "String",
  "category": "Enum ['General Inquiry', 'Career Guidance', 'Articleship Guidance', 'Exam Strategy', 'Technical Issue']",
  "message": "String (Required)",
  "status": "Enum ['Pending', 'Replied', 'Closed'] (Default: 'Pending')",
  "reply": {
    "reply_text": "String",
    "replied_by": "String (Admin Name)",
    "replied_at": "Date"
  },
  "created_at": "Date"
}
```

### 2.7 Resource Request Schema (`resource_requests`)
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (Ref: User, Optional)",
  "name": "String (Required)",
  "email": "String (Required)",
  "resource_title": "String (Required)",
  "category": "String",
  "notes": "String",
  "status": "Enum ['Pending', 'Fulfilled', 'Rejected'] (Default: 'Pending')",
  "created_at": "Date"
}
```

### 2.8 Community Group Schema (`communities`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "category_key": "Enum ['prc', 'caf', 'cfap', 'acca', 'alumni']",
  "badge": "String",
  "badge_bg": "String",
  "description": "String",
  "members_count_text": "String",
  "bullets": ["String"],
  "whatsapp_link": "String",
  "discord_link": "String",
  "created_at": "Date"
}
```

### 2.9 Podcast Schema (`podcasts`)
```json
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "guest": "String",
  "duration": "String",
  "views": "String",
  "youtube_id": "String (Required, YouTube Video ID)",
  "youtube_url": "String",
  "qual_tag": "String (e.g. CAF / ACCA / CFAP)",
  "type_tag": "Enum ['Interview Prep', 'Career Path', 'Exam Strategy', 'Firm Life']",
  "likes_count": "Number (Default: 0)",
  "created_at": "Date"
}
```

---

## 3. Complete REST API Endpoint Specification

### 3.1 Authentication & Profile Routes (`/api/auth`)
- `POST /api/auth/register` - Create user account (returns JWT token & user payload).
- `POST /api/auth/login` - Authenticate user (returns JWT token & user payload).
- `GET /api/auth/me` - Fetch authenticated user profile using JWT token.
- `PUT /api/auth/profile` - Update user profile details (city, phone, level, cv_url, etc.).

### 3.2 Jobs & Inductions Routes (`/api/jobs`)
- `GET /api/jobs` - Fetch jobs with query parameters (`?search=...&city=...&level=...&type=...&is_overseas=true/false`).
- `GET /api/jobs/:id` - Fetch single job detail.
- `POST /api/jobs` - [Admin Only] Create new job listing.
- `PUT /api/jobs/:id` - [Admin Only] Update job listing.
- `DELETE /api/jobs/:id` - [Admin Only] Delete job listing.
- `POST /api/jobs/:id/save` - [Auth Required] Toggle save/bookmark job for logged-in user.

### 3.3 Resources & Study Materials Routes (`/api/resources`)
- `GET /api/resources` - Fetch study resources with filters (`?category=...&search=...`).
- `GET /api/resources/:id` - Fetch single resource detail.
- `POST /api/resources` - [Admin Only] Create new resource entry.
- `PUT /api/resources/:id` - [Admin Only] Update resource.
- `DELETE /api/resources/:id` - [Admin Only] Delete resource.
- `POST /api/resources/:id/download` - Increment download count for resource.

### 3.4 Announcements & Notices Routes (`/api/announcements`)
- `GET /api/announcements` - Fetch all announcements (`?category=...&search=...`).
- `GET /api/announcements/:id` - Fetch announcement details.
- `POST /api/announcements` - [Admin Only] Post new announcement.
- `PUT /api/announcements/:id` - [Admin Only] Edit announcement.
- `DELETE /api/announcements/:id` - [Admin Only] Delete announcement.

### 3.5 Events & Webinars Routes (`/api/events`)
- `GET /api/events` - Fetch events (`?status=...&qual=...`).
- `POST /api/events` - [Admin Only] Create new event.
- `PUT /api/events/:id` - [Admin Only] Edit event.
- `DELETE /api/events/:id` - [Admin Only] Delete event.
- `POST /api/events/:id/register` - [Auth Required] Register logged-in user for event.

### 3.6 Career Counseling & Contact Queries Routes (`/api/messages`)
- `POST /api/messages` - Submit contact form or counseling query.
- `GET /api/messages/my-queries` - [Auth Required] Fetch queries submitted by current user.
- `GET /api/messages` - [Admin Only] Fetch all student counseling queries and contact submissions.
- `PUT /api/messages/:id/reply` - [Admin Only] Submit response to student query.

### 3.7 Resource Requests Routes (`/api/resource-requests`)
- `POST /api/resource-requests` - Submit request for custom notes/CV template.
- `GET /api/resource-requests/my-requests` - [Auth Required] Fetch user's requests.
- `GET /api/resource-requests` - [Admin Only] Fetch all incoming requests.
- `PUT /api/resource-requests/:id` - [Admin Only] Update status (Pending/Fulfilled/Rejected).

### 3.8 Community Groups Routes (`/api/community`)
- `GET /api/community` - Fetch community group channels and links.
- `POST /api/community` - [Admin Only] Create community group.
- `PUT /api/community/:id` - [Admin Only] Update group details or WhatsApp/Discord link.
- `DELETE /api/community/:id` - [Admin Only] Delete community group.

### 3.9 Podcasts Routes (`/api/podcasts`)
- `GET /api/podcasts` - Fetch podcasts (`?type=...&qual=...&search=...`).
- `POST /api/podcasts` - [Admin Only] Add podcast.
- `PUT /api/podcasts/:id` - [Admin Only] Update podcast metadata.
- `DELETE /api/podcasts/:id` - [Admin Only] Remove podcast.
- `POST /api/podcasts/:id/like` - Toggle like on podcast.

### 3.10 Admin Dashboard & System Overview Routes (`/api/admin`)
- `GET /api/admin/stats` - Fetch total counts of Users, Jobs, Resources, Announcements, Pending Queries, Pending Requests.
- `GET /api/admin/users` - Fetch list of registered profiles.
- `PUT /api/admin/users/:id/role` - Update user role (`user`, `admin`, `team_head`).

---

## 4. Page-by-Page Requirements & API Integrations

### Page 1: Home (`Home.jsx`)
- **UI Elements**: Hero banner with mentor callouts, statistics counter, quick navigation tabs, featured placement cards, podcasts highlight, floating social links.
- **Backend Interactions**:
  - `GET /api/jobs?limit=3` for latest job preview.
  - `GET /api/resources?is_featured=true` for featured study notes.
  - `GET /api/podcasts?limit=2` for latest podcast episodes.

### Page 2: Login & Register Modal (`Login.jsx`)
- **UI Elements**: 3D Flip Card (Sign In on front, Sign Up on back), show/hide password toggle, alert messages.
- **Backend Interactions**:
  - `POST /api/auth/login`: Sends `{ email, password }`, receives `{ token, user }`. Store token in `localStorage.setItem('auth_token', token)`.
  - `POST /api/auth/register`: Sends `{ full_name, username, email, password }`, receives `{ token, user }`.

### Page 3: Jobs & Inductions (`Jobs.jsx`)
- **UI Elements**: 3 Modes (`jobs`, `overseas`, `inductions`), multi-filter search bar (Cities, Levels, Top Big 4 Firms), Job Details Modal, Direct Email Application button, Bookmark job button.
- **Backend Interactions**:
  - `GET /api/jobs`: Fetches job cards based on active tab and search criteria.
  - `POST /api/jobs/:id/save`: Updates user's saved jobs array.

### Page 4: Career Support & Counseling (`career_support.jsx`)
- **UI Elements**: 4 Core Services breakdown (Career Roadmap, CV & Resume Review, Interview Prep, Placement Assistance), Mentor cards (Saboor Ahmad, Usman Saleem, Hassan Raza, Ali Iqbal), Counseling Appointment Booking Modal.
- **Backend Interactions**:
  - `POST /api/messages`: Submits counseling request with category `'Career Guidance'`.

### Page 5: Resources & Study Materials (`Resources.jsx`)
- **UI Elements**: Category filter pills (PRC, CAF, Training/Induction, CFAP & SCS, CA Qualified, ACCA), search bar, downloadable file cards, "Request Resource" Modal, pagination.
- **Backend Interactions**:
  - `GET /api/resources`: Fetches resources by category and search keyword.
  - `POST /api/resources/:id/download`: Increments download stats on database.
  - `POST /api/resource-requests`: Submits custom resource request form.

### Page 6: Announcements & Official Notices (`Announcements.jsx`)
- **UI Elements**: Filter tabs (All, Jobs & Inductions, Official Notices, Competitions, Study Updates, Community Updates), announcement list, detail modal view, subscription options.
- **Backend Interactions**:
  - `GET /api/announcements`: Fetches all public notices.
  - `GET /api/announcements/:id`: Fetches detailed text for modal popup.

### Page 7: Events & Webinars (`Events.jsx`)
- **UI Elements**: Event status filters (All, Upcoming, Live, Recorded), Event cards with speaker info, Live Zoom link trigger, Registration Modal.
- **Backend Interactions**:
  - `GET /api/events`: Loads upcoming and past webinars.
  - `POST /api/events/:id/register`: Registers logged-in student for event.

### Page 8: Podcasts & Seminars (`Podcasts.jsx`)
- **UI Elements**: qualification pills (CAF, ACCA, CFAP), type filters (Interview Prep, Career Path, Exam Strategy), custom YouTube embedded modal, like/bookmark state.
- **Backend Interactions**:
  - `GET /api/podcasts`: Loads podcast list.
  - `POST /api/podcasts/:id/like`: Updates likes count.

### Page 9: Community Rooms (`Community.jsx`)
- **UI Elements**: Group cards for PRC, CAF, CFAP, ACCA, and Alumni, direct Join WhatsApp / Join Discord links, feature breakdown.
- **Backend Interactions**:
  - `GET /api/community`: Loads group information and group chat invite links.

### Page 10: Contact Us (`Contact.jsx`)
- **UI Elements**: Contact form (Name, Email, Phone, Category, Subject, Message), direct office locations (Lahore, Karachi, Islamabad), interactive accordion FAQs.
- **Backend Interactions**:
  - `POST /api/messages`: Submits contact form query to database.

### Page 11: User Dashboard (`UserDashboard.jsx`)
- **UI Elements**: Overview tab, Saved Placements tab, My Counseling Queries tab (showing admin replies in real-time), My Resource Requests tab, Profile Settings tab (Full Name, Qualification Level, Phone, City, Institution, Papers Cleared, CV Link).
- **Backend Interactions**:
  - `GET /api/auth/me`: Loads latest profile state.
  - `PUT /api/auth/profile`: Saves profile updates.
  - `GET /api/messages/my-queries`: Loads user's counseling history and admin replies.
  - `GET /api/resource-requests/my-requests`: Loads user's resource requests status.

### Page 12: Admin Dashboard (`AdminDashboard.jsx`)
- **UI Elements**:
  - **Dashboard SubTab**: System statistics cards (Total Users, Active Jobs, Total Resources, Pending Queries, Pending Requests).
  - **Users SubTab**: User list with role dropdown (`user` -> `admin` -> `team_head`).
  - **Jobs SubTab**: Jobs CRUD table + Add/Edit Job Modal.
  - **Resources SubTab**: Resources CRUD table + Add/Edit Resource Modal.
  - **Announcements SubTab**: Announcements CRUD table + Add/Edit Announcement Modal.
  - **Community SubTab**: Community Groups CRUD + Add/Edit Modal.
  - **Counseling Queries SubTab**: Student messages inbox + Reply Modal.
  - **Resource Requests SubTab**: Student requests inbox + Status updater.
- **Backend Interactions**: Full set of Admin CRUD endpoints (`/api/admin/...`, `/api/jobs`, `/api/resources`, `/api/announcements`, `/api/community`, `/api/messages/:id/reply`).

---

## 5. Express.js Backend Folder Structure & Setup Instructions

### Recommended Directory Layout for `server/`:
```
server/
├── config/
│   ├── db.js             # Database Connection (MongoDB / PostgreSQL)
│   └── jwt.js            # JWT Secret & Expiry settings
├── middleware/
│   ├── authMiddleware.js # Protect routes & verify JWT token
│   └── adminMiddleware.js# Ensure user has role 'admin' or 'team_head'
├── models/
│   ├── User.js
│   ├── Job.js
│   ├── Resource.js
│   ├── Announcement.js
│   ├── Event.js
│   ├── Message.js
│   ├── ResourceRequest.js
│   ├── Community.js
│   └── Podcast.js
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── resourceRoutes.js
│   ├── announcementRoutes.js
│   ├── eventRoutes.js
│   ├── messageRoutes.js
│   ├── requestRoutes.js
│   ├── communityRoutes.js
│   ├── podcastRoutes.js
│   └── adminRoutes.js
├── controllers/          # Business logic handlers for each route
├── .env                  # PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
├── server.js             # Entry point initializing Express app & middleware
└── package.json
```

---

## 6. Frontend API Service Replacement Guide (`authService.js` & `api.js`)

Create a centralized API helper `src/services/api.js`:
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

Update `src/services/authService.js`:
```javascript
import API from './api';

export const loginUser = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('auth_token', res.data.token);
  }
  return res.data;
};

export const registerUser = async (email, password, username, full_name) => {
  const res = await API.post('/auth/register', { email, password, username, full_name });
  if (res.data.token) {
    localStorage.setItem('auth_token', res.data.token);
  }
  return res.data;
};

export const getCurrentSession = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    const res = await API.get('/auth/me');
    return { user: res.data };
  } catch (err) {
    localStorage.removeItem('auth_token');
    return null;
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('auth_token');
  window.location.reload();
};
```

---

## 7. Master Prompt for AI / Developers

> **Copy-paste prompt to build the Node.js Express Backend:**
> 
> "Please build a complete Node.js + Express.js backend for 'The TaxMan's Capital' based on the schema definitions and REST API routes specified in `BACKEND_SPECIFICATION.md`.
> Requirements:
> 1. Set up Express server with CORS, JSON body parser, Dotenv, and MongoDB connection via Mongoose.
> 2. Create Mongoose models for User, Job, Resource, Announcement, Event, Message, ResourceRequest, Community, and Podcast.
> 3. Implement JWT authentication (register, login, me, profile update) with password hashing using bcrypt.
> 4. Implement authorization middleware for protecting user routes and restricting admin routes to users with role 'admin' or 'team_head'.
> 5. Create full CRUD controllers and routes for all models (Jobs, Resources, Announcements, Events, Counseling Messages, Resource Requests, Community Groups, Podcasts, Admin Stats).
> 6. Include seed data populating initial mock jobs, resources, announcements, events, community groups, and a default admin account (`admin@taxmanscapital.com` / `Admin@1234`)."
