# Alebie Ayalew — Developer Portfolio

A modern, responsive personal portfolio website showcasing full-stack software development projects, networking labs, academic achievements, and technical skills.

🌐 **Live Demo:** [https://ayalewalebie-crypto.github.io/portfolio/](https://ayalewalebie-crypto.github.io/portfolio/)

---

## 🚀 Features

- **Dynamic Hero & Profile:** Real-time typewriter effects, glassmorphic UI, and modern aesthetic.
- **Project Showcase:** Highlights full-stack applications, mobile apps, and system projects with live demo and GitHub links.
- **Interactive Skills Matrix:** Categorized technical skill tags with icons and progress indicators.
- **Networking Labs:** Detailed network configurations, topology summaries, and interface address tables.
- **Achievements & Certifications:** Verified credentials and recognitions.
- **CV Viewer:** Built-in PDF reader with download and print capabilities.
- **Contact & Social Connect:** Direct contact channel with social media integrations.
- **Admin Dashboard:** Full-featured management panel for updating profile info, projects, skills, and viewing incoming messages.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 4 + Lucide Icons + React Icons
- **Routing:** React Router 7
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Security:** Helmet, CORS, JWT authentication, bcryptjs, express-rate-limit
- **File Storage:** Multer

---

## 📦 Project Structure

```text
├── frontend/             # React + Vite frontend application
│   ├── public/           # Static assets, icons, 404 handler
│   ├── src/
│   │   ├── assets/       # Media & project screenshots
│   │   ├── components/   # UI components (Admin & Public)
│   │   ├── context/      # AuthContext
│   │   ├── layouts/      # PublicLayout & AdminLayout
│   │   ├── pages/        # Public & Admin views
│   │   └── services/     # Axios API service
├── backend/              # Express API & MongoDB backend
│   ├── config/           # Database connection
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & validation middleware
│   ├── models/           # Mongoose data models
│   ├── routes/           # API routes (auth, admin, public)
│   └── server.js         # Entry point
└── .github/workflows/    # CI/CD deployment to GitHub Pages
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
# Configure your .env file
npm run dev
```

---

## 👤 Author

**Alebie Ayalew**
- GitHub: [@ayalewalebie-crypto](https://github.com/ayalewalebie-crypto)
- Email: ayalewalebie@gmail.com
