# Amar Recipe - Recipe Management System

A full-stack recipe management system with React frontend and PHP backend, designed for deployment on Vercel (frontend) and Railway (backend).

## 🚀 Features

- Browse and search recipes by category
- Submit new recipes for admin approval
- Rate and review recipes
- Report inappropriate content
- Admin panel for managing recipes and users
- Admin chat system
- Responsive design with dark mode support

## 📋 Tech Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: React Icons
- **Deployment**: Vercel

### Backend
- **Language**: PHP 8.2+
- **Database**: MySQL (Railway)
- **Hosting**: Railway (Docker)
- **Features**: RESTful API, CORS enabled

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- PHP 8.0+
- MySQL 5.7+ or MariaDB
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Amar_Recipies_Live/Amar_Recipe
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup local database**
   - Create a MySQL database named `amar_recipe`
   - Import `database/schema.sql`

4. **Configure backend (for local development)**
   - Copy `src/api/config.example.php` to `src/api/config.php`
   - Update with local credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root');
     define('DB_PASS', '');
     define('DB_NAME', 'amar_recipe');
     ```

5. **Configure frontend**
   - Copy `.env.local.example` to `.env.local`
   - Update API URLs to your local PHP server:
     ```
     VITE_API_BASE_URL=http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/
     VITE_ADMIN_API_BASE_URL=http://localhost/Amar_Recipies_Live/Amar_Recipe/admin_api/
     ```

6. **Run development server**
   ```bash
   npm run dev
   ```

## 📦 Deployment

### Comprehensive Deployment Guides

- **[Backend Deployment](../DEPLOYMENT_RAILWAY.md)** - Deploy PHP backend to Railway
- **[Frontend Deployment](../DEPLOYMENT_VERCEL.md)** - Deploy React app to Vercel
- **[Database Setup](../DATABASE_SETUP.md)** - Complete database configuration guide

### Quick Deploy Overview

**Backend (Railway)**:
1. Push code to GitHub
2. Create Railway project from GitHub repo
3. Add MySQL database service
4. Import `database/schema.sql`
5. Set environment variables
6. Railway auto-deploys via Dockerfile

**Frontend (Vercel)**:
```bash
# Build the project
npm run build

# Deploy via Vercel CLI
vercel --prod
```

Set environment variables in Vercel dashboard:
```
VITE_API_BASE_URL=https://your-project-production.up.railway.app/src/api/
VITE_ADMIN_API_BASE_URL=https://your-project-production.up.railway.app/admin_api/
```

## 📁 Project Structure

```
Amar_Recipe/
├── src/
│   ├── Admin/              # Admin panel components
│   ├── Components/         # Reusable UI components
│   ├── Pages/              # Page components
│   ├── api/                # PHP backend API
│   │   ├── *.php          # API endpoints
│   │   ├── config.php     # Database config
│   │   ├── uploads/       # Recipe images
│   │   └── admin_dp_uploads/ # Admin profiles
│   ├── config/             # Frontend configuration
│   └── App.jsx             # Main app component
├── admin_api/              # Admin-specific endpoints
├── database/               # Database schema
│   └── schema.sql         # MySQL schema
├── public/                 # Static assets
├── .htaccess               # Apache configuration
├── .env.example            # Environment template
├── package.json            # Node dependencies
└── vite.config.js          # Vite configuration
```

## 🔐 Environment Variables

### Frontend (.env.local / .env.production)
```env
VITE_API_BASE_URL=https://your-backend-domain.com/src/api/
VITE_ADMIN_API_BASE_URL=https://your-backend-domain.com/admin_api/
```

### Backend (config.php)
- Database credentials (DB_HOST, DB_USER, DB_PASS, DB_NAME)
- API base URLs (BASE_URL, API_BASE_URL)
- CORS settings

## 🧪 Build & Test

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📞 Support

For deployment help and troubleshooting:
- [Railway Backend Deployment](../DEPLOYMENT_RAILWAY.md)
- [Vercel Frontend Deployment](../DEPLOYMENT_VERCEL.md)
- [Database Setup Guide](../DATABASE_SETUP.md)

## 🔒 Security Notes

- Never commit `.env.local` or `.env.production` with credentials
- Change default admin password after first login
- Keep `config.php` out of version control
- Use environment variables for all sensitive data

---

**Last Updated**: December 2024  
**Version**: 1.0.0

