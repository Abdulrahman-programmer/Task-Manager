# TaskFlow — MERN Task Manager App

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring authentication, role-based dashboards, and Swagger API documentation.

---

# 🚀 Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

## Task Management
- Create Tasks
- Update Tasks
- Delete Tasks
- Toggle Task Status
- Priority Levels (High / Medium / Low)

## Dashboard System
### Admin
- View all users
- View all tasks
- Assign tasks to users
- Track team progress

### User
- View personal tasks
- Update own tasks
- Track completion progress

## UI Features
- Dark themed modern UI
- Responsive design (mobile + desktop)
- Modal-based task editor
- Loading states
- Smooth UX interactions

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

## Dev Tools
- Swagger (API Documentation)
- dotenv
- nodemon

---

# 📁 Project Structure

```

Task Manager/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── .env
│
└── README.md

````

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
````

---

## Frontend `.env`

```env
VITE_APP_BASE_URL=http://localhost:5000
```

---

# ▶️ Installation & Setup

## 1. Clone Project

```bash
git clone <your_repo_url>
cd Task Manager
```

---

## 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Authentication Flow

* User registers → `/api/auth/register`
* User logs in → `/api/auth/login`
* JWT token stored in `sessionStorage`
* Token sent in headers:

```http
Authorization: Bearer <token>
```

---

# 📌 API Endpoints

## Auth Routes

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Task Routes

### Get all tasks

```http
GET /api/tasks
```

### Create task

```http
POST /api/tasks
```

### Update task

```http
PUT /api/tasks/:id
```

### Delete task

```http
DELETE /api/tasks/:id
```

---

# 📊 Task Status Values

```text
pending
in progress
completed
```

---

# ⚡ Priority Levels

```text
high
medium
low
```

---

# 📚 Swagger API Documentation

This project includes Swagger UI for API testing and documentation.

## 🔗 Access Swagger UI

After starting the backend server:

```
http://localhost:5000/api-docs
```

---

## 📌 Swagger Setup (Backend)

Installed packages:

```bash
npm install swagger-ui-express swagger-jsdoc
```

---

## Example Swagger Configuration

```js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "API documentation for TaskFlow application",
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
```

---

## Example Route Annotation

```js
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns list of all tasks
 *     responses:
 *       200:
 *         description: Success
 */
```

---

# 📈 Future Improvements

* Due date & reminders
* Drag & drop Kanban board
* Email notifications
* File attachments
* Search & filtering
* Activity logs

---

# 👨‍💻 Author

Abdul Rahman

---

# 📜 License

This project is licensed under the MIT License.

```

---

If you want next upgrade, I can also:
- 🔥 :contentReference[oaicite:0]{index=0}
- 🔥 :contentReference[oaicite:1]{index=1}
- 🔥 :contentReference[oaicite:2]{index=2}

Just tell me 👍
```
