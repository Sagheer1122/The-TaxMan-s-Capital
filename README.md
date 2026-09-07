# 🌟 The TaxMan's Capital

> **Pakistan's Premier Career, Mentorship & Education Ecosystem for CA, ACCA, and Finance Professionals.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📌 Project Overview

**The TaxMan's Capital** is an enterprise-grade digital ecosystem engineered specifically for Chartered Accountancy (**CA/ICAP**), **ACCA**, and finance trainees as well as qualified professionals in Pakistan and overseas. 

Founded under the leadership of **Saboor Ahmad CA**, the platform connects students with Big 4 firms, delivers verified study materials, offers structured career counseling, and provides an executive administration control center with Role-Based Access Control (RBAC).

---

## ✨ Key Features & Capabilities

### 🎓 1. Student & Professional Career Portal
- **💼 Tri-Sector Job & Induction Board**:
  - **Domestic Opportunities**: Corporate finance, tax consultancy, and internal audit roles across Pakistan.
  - **Trainee Inductions**: Dedicated articleship & trainee induction listings for CA (PRC / CAF / CFAP) and ACCA students across Big 4 (PwC / AF Ferguson, KPMG, EY, Deloitte) and premier audit firms.
  - **Overseas Placements**: High-impact international vacancies across the Middle East (Dubai, Riyadh, Doha), the UK, and global financial hubs.
- **📚 Study Materials & Resources Hub**:
  - Curated notes, CAF / CFAP past paper solutions, interview preparation checklists, and CV templates with real-time download counters and search filters.
- **🎥 Media Hub & YouTube Integration**:
  - Direct sync with the `@SaboorAhmadCA` YouTube channel featuring firm reviews, rotation policy breakdowns, exam prep masterclasses, and an interactive video modal player.
- **📰 Editorial & Blog System**:
  - In-depth articles covering induction advice, study tips, and industry trends with category tags, reading time indicators, and responsive typography.
- **💬 Community Study Rooms**:
  - Direct access to moderated study groups (WhatsApp & Discord) organized by qualification level (PRC, CAF, CFAP, ACCA).
- **🧭 Career Tools & Support**:
  - Direct counseling query submission, salary estimators, beginner orientation guides, and mentor contact forms.

---

### 🛡️ 2. Advanced Administration & Role-Based Access Control (RBAC)

The platform incorporates granular Role-Based Access Control with distinct privilege tiers:

- **👑 Super Administrator (`admin`)**:
  - Full system authority.
  - **User Profile Management**: View, search, filter, edit, assign roles, toggle account statuses (Active / Blocked), or remove users.
  - **Single Root Admin Enforcement**: Protected primary administrative account (`admin@gmail.com`) safeguarding against unauthorized demotion or deletion.
  - **Moderator Assignment**: Ability to designate system moderators to manage daily platform operations.
- **🛡️ Content Moderator (`moderator`)**:
  - Operational management access: publish and edit blog posts, list job & trainee openings, upload study materials, and manage student counseling inquiries.
  - Restricted from modifying core user records or altering administrative credentials.
- **⚡ Dual Layout (List Table ↔ Cards Grid)**:
  - Every administrative section features a quick **List / Grid view switcher** for desktop and tablet productivity.
- **📄 Smart 15-Item Pagination**:
  - Responsive pagination with item range indicators (`Showing 1 to 15 of 45 results`) and numbered controls.
- **📁 Dual Media Upload System (`DualMediaUpload`)**:
  - Supports both **Direct Web URL** input and **Device File Upload** (drag & drop with client-side preview) for cover photos, study PDFs, documents, and profile avatars.
- **💬 Inquiry & Counseling Inbox**:
  - Centralized management of contact inquiries and mentorship requests with status tracking and direct admin reply modals.

---

### ⚡ 3. Performance & Architecture Highlights
- **🚀 Dynamic Code-Splitting**: Full route lazy-loading via `React.lazy` and `Suspense` with tailored animated loading indicators for rapid initial page load.
- **🛡️ Resilient Offline & Static Fallbacks**: Graceful fallback handling ensuring the web frontend continues to function cleanly when running on static deployments (e.g. Vercel) or when the backend server is temporarily offline.
- **🔔 Global Toast Notification System**: Seamless toast notifications overlay intercepting alerts for non-blocking feedback.
- **🎨 Tailwind CSS v4 Theme Engine**: Modern CSS design tokens (`@theme`) delivering a consistent dark navy and emerald brand palette.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 (Custom dark navy `#021B3A` and vibrant emerald `#00C853`)
- **Icons**: Lucide React
- **Code Optimization**: Dynamic route code-splitting (`React.lazy`), custom toast system, and responsive mobile-first layouts

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and bcryptjs password hashing
- **Security**: Helmet, CORS protection, and Express Rate Limiting
- **File Upload**: Multer with Cloudinary integration

---

## 📂 Project Structure

```plaintext
The-TaxMan-s-Capital/
├── backend/                        # Express + MongoDB REST API
│   ├── src/
│   │   ├── config/                 # DB, Cloudinary & JWT configuration
│   │   ├── controllers/            # Auth, Admin, Blog, Job, Resource controllers
│   │   ├── middleware/             # Auth & role-verification middleware
│   │   ├── models/                 # Mongoose schemas (User, Job, Blog, Resource, etc.)
│   │   ├── routes/                 # API endpoint definitions
│   │   └── server.js               # Backend application entry point
│   ├── package.json
│   └── .env.example
│
├── src/                            # React + Vite Frontend
│   ├── assets/                     # Platform logos, badges, and media
│   ├── components/                 # Reusable UI components
│   │   ├── blog/                   # RichBlogEditor, BlogCard
│   │   ├── common/                 # AdminPagination, DualMediaUpload, Modal
│   │   ├── layout/                 # TopNav, Footer, BottomBar, NotificationPanel
│   │   └── FloatingSocials.jsx     # Floating social links bar
│   ├── pages/ios/                  # Application views & route modules
│   │   ├── AdminDashboard/         # Executive admin & moderation panel
│   │   ├── UserDashboard/          # Student & candidate profile hub
│   │   ├── Home/                   # Hero section & platform gateway
│   │   ├── Jobs/                   # Job & trainee induction board
│   │   ├── Resources/              # Verified study materials library
│   │   ├── Blog/                   # Career blog & reader pages
│   │   ├── Podcasts/               # Video masterclasses & YouTube media hub
│   │   ├── Community/              # WhatsApp & Discord study rooms
│   │   ├── CareerTools/            # Mentorship & guidance questionnaire
│   │   ├── BeginnerGuide/          # CA & finance orientation handbook
│   │   ├── Contact/                # Inquiry & counseling query submission
│   │   └── Login/                  # Authentication & registration
│   ├── services/                   # API service modules & session management
│   ├── App.jsx                     # Root router & toast provider
│   ├── index.css                   # Global styles & Tailwind v4 @theme directives
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
├── vercel.json                     # Vercel SPA rewrite configuration
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (Local MongoDB instance or MongoDB Atlas connection URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Sagheer1122/The-TaxMan-s-Capital.git
cd The-TaxMan-s-Capital
```

### 2. Configure & Run Backend
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taxmancapital
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Production mode
npm start
```

---

### 3. Configure & Run Frontend
From the repository root:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Build for Production
To build optimized static assets:
```bash
npm run build
```
Production assets are generated in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static hosting service.

---

## 🔗 Key API Endpoints

| Method | Endpoint | Description | Access Tier |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active authenticated user session | Authenticated |
| `GET` | `/api/admin/users` | List all users with pagination and search | Admin |
| `POST` | `/api/admin/users` | Create user profile manually | Admin |
| `PUT` | `/api/admin/users/:id` | Modify user account details or role | Admin |
| `PATCH`| `/api/admin/users/:id/status`| Toggle user status (Active / Blocked) | Admin |
| `DELETE`| `/api/admin/users/:id` | Delete user record | Admin |
| `GET` | `/api/blogs` | Retrieve published blog posts | Public |
| `POST` | `/api/blogs` | Create a new blog post | Admin / Moderator |
| `GET` | `/api/jobs` | Browse active job & induction vacancies | Public |
| `POST` | `/api/jobs` | Post new job or articleship opportunity | Admin / Moderator |
| `GET` | `/api/resources` | Browse study materials & guides | Public |
| `POST` | `/api/resources` | Upload new study material | Admin / Moderator |
| `POST` | `/api/contact` | Submit counseling query or inquiry | Public |
| `GET` | `/api/contact` | Review inquiries & counseling requests | Admin / Moderator |

---

## 👥 Leadership & Contributors

- **Saboor Ahmad CA** — *Founder & Lead Career Mentor*
- **Sagheer Ahmad** — *Lead Full-Stack Developer & Platform Architect*

---

## 📄 License
This project is licensed under the **ISC License**.
