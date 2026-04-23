# Task Manager App

A full-stack **MERN Stack Task Management System** with secure authentication, password reset via email, and full CRUD functionality. Built to demonstrate real-world backend + frontend integration and scalable project structure.

---

##  Live Demo
https://task-manager-weg3.vercel.app/

---

## Features

- User Signup & Login (JWT Authentication)
- Forgot Password & Reset Password via Email (Nodemailer)
- Create, Read, Update, Delete (CRUD) Tasks
- User-specific task management
- Protected routes & secure backend APIs
- RESTful API architecture
- Responsive frontend UI
- Deployment ready (Vercel / Render )

---

## Tech Stack

### Frontend
- React.js
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer
- dotenv

---

## Project Structure

```text
Task-Manager/
│
├── client/              # Frontend (React)
│   ├── src/
│   └── public/
│
├── server/              # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── .env
├── package.json
└── README.md

```



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Khushitiwari/Task-Manager.git
cd Task-Manager
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create .env file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLIENT_URL=http://localhost:5173

```

Run backend:
```bash
npm start
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Password Reset Flow

- User enters registered email  
- System sends reset link via email  
- User clicks the reset link  
- Password is securely updated in the database  

---

### API Endpoints

### Auth Routes

- `POST /api/auth/signup` → Register user  
- `POST /api/auth/login` → Login user  
- `POST /api/auth/forgot-password` → Send reset email  
- `POST /api/auth/reset-password/:token` → Reset password  

---

### Task Routes

- `GET /api/tasks` → Get all tasks  
- `POST /api/tasks` → Create task  
- `PUT /api/tasks/:id` → Update task  
- `DELETE /api/tasks/:id` → Delete task  

---

##  Deployment

### Frontend (Vercel)

```bash
vercel deploy
```

### Backend (Render / Railway)

- Add environment variables in the dashboard  
- Set the start command:

```bash
npm start
```
## Author

**Khooshi Tiwari**  


