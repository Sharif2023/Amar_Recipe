# Amar Recipe - Deployment Guide

## Overview
This project has been configured for deployment with:
- **Frontend**: Vercel (React + Vite)
- **Backend**: InfinityFree (PHP + MySQL)
- **Database**: MySQL at InfinityFree

---

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (InfinityFree)](#backend-deployment-infinityfree)
4. [Database Setup](#database-setup)
5. [Testing Deployment](#testing-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### Production Environment Variables
The project uses environment variables to switch between development and production:

#### Frontend (.env.production)
```env
VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api
```

#### Backend (InfinityFree config.php)
The database configuration is automatically set based on the environment:
- **Production**: Connects to InfinityFree MySQL database
- **Development**: Connects to local localhost database

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Git installed locally

### Deployment Steps

#### 1. Prepare Your Repository
```bash
# Navigate to project root
cd /path/to/Amar_Recipies_Live

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
```

#### 2. Push to GitHub
```bash
# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/Amar_Recipies_ReactJS.git
git push -u origin main
```

#### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your `Amar_Recipies_ReactJS` repository
5. Configure build settings:
   - **Framework**: Vite
   - **Root Directory**: `./Amar_Recipe`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://amar-recipes.infinityfreeapp.com/api`
7. Click "Deploy"

Your frontend will be live at a URL like: `https://amar-recipe.vercel.app`

---

## Backend Deployment (InfinityFree)

### Prerequisites
- InfinityFree account (free hosting)
- FTP/File Manager access
- MySQL database created

### Database Credentials
```
Server: sql102.infinityfree.com
Database: if0_39569251_amar_recipe
Username: if0_39569251
Password: Sharifcse2025
Port: 3306
```

### Deployment Steps

#### 1. Prepare Backend Files
Copy all PHP files from `Amar_Recipe/src/api/` to InfinityFree:

Required files to upload:
```
/api/
  ├── config.php (NEW - Database configuration)
  ├── admin_get_messages.php
  ├── admin_login.php
  ├── admin_requests.php
  ├── admin_send_message.php
  ├── approve_submission.php
  ├── change_password.php
  ├── check_user_rating.php
  ├── delete_account.php
  ├── delete_recipe.php
  ├── delete_report.php
  ├── get_admin_activity_history.php
  ├── get_recipes.php
  ├── get_reports.php
  ├── get_report_count.php
  ├── get_submission_count.php
  ├── get_submission_history.php
  ├── get_submission_requests.php
  ├── rate_recipe.php
  ├── reject_submission.php
  ├── report_recipe.php
  ├── submit_recipe.php
  ├── submit_recipe_request.php
  ├── update_admin_profile.php
  ├── update_admin_status.php
  ├── update_recipe.php
  ├── update_report_status.php
  ├── uploads/ (folder for recipe images)
  └── admin_dp_uploads/ (folder for admin profile images)
```

#### 2. Upload Files via FTP
1. Log in to InfinityFree control panel
2. Go to File Manager
3. Navigate to `htdocs/` or your public directory
4. Create folder structure `/api`
5. Upload all PHP files from `src/api/`
6. Upload `admin_api/` folder files to `/api/` (rename as needed)

#### 3. Create Upload Directories
```bash
# Via File Manager, create these directories with 755 permissions:
/api/uploads
/api/admin_dp_uploads
```

#### 4. Database Setup
1. Go to InfinityFree control panel
2. Select "MySQL Databases"
3. Create database: `if0_39569251_amar_recipe`
4. Import SQL schema from your backup/repository

#### 5. Update config.php
The `config.php` file automatically detects the environment:
- When `ENVIRONMENT` variable = 'production', it uses InfinityFree credentials
- Otherwise, it uses local development credentials

---

## Database Setup

### Create Tables
You need to import the following tables into your InfinityFree MySQL database:

```sql
-- Create recipes table
CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description LONGTEXT,
  image_url VARCHAR(255),
  location VARCHAR(255),
  organizerName VARCHAR(255),
  organizerEmail VARCHAR(255),
  organizerAddress TEXT,
  source VARCHAR(255),
  tags VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  rating DECIMAL(3,2) DEFAULT 0,
  ratingCount INT DEFAULT 0,
  comment TEXT,
  tutorialVideo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create submission_requests table
CREATE TABLE submission_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description LONGTEXT,
  image VARCHAR(255),
  location VARCHAR(255),
  organizerName VARCHAR(255),
  organizerEmail VARCHAR(255),
  organizerAddress TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  tags VARCHAR(255),
  reference VARCHAR(255),
  tutorialVideo VARCHAR(255),
  comment TEXT,
  source VARCHAR(255),
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipe_id INT NOT NULL,
  email VARCHAR(255),
  rating INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipe_id INT NOT NULL,
  reasons JSON,
  other_reason TEXT,
  reporter_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_requests table
CREATE TABLE admin_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  date DATE,
  area VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  postcode VARCHAR(10),
  experience TEXT,
  specialty VARCHAR(255),
  portfolio VARCHAR(255),
  certification LONGTEXT,
  profile_image VARCHAR(255),
  password VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_chat_messages table
CREATE TABLE admin_chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Check browser console for errors
- Test navigation and recipe loading

### 2. Test Backend API
```bash
# Test a GET request
curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php

# Should return JSON with recipes
```

### 3. Test Admin Login
1. Navigate to `/adminlogin` on your Vercel URL
2. Enter admin credentials
3. Verify successful login and admin panel access

### 4. Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform actions and verify API calls are going to InfinityFree URL

---

## Troubleshooting

### CORS Errors
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: All PHP files already have CORS headers:
```php
header('Access-Control-Allow-Origin: *');
```

If still having issues:
- Clear browser cache
- Check that API URL is correct in `.env.production`
- Verify PHP files are uploaded to correct location

### Database Connection Failed
**Problem**: `Database connection failed`

**Solution**:
- Verify credentials in `config.php`
- Check InfinityFree MySQL is active
- Verify database exists: `if0_39569251_amar_recipe`
- Check tables are created
- Verify user permissions in InfinityFree control panel

### File Upload Not Working
**Problem**: Images not uploading to recipes

**Solution**:
- Ensure `/api/uploads/` directory exists
- Set directory permissions to 755
- Check file size limits (usually 64MB on free hosting)
- Verify file extensions are allowed (png, jpg, jpeg, gif)

### 404 Errors on API
**Problem**: API endpoints returning 404

**Solution**:
- Verify all `.php` files are uploaded
- Check file names match exactly
- Verify folder structure: `/api/` contains all files
- Check file permissions (usually 644)

### Environment Variable Not Working
**Problem**: API URL still pointing to localhost

**Solution**:
- Rebuild project on Vercel after changing env vars
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Click "Deploy" again after updating
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## File Structure After Deployment

### Frontend (Vercel)
```
/
├── index.html (served from Vercel)
├── dist/ (compiled React app)
└── All assets built from src/
```

### Backend (InfinityFree)
```
/htdocs/
├── api/
│   ├── config.php
│   ├── admin_login.php
│   ├── get_recipes.php
│   ├── ... (all other PHP files)
│   ├── uploads/ (recipe images)
│   └── admin_dp_uploads/ (admin profiles)
└── index.html (optional, redirects to Vercel)
```

---

## Important Notes

1. **Environment Detection**: The backend automatically detects if it's running on InfinityFree based on the hostname and uses appropriate database credentials.

2. **Image Uploads**: Images are stored in `/api/uploads/` and `/api/admin_dp_uploads/` on InfinityFree. Make sure these directories are writable.

3. **HTTPS**: Vercel provides free HTTPS. InfinityFree also provides free SSL. Ensure your API calls use HTTPS in production.

4. **Database Backups**: Regularly backup your InfinityFree MySQL database through the control panel.

5. **API Rate Limiting**: Be aware that free hosting may have rate limitations. Monitor usage.

6. **Session Management**: Admin sessions are stored in browser localStorage. Clear if needed for testing.

---

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **InfinityFree Help**: https://infinityfree.net/forums/
- **React Documentation**: https://react.dev
- **PHP MySQL**: https://www.php.net/manual/en/book.mysqli.php

---

## Version History

- **v1.0.0** (November 13, 2025): Initial deployment setup for Vercel + InfinityFree
  - Configured environment-based database connections
  - Updated all API calls to use config system
  - Created Vercel deployment configuration
  - Updated documentation

---

**Last Updated**: November 13, 2025
**Maintained By**: Development Team
