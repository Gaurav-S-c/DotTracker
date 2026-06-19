# 🚀 DotTracker

A modern AI-powered Job Application Tracker that helps job seekers organize applications, track progress, manage resumes, and optimize resumes for specific job descriptions using AI.

🔗 **Live Demo:** [Add Your Website URL Here](https://dot-tracker-gamma.vercel.app/)

---

## 📌 Features

### 📋 Application Management
- Create, edit, and delete job applications
- Track applications through multiple stages:
  - Wishlist
  - Applied
  - Interview
  - Offers
  - Rejected
- Drag-and-drop Kanban board for easy status management

### 📊 Dashboard Analytics
- Total Applications
- Interviews Scheduled
- Offers Received
- Rejections
- Visual overview of job search progress

### 🤖 AI Resume Tailor
- Paste a Job Description
- Upload your Resume (PDF)
- AI analyzes resume-job fit
- Match score calculation
- Missing keyword detection
- Skills to highlight
- Resume improvement suggestions
- Bullet point optimization recommendations

### 👤 User Profile
- Authentication with Supabase
- Update profile information
- Change password
- Forgot password functionality
- Secure account management

### 📄 Resume Management
- PDF upload support
- Resume parsing
- Secure storage using Supabase Storage
- AI-ready resume text extraction

### 🔒 Authentication
- Sign Up
- Sign In
- Forgot Password
- Protected Routes
- JWT-based authorization

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js

### Database & Storage
- Supabase Database
- Supabase Authentication
- Supabase Storage

### AI Integration
- Groq API
- Llama 3.3 70B Versatile

### File Handling
- Multer
- PDF-Parse

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🏗️ Project Structure

```bash
DotTracker/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── src/
│
├── public/
├── src/
│   ├── components/
│   ├── Pages/
│   ├── assets/
│   └── utils/
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 Future Improvements

- Resume version management
- Cover letter generation
- Email reminders
- Job description URL scraping
- Interview preparation assistant
- AI career coach
- Resume ATS score visualization
- Export reports and analytics

---

## 👨‍💻 Author

**Gaurav Sinha**

- GitHub: https://github.com/Gaurav-S-c
- LinkedIn: https://www.linkedin.com/in/gaurav-sinha-dev/

---

## 📄 License

This project is licensed under the MIT License.
