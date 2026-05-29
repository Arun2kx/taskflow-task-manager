# TaskFlow — Task Manager App

A simple task manager built for an internship assignment. Users can register, log in, and manage tasks across three stages: **To Do**, **In Progress**, and **Done**.

Live Demo: https://taskflow-task-manager-five.vercel.app
Backend API: https://taskflow-task-manager-rlto.onrender.com

---

## What it does

- Register and log in with your email and password
- Forgot your password? There's a reset flow (no OTP, just email + new password)
- Create tasks with a title, description, priority, and stage
- Move tasks between columns (To Do → In Progress → Done)
- Edit or delete tasks
- Each user only sees their own tasks
- Clean kanban-style board, works on mobile too

---

## Tech stack

**Frontend:** React + Vite, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs

### Why these?

I went with React because I'm already comfortable with it and it makes building interactive UIs like a task board pretty straightforward. Vite is just faster than CRA for local dev.

For styling, Tailwind was the obvious pick — utility classes are quick to work with and I didn't want to set up a component library for a project this size.

On the backend, Express is simple and doesn't get in your way. MongoDB fit well here because task data is pretty flexible — no complex joins needed. JWT for auth because it's stateless and works well with a decoupled frontend/backend setup.

---

## Project structure

```
taskmanager/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── models/
    │   ├── User.js
    │   └── Task.js
    ├── routes/
    │   ├── auth.js
    │   └── tasks.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    └── package.json
```

---

## Getting started locally

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=some_random_secret_string
CLIENT_URL=http://localhost:5173
```

Then run:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev
```

Frontend will be at `http://localhost:5173`.

---

## MongoDB setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a new cluster (the free M0 tier works fine)
3. Add a database user under **Database Access**
4. Allow connections from anywhere under **Network Access** (0.0.0.0/0)
5. Click **Connect → Connect your application** and copy the connection string
6. Replace `<password>` in the string and paste it as your `MONGO_URI`

---

## API routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| POST | /api/auth/forgot-password | Reset password |
| GET | /api/auth/me | Get current user (auth required) |

### Tasks (all require Bearer token)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/tasks | Get all user's tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## Deployment

### Frontend on Vercel

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend on Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL)
6. Deploy (free tier spins down after inactivity, first request may be slow)

---

## Assumptions and tradeoffs

**Forgot password is simplified** — In a real app you'd send a reset link to the user's email. Here I went with a simple email + new password form since setting up email delivery (nodemailer, SendGrid, etc.) would've added a lot of complexity for a small assignment. The README notes this.

**No drag-and-drop** — I added quick "Move to" buttons on each card instead. Drag-and-drop would need a library like `@dnd-kit` and added complexity I didn't think was necessary here.

**JWT stored in localStorage** — Not ideal for production (httpOnly cookies are safer), but simpler to implement without worrying about CSRF for this scope.

**No pagination** — Tasks are fetched all at once. For most users this won't be an issue, and adding pagination would complicate the UI.

**Tasks have a priority field** — Added this since it felt like a natural thing to have on a task card, even though it wasn't strictly required.

**Optimistic updates for stage changes** — When you move a task between columns, the UI updates immediately and reverts if the API call fails. Feels snappier this way.

---

## Things I'd do differently with more time

- Add drag-and-drop between columns
- Email-based password reset
- Due dates on tasks
- Task filtering / search
- Better mobile experience for the board layout
- Unit tests (at least for the API routes)

---

Built by [Banoth Arun] for internship assignment — June 2025
