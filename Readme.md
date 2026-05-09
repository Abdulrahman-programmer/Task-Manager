# TaskFlow — MERN Task Management App

````md
# TaskFlow

A modern MERN stack task management application with authentication, role-based dashboards, task tracking, and responsive UI built using React + Tailwind CSS.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Task Management
- Create Tasks
- Update Tasks
- Delete Tasks
- Toggle Task Status
- Task Priorities
- Task Status Tracking

### Dashboard
#### Admin Dashboard
- View all users
- View all tasks
- Assign tasks to users
- Track team progress

#### User Dashboard
- View personal tasks
- Update own tasks
- Track completion progress

### UI
- Responsive Design
- Dark Theme
- Tailwind CSS Styling
- Loading Screens
- Modal-based Task Editing

---

# Tech Stack

## Frontend
- React
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# Project Structure

```bash
taskflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── .env
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── README.md
````

---

# Environment Variables

## Frontend `.env`

```env
VITE_APP_BASE_URL=http://localhost:5000
```

## Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your_repo_url>
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd server
npm install
```

---

# Running the Project

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## Tasks

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

### Update Task

```http
PUT /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

# Authentication

JWT token is stored in:

```js
sessionStorage
```

Authorization header format:

```http
Authorization: Bearer <token>
```

---

# Status Values

```js
pending
in progress
completed
```

---

# Priority Values

```js
high
medium
low
```

---

# Future Improvements

* Due Dates
* Drag & Drop Kanban Board
* Notifications
* File Attachments
* Activity Logs
* Search & Filters
* Email Verification

---

# Author

Abdul Rahman

---

# License

This project is licensed under the MIT License.

```
```
