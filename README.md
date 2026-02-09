# Amar Recipe - Complete Recipe Management System

A full-stack recipe management system built with React and PHP, featuring recipe browsing, submissions, ratings, reporting, and a complete admin panel.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com)

## 🌟 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Bytehost URL]

## 📖 Overview

Amar Recipe is a comprehensive recipe management platform that allows users to browse, submit, and rate recipes while providing administrators with powerful tools to manage content, users, and community interactions.

### Key Features

- 🍳 **Recipe Browsing** - Search and filter recipes by category
- ✍️ **Recipe Submission** - Submit new recipes for admin approval
- ⭐ **Rating System** - Rate and review recipes
- 🚩 **Reporting** - Report inappropriate content
- 👥 **Admin Panel** - Complete admin dashboard for content management
- 💬 **Admin Chat** - Inter-admin communication system
- 🌙 **Dark Mode** - Eye-friendly dark mode support
- 📱 **Responsive Design** - Mobile-first responsive interface

## 🏗️ Project Structure

```
Amar_Recipies_Live/
├── Amar_Recipe/                  # Main application directory
│   ├── src/
│   │   ├── Admin/                # Admin panel components
│   │   ├── Components/           # Reusable UI components
│   │   ├── Pages/                # Page components
│   │   ├── api/                  # Backend PHP API
│   │   │   ├── *.php            # API endpoints
│   │   │   ├── config.php       # Database configuration
│   │   │   ├── uploads/         # Recipe images
│   │   │   └── admin_dp_uploads/ # Admin profile pictures
│   │   ├── config/               # Frontend configuration
│   │   └── App.jsx               # Main app component
│   ├── admin_api/                # Admin-specific endpoints
│   ├── database/                 # Database schema
│   │   └── schema.sql           # MySQL schema
│   ├── public/                   # Static assets
│   ├── .htaccess                 # Apache configuration
│   ├── .env.example              # Environment template
│   └── package.json              # Node dependencies
├── DEPLOYMENT_BYTEHOST.md        # Backend deployment guide
├── DEPLOYMENT_VERCEL.md          # Frontend deployment guide
├── DATABASE_SETUP.md             # Database setup guide
├── DEPLOYMENT_QUICK_REFERENCE.md # Quick deployment checklist
└── README.md                     # This file
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: React Icons
- **Deployment**: Vercel

### Backend
- **Language**: PHP 8.2+
- **Database**: MySQL (Railway)
- **Hosting**: Railway (Docker)
- **API**: RESTful JSON API
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PHP** 8.0+
- **MySQL** 5.7+ or MariaDB
- **Git**
- **Railway account** (for backend hosting)
- **Vercel account** (for frontend hosting)
- **GitHub account** (required for Railway + version control)
- **Payment method** (Railway is a paid service)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Amar_Recipe.git
cd Amar_Recipies_Live/Amar_Recipe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

#### For Local Development

Create `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/
VITE_ADMIN_API_BASE_URL=http://localhost/Amar_Recipies_Live/Amar_Recipe/admin_api/
```

#### For Production

Set in Vercel dashboard:
```bash
VITE_API_BASE_URL=https://your-project-production.up.railway.app/src/api/
VITE_ADMIN_API_BASE_URL=https://your-project-production.up.railway.app/admin_api/
```

### 4. Setup Local Database

1. Create MySQL database: `amar_recipe`
2. Import schema:
   ```bash
   mysql -u root -p amar_recipe < database/schema.sql
   ```
3. Update `src/api/config.php` with local credentials

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📦 Deployment

### Quick Start

1. **Deploy Backend to Railway** → See [DEPLOYMENT_RAILWAY.md](DEPLOYMENT_RAILWAY.md)
2. **Deploy Frontend to Vercel** → See [DEPLOYMENT_VERCEL.md](DEPLOYMENT_VERCEL.md)
3. **Setup Database** → See [DATABASE_SETUP.md](DATABASE_SETUP.md)

### Quick Reference

Key deployment resources:
- Step-by-step Railway deployment guide
- Environment variable configuration
- Database migration steps
- Troubleshooting common issues

## 🔐 Default Admin Account

After database setup, use these credentials for first login:

- **Email**: `admin@amarrecipe.com`
- **Password**: `admin123`

**⚠️ CRITICAL**: Change this password immediately after first login!

## 🧪 Testing

### Run Build Test
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📚 API Documentation

### Public Endpoints
- `GET /api/get_recipes.php` - Get all recipes
- `POST /api/submit_recipe.php` - Submit recipe for approval
- `POST /api/rate_recipe.php` - Rate a recipe
- `POST /api/report_recipe.php` - Report recipe

### Admin Endpoints
- `POST /admin_api/admin_login.php` - Admin login
- `GET /admin_api/admin_requests.php` - Get admin requests
- `POST /api/approve_submission.php` - Approve recipe
- `POST /api/delete_recipe.php` - Delete recipe

Full API documentation coming soon.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Verify `.htaccess` is uploaded to Bytehost
- Check CORS headers in `config.php`
- Clear browser cache

**Database Connection Fails**
- Verify credentials in `config.php`
- Check database exists
- Ensure user has proper permissions

**Build Fails**
- Check Node.js version (18+)
- Delete `node_modules` and reinstall
- Clear Vite cache

See [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md) for more solutions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Sharif Ahmed**
- GitHub: [@Sharif2023](https://github.com/Sharif2023)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vercel for seamless deployment
- Bytehost for reliable PHP hosting

## 📞 Support

For issues and questions:
- Check the [Railway deployment guide](DEPLOYMENT_RAILWAY.md)
- Open an issue on GitHub
- Review existing issues for solutions

---

**Built with ❤️ using React and PHP**

**Version**: 1.0.0  
**Last Updated**: December 2024
