# Amar Recipes - Recipe Management System

A full-stack recipe management system with React frontend and PHP backend, designed for deployment on Vercel (frontend) and InfinityFree (backend).

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
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: React Icons
- **Deployment**: Vercel

### Backend
- **Language**: PHP 8+
- **Database**: MySQL (MariaDB)
- **Hosting**: InfinityFree
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
   - Create a MySQL database named `Amar_Recipe`
   - Import `database/schema.sql`

4. **Configure backend (for local development)**
   - Copy `src/api/config.php` and update with local credentials
   - Set database host to `localhost`

5. **Configure frontend**
   - Copy `.env.example` to `.env.local`
   - Update API URLs to your local PHP server

6. **Run development server**
   ```bash
   npm run dev
   ```

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

### Quick Deploy

**Backend (InfinityFree)**:
1. Upload `src/api/` and `admin_api/` via FTP
2. Import `database/schema.sql` in phpMyAdmin
3. Create upload directories with proper permissions

**Frontend (Vercel)**:
```bash
npm run build
vercel --prod
```

Set environment variables in Vercel:
```
VITE_API_BASE_URL=https://uiu-healthcare.infinityfreeapp.com/src/api/
VITE_ADMIN_API_BASE_URL=https://uiu-healthcare.infinityfreeapp.com/admin_api/
```

## 📁 Project Structure

```
Amar_Recipe/
├── src/
│   ├── Admin/              # Admin panel components
│   ├── Components/         # Reusable UI components
│   ├── Pages/              # Page components
│   ├── api/                # PHP backend API
│   ├── config/             # Frontend configuration
│   └── App.jsx             # Main app component
├── admin_api/              # Admin-specific PHP endpoints
├── database/               # Database schema and migrations
├── public/                 # Static assets
├── .htaccess               # Apache configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Node dependencies
```

## 🔐 Environment Variables

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-domain.com/src/api/
VITE_ADMIN_API_BASE_URL=https://your-domain.com/admin_api/
```

### Backend (config.php)
- Database credentials
- API base URLs
- CORS settings

## 📞 Support

For issues and questions:
- Check [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- Review [DEPLOYMENT_QUICK_REF.md](../DEPLOYMENT_QUICK_REF.md)

---

**Last Updated**: December 2024  
**Version**: 1.0.0
