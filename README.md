# GitHub Clone

A full-stack GitHub-inspired platform built with the MERN Stack that enables users to create and manage repositories, authenticate securely, track issues, and simulate Git operations through a custom CLI. The project also integrates AWS S3 for remote repository storage and Socket.IO for real-time communication.

---

## 🚀 Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Password Hashing with bcrypt

### Repository Management
- Create Repository
- Update Repository
- Delete Repository
- Public & Private Repositories
- Repository Descriptions
- View User Repositories

### Issue Tracking
- Create Issues
- Update Issues
- Delete Issues
- Open & Closed Issue Status

### Custom Git CLI
- Initialize Repository
- Add Files
- Commit Changes
- Push Commits to AWS S3
- Pull Commits from AWS S3
- Revert to Previous Commits

### Real-Time Features
- Socket.IO Integration
- Live User Room Connections

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- CSS
- React Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- AWS SDK (S3)

### Cloud
- AWS S3

---

## 📂 Project Structure

```
GitHub-Clone/
│
├── backend-main/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── frontend-main/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-clone.git
cd github-clone
```

### 2. Backend Setup

```bash
cd backend-main
npm install
```

Create a `.env` file inside **backend-main**.

```env
PORT=3002

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key

AWS_REGION=ap-south-1

AWS_ACCESS_KEY_ID=your_access_key

AWS_SECRET_ACCESS_KEY=your_secret_key

S3_BUCKET=your_bucket_name
```

Start the backend:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend-main
npm install
npm run dev
```

---

## 📌 Available CLI Commands

Initialize Repository

```bash
node index.js init
```

Add File

```bash
node index.js add <filename>
```

Commit Changes

```bash
node index.js commit "Commit Message"
```

Push Repository

```bash
node index.js push
```

Pull Repository

```bash
node index.js pull
```

Revert Commit

```bash
node index.js revert <commit-id>
```

Start Backend Server

```bash
node index.js start
```

---

## 📸 Screenshots

### Login

> Add screenshot here

---

### Dashboard

> Add screenshot here

---

### User Profile

> Add screenshot here

---

### Repository

> Add screenshot here

---

### Issues

> Add screenshot here

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend Server Port |
| MONGODB_URI | MongoDB Connection String |
| JWT_SECRET_KEY | Secret Key for JWT |
| AWS_REGION | AWS Region |
| AWS_ACCESS_KEY_ID | AWS Access Key |
| AWS_SECRET_ACCESS_KEY | AWS Secret Access Key |
| S3_BUCKET | AWS S3 Bucket Name |

---

## Future Improvements

- Repository Stars
- Fork Repositories
- Pull Requests
- Code Diff Viewer
- Commit History UI
- Repository Search
- Notifications
- User Following System
- Repository Collaborators
- Branch Management

This project is developed for learning purposes and is open for educational use.
