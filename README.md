# Ledger — Student & Class Management System

A full-stack capstone project built on the pattern of your two reference repos
(`SKCET-class-backend` and `SKCET-MERN`): Express + MongoDB on the back end,
JWT auth, and a React front end. It keeps the same core ideas — `User` and
`Student` models, signup/login, protected routes — and extends them into a
complete app with courses, enrollment, attendance, and a role-aware UI, so
it stands on its own as a demoable project rather than a copy of the reference
code.

## What it does

- **Auth** — sign up as an admin, teacher, or student; JWT-based login; passwords hashed with bcrypt.
- **Roles**
  - **Admin** — manage students and courses, enroll students, delete records.
  - **Teacher** — view courses, enroll students, mark attendance.
  - **Student** — view enrolled courses and their own attendance percentage.
- **Students** — roster view, edit department/year/roll number, remove a student (and their account).
- **Courses** — create/edit/delete courses, enroll students, see who's assigned.
- **Attendance** — mark present/absent per course per day; students see a running attendance percentage.

## Project structure

```
capstone-project/
├── backend/     Express API (MongoDB via Mongoose, JWT auth)
└── frontend/    React app (Vite, react-router-dom, axios)
```

## Running it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your MongoDB instance (local or Atlas) and a real JWT_SECRET
npm run dev
```

The API starts on `http://localhost:8000` (or whatever `PORT` you set).
You need a MongoDB instance running — either install MongoDB locally, run it
via Docker (`docker run -d -p 27017:27017 mongo`), or use a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its
connection string into `MONGO_URI`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend isn't on localhost:8000
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it,
register an account (try one as `admin` first so you can create courses),
then explore.

## Suggested demo flow for your presentation

1. Register an **admin** account.
2. As admin, register a couple of **student** accounts and a **teacher** account (open a private/incognito tab, or log out between registrations).
3. Log back in as admin → create 1–2 courses → enroll the students you created.
4. Log in as the teacher (or admin) → go to Attendance → pick a course → mark today's attendance.
5. Log in as a student → check Dashboard and Attendance to see the recorded percentage.

## Where it differs from the reference repos

- Passwords are hashed and login is JWT-protected everywhere (the reference `userControllers.js` compared plaintext passwords on the generic user route — this version doesn't).
- Adds `Course` and `Attendance` models/routes that didn't exist in either reference repo.
- Role-based access control (`admin` / `teacher` / `student`) via middleware, instead of a single undifferentiated `User`.
- A complete React front end wired to the API (the reference `SKCET-MERN` repo had separate, unconnected React practice apps).

## Extending it further

Ideas if you want to go beyond this for the presentation or a later iteration:
- Grades/marks module alongside attendance.
- Email verification or password reset.
- Pagination and search on the student roster.
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify) with a live demo link.
