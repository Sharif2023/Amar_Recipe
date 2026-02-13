# Amar Recipe - Recipe Management System

A full-stack recipe management system with a React frontend and a PHP backend, optimized for deployment on Render (backend + PostgreSQL) and Vercel (frontend).

## 🚀 Features

- **Browse & Search**: Explore recipes by category with a dynamic search engine.
- **Recipe Submission**: Users can submit recipes for administrative review.
- **Reporting System**: Robust reporting flow for inappropriate content.
- **Animated Loader**: Custom "Cooking" themed animation for a premium user experience.
- **Admin Dashboard**: Comprehensive panel for managing recipes, approvals, and reports.
- **PostgreSQL Ready**: Migrated from MySQL to PostgreSQL for better performance and reliability.
- **Responsive Design**: Fully compatible with desktop and mobile devices.

## 📋 Tech Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Vanilla CSS + Tailwind Utility Classes
- **Components**: Custom animated Loader, Modals for ratings and reporting.
- **Deployment**: Vercel

### Backend
- **Language**: PHP 8.2+ (PDO for database abstraction)
- **Database**: PostgreSQL (Managed on Render)
- **Features**: Resilient sorting, Transaction-safe audit logs, JSON-based error reporting.
- **Deployment**: Render (Native PHP environment or Docker)

## 🛠️ Local Development

### Prerequisites
- PHP 8.1+
- PostgreSQL or MySQL
- Node.js 18+

### Setup
1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd Amar_Recipe
   npm install
   ```

2. **Database Config**:
   - Production uses PostgreSQL. For local development, update `src/api/config.php` with your credentials.
   - Use `src/api/migrate_v2.php` to synchronize schema and reset ID sequences on Render.

3. **Running**:
   ```bash
   npm run dev
   ```

## 📦 Deployment Guides

### Backend (Render)
1. Link your GitHub repository to a Web Service on Render.
2. Set up a PostgreSQL instance.
3. Configure Environment Variables (DB connection string).
4. **Crucial**: After deployment, run [your-render-url]/src/api/migrate_v2.php to initialize the PostgreSQL schema and sequences.

### Frontend (Vercel)
1. Add your project to Vercel.
2. Set `VITE_API_BASE_URL` to your Render backend URL.
3. Deploys automatically on push.

## 📁 Key Directories

- `src/api`: PHP backend endpoints and core logic.
- `src/Components`: Shared React components (including the new `Loader`).
- `src/Admin`: Administrative panel views and logic.
- `database`: SQL schema files for both MySQL and PostgreSQL.

## ⚖️ License
This project is private and for educational/personal use.

---

**Last Updated**: February 2026
**Version**: 1.1.0 (PostgreSQL & Custom Loader Update)


