# 🚀 Complete Deployment Guide - Amar Recipes Project

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Backend Deployment (InfinityFree)](#backend-deployment-infinityfree)
6. [Database Setup (MySQL)](#database-setup-mysql)
7. [Environment Configuration](#environment-configuration)
8. [Verification Checklist](#verification-checklist)
9. [Troubleshooting](#troubleshooting)
10. [Post-Deployment Maintenance](#post-deployment-maintenance)

---

## Project Overview

**Amar Recipes** is a full-stack recipe sharing and management platform with:
- **Frontend**: React 19 + Vite (Static assets deployed on Vercel)
- **Backend**: PHP with MySQLi (Hosted on InfinityFree)
- **Database**: MySQL (InfinityFree hosted)
- **Admin Panel**: Integrated admin dashboard for recipe management
- **Features**: Recipe submission, approval workflow, ratings, reporting, admin messaging

### Key Statistics
- 26+ PHP API endpoints
- 13+ React components
- Fully functional admin dashboard
- Bengali language support (utf8mb4 charset)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           ↓
        ┌──────────────────────────────────────┐
        │    Vercel (Frontend Static Files)    │
        │  amar-recipe.vercel.app              │
        │  - React App (index.html + JS/CSS)   │
        │  - Served as SPA (Single Page App)   │
        └──────────────┬───────────────────────┘
                       │
                       │ API Calls to
                       │ https://amar-recipes.infinityfreeapp.com/api
                       ↓
        ┌──────────────────────────────────────┐
        │   InfinityFree (Backend + MySQL)     │
        │  amar-recipes.infinityfreeapp.com    │
        │  - PHP API Endpoints (/api/*.php)    │
        │  - MySQL Database (if0_39569251_...) │
        └──────────────┬───────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────────┐
        │    MySQL Database Server             │
        │    sql102.infinityfree.com           │
        │    - if0_39569251_amar_recipe        │
        └──────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts (Already Setup)
- ✅ **GitHub Account**: Sharif2023/Amar_Recipe repository
- ✅ **Vercel Account**: For frontend deployment
- ✅ **InfinityFree Account**: For PHP backend and MySQL database
- ✅ **Domain**: amar-recipes.infinityfreeapp.com (InfinityFree free domain)

### Required Software (For Local Development)
- Node.js 18+ (for npm/Vite)
- PHP 7.4+ (for local API testing)
- MySQL 5.7+ (for local development, optional)
- Git (for version control)
- Code editor (VS Code recommended)

### Optional Tools
- Postman or Insomnia (for API testing)
- MySQL Workbench (for database management)
- FileZilla (for FTP access if needed)

---

## Frontend Deployment (Vercel)

### Step 1: Ensure Code is Committed to GitHub

```bash
# Navigate to project directory
cd c:\xampp\htdocs\Amar_Recipies_Live

# Check status
git status

# Stage changes (if any)
git add .

# Commit changes
git commit -m "Deploy to production - [your message]"

# Push to GitHub main branch
git push origin main
```

### Step 2: Vercel Configuration

Your project already has `vercel.json` configured. Here's what it does:

**File**: `Amar_Recipe/vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",        // Run Vite build
  "outputDirectory": "dist",              // Output folder
  "env": {
    "VITE_API_URL": "https://amar-recipes.infinityfreeapp.com/api"
  },
  "routes": [
    {
      "src": "^/(?!api).*",              // Catch all except /api
      "dest": "/index.html"              // Serve React index
    }
  ]
}
```

### Step 3: Set Environment Variables in Vercel Dashboard

✅ **No manual action needed!** The environment variable is now configured directly in `vercel.json`.

The API URL is hardcoded in the build configuration:
- `VITE_API_URL`: `https://amar-recipes.infinityfreeapp.com/api`

This ensures the frontend always calls the correct backend API regardless of environment.

### Step 4: Deploy

**Automatic Deployment** (Recommended):
- Every push to `main` branch automatically triggers Vercel build
- Build logs available in Vercel dashboard
- Deployment URL: https://amar-recipe.vercel.app (or your custom domain)

**Manual Deployment**:
```bash
# Option 1: Push to GitHub (automatic Vercel deployment)
git push origin main

# Option 2: Use Vercel CLI (if installed)
npm install -g vercel
vercel --prod
```

### Step 5: Verify Frontend Deployment

- ✅ Visit https://amar-recipe.vercel.app
- ✅ Check if homepage loads
- ✅ Open browser console (F12) for any errors
- ✅ Check Network tab to verify API calls go to InfinityFree

---

## Backend Deployment (InfinityFree)

### Step 1: Access InfinityFree Panel

1. Log in to [InfinityFree Dashboard](https://www.infinityfree.net/)
2. Go to **Accounts** → **Manage Account**
3. Find your domain: `amar-recipes.infinityfreeapp.com`

### Step 2: Upload PHP Files via FTP

**Option A: Using FileZilla (Recommended for GUI)**

1. Download [FileZilla](https://filezilla-project.org/)
2. In Vercel, get FTP credentials from InfinityFree panel:
   - **Host**: ftp.amar-recipes.infinityfreeapp.com
   - **Username**: Your InfinityFree username
   - **Password**: Your InfinityFree password
   - **Port**: 21

3. Connect and navigate to `/htdocs/`
4. Upload the following folders:
   ```
   Amar_Recipe/src/api/      → /htdocs/api/
   Amar_Recipe/public/       → /htdocs/public/
   ```

**Option B: Using Vercel/Git Integration (Automatic)**

Since PHP files are in your GitHub repo:
1. InfinityFree can auto-pull from GitHub
2. Configure GitHub Actions or manually pull updates

**Option C: Using InfinityFree File Manager**

1. Go to InfinityFree → **File Manager**
2. Navigate to `/htdocs/`
3. Upload files directly through web interface

### Step 3: Verify PHP Files Location

After upload, your structure should be:
```
/home/if0_39569251/public_html/
├── api/
│   ├── config.php                    ✅
│   ├── admin_login.php               ✅
│   ├── get_recipes.php               ✅
│   ├── submit_recipe.php             ✅
│   ├── approve_submission.php        ✅
│   ├── (... 20+ more .php files)     ✅
│   └── uploads/                      ✅
└── public/
    └── (static files if needed)
```

### Step 4: Set PHP Configuration

1. InfinityFree → **Advanced** → **PHP Configuration**
2. Ensure settings:
   - PHP Version: 7.4+ (recommended 8.0+)
   - Short open tags: OFF
   - Display errors: OFF (for production)
   - Memory limit: 256M
   - Upload max size: 50M (for recipe images)

---

## Database Setup (MySQL)

### Step 1: Connect to InfinityFree MySQL

**Credentials** (Already configured in `src/api/config.php`):
```
Host: sql102.infinityfree.com
Username: if0_39569251
Password: Sharifcse2025
Database: if0_39569251_amar_recipe
Port: 3306
```

### Step 2: Access Database (3 Options)

**Option A: Using phpMyAdmin (Easiest)**
1. Go to InfinityFree → **MySQL** → **phpMyAdmin**
2. Login with above credentials
3. Select database `if0_39569251_amar_recipe`

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Create new connection:
   - Host: `sql102.infinityfree.com`
   - Port: `3306`
   - Username: `if0_39569251`
   - Password: `Sharifcse2025`
3. Test connection, then click Connect

**Option C: Using Command Line**
```bash
mysql -h sql102.infinityfree.com -u if0_39569251 -p
# Enter password: Sharifcse2025
# Then: USE if0_39569251_amar_recipe;
```

### Step 3: Create Database Tables

Run the SQL schema to create all tables:

```sql
-- Users/Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    ingredients LONGTEXT NOT NULL,
    instructions LONGTEXT NOT NULL,
    category VARCHAR(100),
    cook_time INT,
    serves INT,
    submitted_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES admins(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rating (recipe_id, user_email)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    details LONGTEXT,
    status ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Messages Table (for admin communication)
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    subject VARCHAR(255),
    message LONGTEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES admins(id),
    FOREIGN KEY (recipient_id) REFERENCES admins(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Activity History Table
CREATE TABLE IF NOT EXISTS activity_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    details LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Submission Requests Table
CREATE TABLE IF NOT EXISTS submission_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    notes LONGTEXT,
    FOREIGN KEY (reviewed_by) REFERENCES admins(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 4: Create Upload Directories

Create these directories for file uploads:

```bash
# Via FTP or File Manager
/home/if0_39569251/public_html/api/uploads/          # Recipe images
/home/if0_39569251/public_html/api/admin_dp_uploads/ # Admin profile pictures
```

Set permissions:
```bash
chmod 755 uploads/
chmod 755 admin_dp_uploads/
```

---

## Environment Configuration

### Frontend Environment Variables

**File**: `Amar_Recipe/.env.production`
```bash
VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api
```

**File**: `Amar_Recipe/.env.local` (Development)
```bash
VITE_API_URL=http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api
```

### Backend Configuration

**File**: `src/api/config.php`
- Automatically detects environment via `ENVIRONMENT` variable
- Uses InfinityFree credentials for production
- Falls back to localhost for development

**Variables in config.php**:
```php
// Production (ENVIRONMENT=production)
$db_host = 'sql102.infinityfree.com';
$db_username = 'if0_39569251';
$db_password = 'Sharifcse2025';
$db_name = 'if0_39569251_amar_recipe';

// Development (ENVIRONMENT=development)
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'amar_recipe';
```

### API Endpoints Configuration

**File**: `src/config/apiConfig.js`

Contains all API endpoints:
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  
  RECIPES: {
    GET_ALL: '/get_recipes.php',
    SUBMIT_REQUEST: '/submit_recipe_request.php',
    SUBMIT: '/submit_recipe.php',
    // ... 20+ endpoints
  }
}
```

---

## Verification Checklist

### Pre-Deployment Checklist

- [ ] All files committed to GitHub
- [ ] Vercel environment variables set (VITE_API_URL)
- [ ] InfinityFree account active with domain
- [ ] MySQL database accessible
- [ ] PHP files uploaded to InfinityFree
- [ ] Database tables created
- [ ] Upload directories created with proper permissions

### Post-Deployment Checklist

#### Frontend (Vercel)
- [ ] Homepage loads without errors
- [ ] Navigation works (all routes functional)
- [ ] Images load correctly
- [ ] Responsive design works on mobile
- [ ] Console has no errors (F12)

#### Backend (InfinityFree)
- [ ] PHP files accessible (test: visit /api/config.php)
- [ ] No white screen of death errors
- [ ] PHP errors logged to error.log

#### Database
- [ ] Can connect to MySQL from phpMyAdmin
- [ ] All tables exist and have data
- [ ] Charset is utf8mb4 (for Bengali)

#### API Integration
- [ ] API calls from frontend reach backend
- [ ] Recipes load on homepage
- [ ] Admin login works
- [ ] File uploads work
- [ ] No CORS errors in console

---

## Testing Endpoints

### Quick API Tests

**Test 1: Check Backend is Online**
```bash
curl https://amar-recipes.infinityfreeapp.com/api/config.php
# Should return error (404 or PHP warning) - that's OK, means server is up
```

**Test 2: Get All Recipes**
```bash
curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
# Should return JSON: { success: true, data: [...] }
```

**Test 3: Admin Login**
```bash
curl -X POST https://amar-recipes.infinityfreeapp.com/api/admin_login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Test 4: Browser Test**
```
1. Open https://amar-recipe.vercel.app
2. Open DevTools (F12) → Network tab
3. Click on recipes/admin sections
4. Check that API calls go to https://amar-recipes.infinityfreeapp.com/api/...
5. Verify responses have status 200 and valid JSON
```

---

## Troubleshooting

### Frontend Issues

**Problem**: "Build failed on Vercel"
```
Solution:
1. Check Vercel logs: https://vercel.com/dashboard/project → Deployments
2. Ensure package.json has "build" script
3. Run locally: npm install && npm run build
4. Fix any errors, commit, and push
```

**Problem**: "API requests showing 404"
```
Solution:
1. Check VITE_API_URL in Vercel env vars
2. Verify URL: https://amar-recipes.infinityfreeapp.com/api
3. Test with curl: curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
4. Check Network tab in DevTools for actual request URL
```

**Problem**: "Page shows blank/white screen"
```
Solution:
1. Check console for JavaScript errors (F12)
2. Check if React bundle loaded (check Network tab)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check if routes are configured correctly in App.jsx
```

### Backend Issues

**Problem**: "404 errors on API calls"
```
Solution:
1. Verify PHP files uploaded to /api/ directory
2. Check file names match endpoints (get_recipes.php, etc.)
3. Test in browser: https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
4. Check InfinityFree error logs: File Manager → error.log
```

**Problem**: "Database connection error"
```
Solution:
1. Verify credentials in config.php
2. Check MySQL server status in InfinityFree
3. Test connection: mysql -h sql102.infinityfree.com -u if0_39569251 -p
4. Verify database name: if0_39569251_amar_recipe
5. Check if tables exist in phpMyAdmin
```

**Problem**: "PHP errors or white screen"
```
Solution:
1. Enable error display (development only!):
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
2. Check error.log in InfinityFree File Manager
3. Verify PHP version compatibility (should be 7.4+)
4. Check file permissions (should be 644 for files, 755 for folders)
```

### CORS & Security Issues

**Problem**: "CORS errors in browser console"
```
Solution:
Add to PHP files (src/api/*.php):
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

**Problem**: "Sensitive data in frontend logs"
```
Solution:
1. Never log API keys or passwords
2. Store sensitive data in env vars only
3. Use .env files that are .gitignored
4. Review all console.log() statements
```

---

## Post-Deployment Maintenance

### Daily Checks

```bash
# Check if frontend is accessible
curl -I https://amar-recipe.vercel.app

# Check if backend is accessible
curl -I https://amar-recipes.infinityfreeapp.com/api/get_recipes.php

# Check GitHub for latest changes
git status
git log --oneline -5
```

### Weekly Maintenance

- [ ] Review API error logs
- [ ] Check database size (InfinityFree quota)
- [ ] Monitor Vercel deployment status
- [ ] Review user feedback/reports
- [ ] Backup database (via phpMyAdmin)

### Monthly Updates

- [ ] Update dependencies (npm update)
- [ ] Security patches (if any)
- [ ] Database optimization (OPTIMIZE TABLE)
- [ ] Clean up old uploads (delete unused images)
- [ ] Review and archive activity logs

### Database Backup

**Via phpMyAdmin** (Recommended):
1. Go to InfinityFree → phpMyAdmin
2. Select database `if0_39569251_amar_recipe`
3. Click **Export**
4. Save as `.sql` file locally

**Via Command Line**:
```bash
mysqldump -h sql102.infinityfree.com -u if0_39569251 -p if0_39569251_amar_recipe > backup.sql
# Enter password when prompted
```

### Deployment Commands Reference

```bash
# Local development
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (creates dist/)
npm run lint         # Check code quality

# Git operations
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub (triggers Vercel build)
git status           # Check status
git log --oneline    # View commit history

# MySQL operations
mysql -h sql102.infinityfree.com -u if0_39569251 -p
SHOW DATABASES;
USE if0_39569251_amar_recipe;
SHOW TABLES;
SELECT * FROM recipes LIMIT 5;
```

---

## Quick Start Deploy Process (Summary)

### For Frontend (Vercel):
1. Make code changes locally
2. Commit: `git add . && git commit -m "..."`
3. Push: `git push origin main`
4. **Vercel automatically builds and deploys**
5. Check: https://vercel.com/dashboard

### For Backend (InfinityFree):
1. Update PHP files in `src/api/`
2. Commit and push to GitHub
3. Upload to InfinityFree via FTP or File Manager
4. Test: `curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php`

### For Database:
1. Connect to phpMyAdmin (InfinityFree panel)
2. Make schema changes or add data
3. Backup regularly

---

## Support & Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [InfinityFree Knowledge Base](https://www.infinityfree.net/kb/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Helpful Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check PHP version (if installed)
php --version

# Check Git status
git status

# View current branch
git branch

# Create new branch for features
git checkout -b feature/your-feature-name
```

---

## Important Credentials (Keep Secure!)

⚠️ **NEVER commit these to GitHub!** Use `.env` files and `.gitignore`

```
🔐 InfinityFree:
   Domain: amar-recipes.infinityfreeapp.com
   MySQL Host: sql102.infinityfree.com
   MySQL User: if0_39569251
   MySQL Password: Sharifcse2025
   MySQL DB: if0_39569251_amar_recipe
   MySQL Port: 3306

🔐 Vercel:
   Project: amar-recipe
   Environment Var: VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api

🔐 GitHub:
   Repository: Sharif2023/Amar_Recipe
```

---

## Deployment Success Criteria

✅ **Frontend (Vercel)**:
- React app builds without errors
- Homepage is accessible and loads
- All routes work (Home, Browse, Admin, etc.)
- Images and styling display correctly
- No JavaScript console errors

✅ **Backend (InfinityFree)**:
- PHP files are uploaded and accessible
- Database connection works
- All API endpoints respond with JSON
- Admin can login successfully
- Users can view and submit recipes

✅ **Database (MySQL)**:
- Tables are created with correct structure
- Sample data exists
- Charset is utf8mb4 for Bengali support
- Connections from both frontend and backend work

✅ **Integration**:
- Frontend API calls reach backend
- Recipes display on homepage
- Admin dashboard is functional
- Image uploads work
- Ratings and reports work

---

**Last Updated**: November 13, 2025  
**Version**: 1.0  
**Deployment Status**: Ready for Production ✅

For questions or issues, review the Troubleshooting section or check the GitHub repository.
