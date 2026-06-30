# 🛡️ PhishGuard AI

<div align="center">

![PhishGuard AI](https://img.shields.io/badge/PhishGuard-AI%20Security%20Platform-2563EB?style=for-the-badge&logo=shield&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-Powered Phishing Detection & Cybersecurity Analysis Platform**

[🚀 Live Demo](#) · [📖 Documentation](#installation--setup) · [🐛 Report Bug](https://github.com/drashti8175/PhishGuard-AI/issues) · [✨ Request Feature](https://github.com/drashti8175/PhishGuard-AI/issues)

</div>

---

## 📌 Overview

**PhishGuard AI** is an enterprise-grade cybersecurity platform that uses **Machine Learning** and **Artificial Intelligence** to detect phishing threats in real time. It analyzes suspicious URLs, malicious emails, dangerous files and QR codes — providing instant risk scores, AI explanations, and actionable security recommendations.

> Built as a final year engineering project at **Charotar University of Science & Technology (CHARUSAT)**.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔗 **URL Scanner** | AI analysis of domains, SSL, redirects, blacklists & 40+ features |
| 📧 **Email Detector** | NLP-powered scanning for phishing keywords, urgency tactics & malicious links |
| 📁 **File Scanner** | Static analysis of PDF, DOCX, EXE & ZIP for embedded malware |
| 📷 **QR Code Scanner** | Decode and analyze QR codes for hidden phishing URLs |
| 📊 **SOC Dashboard** | Real-time metrics, charts, threat trends & AI security insights |
| 🌐 **Threat Intelligence** | Global attack map, live threat feed & AI threat predictions |
| 🤖 **AI Chat Assistant** | Ask security questions and get instant expert-level AI answers |
| 🏆 **Security Score** | Personal cybersecurity health rating with improvement checklist |
| 📄 **Reports** | Generate & export daily/weekly/monthly security reports (PDF, CSV, Excel) |
| 👤 **User Profile** | Account management, 2FA, login activity & session control |
| ⚙️ **Admin Panel** | User management, threat management, audit logs & system monitoring |

---

## 🧠 Machine Learning Architecture

```
User Input (URL / Email / File)
        ↓
  Data Preprocessing
        ↓
  Feature Extraction (40+ features)
        ↓
  ┌─────────────────────────────┐
  │  Random Forest Classifier   │
  │  + XGBoost Ensemble Model   │
  └─────────────────────────────┘
        ↓
  Threat Classification
  (Phishing / Safe / Suspicious)
        ↓
  Risk Score (0–100) + AI Explanation
        ↓
  Security Recommendation
```

### Model Performance

| Metric    | Score  |
|-----------|--------|
| Accuracy  | 98.4%  |
| Precision | 97.2%  |
| Recall    | 96.8%  |
| F1 Score  | 97.0%  |

> Trained on **50,000+** labeled phishing and safe URL samples.

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** — Component-based UI
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **Chart.js** — Interactive security charts
- **Lucide React** — Professional icon system
- **Axios** — HTTP client for API calls
- **React Router v6** — Client-side routing

### Backend
- **Python 3.10+** — Core language
- **FastAPI** — High-performance REST API
- **Motor** — Async MongoDB driver
- **PyJWT** — JWT authentication
- **Bcrypt** — Password hashing
- **Passlib** — Password security utilities
- **Uvicorn** — ASGI server

### Machine Learning
- **Scikit-Learn** — ML model training & evaluation
- **XGBoost** — Gradient boosting classifier
- **Pandas** — Data manipulation
- **NumPy** — Numerical computing
- **Joblib** — Model serialization

### Database & Infrastructure
- **MongoDB Atlas** — Cloud NoSQL database
- **JWT Tokens** — Stateless authentication
- **CORS Middleware** — Cross-origin security

---

## 📂 Project Structure

```
PhishGuard-AI/
│
├── 📁 frontend/                   # React.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── RiskMeter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── 📁 pages/              # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── URLScanner.jsx
│   │   │   ├── EmailScanner.jsx
│   │   │   ├── FileScanner.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   ├── ThreatIntel.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── SecurityScore.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── 📁 context/            # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── 📁 utils/
│   │   │   └── api.js             # Axios API configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Global design system
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── 📁 backend/                    # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 ml/
│   │   │   ├── predictor.py       # ML inference engine
│   │   │   └── train.py           # Model training script
│   │   ├── 📁 models/
│   │   │   ├── user.py            # User Pydantic models
│   │   │   └── scan.py            # Scan Pydantic models
│   │   ├── 📁 routes/
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── scan.py            # Scan endpoints
│   │   │   ├── dashboard.py       # Dashboard endpoints
│   │   │   ├── report.py          # Report endpoints
│   │   │   └── admin.py           # Admin endpoints
│   │   ├── 📁 services/
│   │   │   ├── auth.py            # JWT & password services
│   │   │   ├── email_analyzer.py  # Email NLP analysis
│   │   │   ├── file_scanner.py    # File static analysis
│   │   │   ├── url_extractor.py   # URL feature extraction
│   │   │   ├── pdf_generator.py   # PDF report generation
│   │   │   └── qr_scanner.py      # QR code decoder
│   │   ├── main.py                # FastAPI application
│   │   ├── database.py            # MongoDB connection
│   │   ├── config.py              # Environment settings
│   │   └── ml_engine.py           # ML feature pipeline
│   └── requirements.txt
│
├── README.md
├── .gitignore
├── LICENSE
└── requirements.txt
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python **3.10+**
- Node.js **18+**
- MongoDB Atlas account (free tier works)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/drashti8175/PhishGuard-AI.git
cd PhishGuard-AI
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/phishguard?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
PORT=8000
HOST=0.0.0.0
```

Start the backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at → **http://localhost:8000**
API Docs → **http://localhost:8000/docs**

---

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

### 4. Quick Start (Both servers)

```bash
# Terminal 1 — Backend
cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `GET`  | `/api/auth/me` | Get current user info |

### Scanners
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan/url` | Scan a URL for phishing |
| `POST` | `/api/scan/email` | Analyze email content |
| `POST` | `/api/scan/file` | Scan uploaded file |
| `POST` | `/api/scan/qr` | Decode & analyze QR code |

### Dashboard & Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/dashboard/stats` | Get dashboard statistics |
| `GET`  | `/api/history` | Get scan history |
| `GET`  | `/api/threat-intel` | Get threat intelligence feed |
| `GET`  | `/api/report/download/{id}` | Download PDF report |

---

## 📸 Screenshots

### 🏠 Home Page
> AI-powered landing page with 3D shield animation, animated counters and feature showcase

### 📊 Security Dashboard
> Real-time SOC dashboard with threat trend charts, metric cards and recent activity

### 🔗 URL Scanner
> AI URL analysis with risk meter, detection indicators and technical domain intelligence

### 🌐 Threat Intelligence
> Global attack map with live threat feed and AI threat predictions

### 🤖 AI Chat Assistant
> Real-time cybersecurity chat assistant with quick-prompt templates

---

## 🔒 Security Features

- ✅ **JWT Authentication** — Stateless token-based auth with expiry
- ✅ **Password Hashing** — Bcrypt with salt rounds
- ✅ **Protected Routes** — Frontend route guards for authenticated pages
- ✅ **CORS Middleware** — Configured for secure cross-origin requests
- ✅ **Input Validation** — Pydantic models for all API inputs
- ✅ **2FA Ready** — Two-factor authentication UI toggle
- ✅ **Zero Data Retention** — Scans processed without permanent PII storage

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

<div align="center">

**Drashti Patel**

*B.Tech Computer Engineering · CHARUSAT University · 2026*

[![GitHub](https://img.shields.io/badge/GitHub-drashti8175-181717?style=for-the-badge&logo=github)](https://github.com/drashti8175)

</div>

---

## ⭐ Show Your Support

If you found this project useful, please consider giving it a **⭐ star** on GitHub — it helps others discover the project!

---

<div align="center">

**Built with ❤️ for cybersecurity · PhishGuard AI © 2026**

</div>
