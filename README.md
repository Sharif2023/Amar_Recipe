# 🍳 Amar Recipe - Premium Recipe Management Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://react.dev/)
[![PHP](https://img.shields.io/badge/Backend-PHP%208.2-777BB4?logo=php)](https://www.php.net/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%204.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Amar Recipe** is a sophisticated, full-stack recipe management platform designed for culinary enthusiasts and community builders. It combines a sleek, modern user experience with powerful administrative tools, providing a seamless bridge between recipe discovery and community management.

---

## ✨ Core Features

### 🥗 For Enthusiasts (User-Facing)
- 🔍 **Advanced Recipe Discovery**: Instant search and categorical filtering for effortless navigation.
- 📤 **Community Contributions**: Integrated recipe submission pipeline for users to share their culinary creations.
- ⭐ **Global Rating System**: Interactive 5-star rating mechanism to build community trust and highlight top recipes.
- 📱 **Mobile-First Experience**: Fully responsive design using Tailwind CSS 4 for a premium look on any device.
- 🌙 **Adaptive Theming**: Intelligent dark mode support for comfortable late-night browsing.

### 🛡️ For Administrators (Admin Panel)
- 📊 **Centralized Dashboard**: Comprehensive overview of community activity and recipe health.
- ✅ **Moderation Pipeline**: Robust approval system for user-submitted recipes ensuring quality control.
- 💬 **Inter-Admin Communication**: Built-in chat system for seamless collaboration between moderators.
- 🚩 **Content Safety**: Integrated reporting tools to identify and manage inappropriate content.
- 🔐 **Enhanced Security**: Secure authentication and granular profile management for administrative accounts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | PHP 8.2+, RESTful JSON API, CORS-enabled |
| **Database** | MySQL (Railway Hosting), PostgreSQL (Render-compatible) |
| **Infrastructure** | Docker, Railway (Backend), Vercel (Frontend) |

---

## 🏗️ Project Architecture

```bash
Amar_Recipies_Live/
├── Amar_Recipe/                  # Core Application Root
│   ├── src/                      # Frontend Source
│   │   ├── Admin/                # Modular Admin Components
│   │   ├── Components/           # Reusable UI Architecture
│   │   ├── Pages/                # Top-level Page Layouts
│   │   ├── api/                  # Core PHP Logic & Public API
│   │   │   ├── config.php        # System Configuration
│   │   │   └── uploads/          # Dynamic Media Storage
│   │   └── App.jsx               # Application Entry Point
│   ├── admin_api/                # Private Administrative API
│   ├── database/                 # Schema & Migration Scripts
│   └── public/                   # Static Asset Manifest
├── DEPLOYMENT.md                 # Universal Deployment Guide
└── README.md                     # Documentation Hub
```

---

## 🚀 Quick Start Guide

### 1. Environment Preparation
- **Node.js**: v18.0 or higher
- **PHP**: v8.2+ with MySQL extensions
- **Database**: MySQL 5.7+

### 2. Local Installation
```bash
# Clone the repository
git clone https://github.com/Sharif2023/Amar_Recipe.git
cd Amar_Recipies_Live/Amar_Recipe

# Install frontend dependencies
npm install

# Initialize environment
cp .env.example .env.local
```

### 3. Database Synchronization
1. Create a MySQL database named `amar_recipe`.
2. Import the initial state: `mysql -u root -p amar_recipe < database/schema.sql`.
3. Configure `src/api/config.php` with your local credentials.

### 4. Launch Development
```bash
npm run dev
```

---

## 🔗 API Reference (V1)

### 🥑 Public Endpoints
| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| Browse | `GET` | `/api/get_recipes.php` | Retrieves all validated recipes. |
| Contribute | `POST` | `/api/submit_recipe.php` | Queues a new recipe for review. |

### 🔑 Admin Endpoints
| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| Authenticate | `POST` | `/admin_api/admin_login.php` | Generates admin session. |
| Moderate | `POST` | `/api/approve_submission.php` | Validates user content. |

---

## 🗺️ Development Roadmap
- [ ] **Q1 2026**: Multi-language support (i18n).
- [ ] **Q2 2026**: Video tutorial integration for recipes.
- [ ] **Q3 2026**: Personalized recipe recommendations using ML.
- [ ] **Q4 2026**: Dedicated iOS and Android companion applications.

---

## 🤝 Contributing & Support
We welcome contributions! Please refer to our contributing guidelines before opening a Pull Request.

**Author**: [Sharif Ahmed](https://github.com/Sharif2023)  
**Support**: For technical support, please open a GitHub Issue or refer to [DEPLOYMENT.md](DEPLOYMENT.md).

---
*Built with ❤️ for the Culinary Community*
