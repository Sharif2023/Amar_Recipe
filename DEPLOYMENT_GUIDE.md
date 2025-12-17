# Amar Recipes - Vercel + Byethost Deployment Guide

Complete guide for deploying Amar Recipes with frontend on **Vercel** and backend on **Byethost**.

---

## 📋 Table of Contents

1. [Backend Deployment (Byethost)](#backend-deployment-byethost)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Post-Deployment Testing](#post-deployment-testing)
4. [Troubleshooting](#troubleshooting)

---

## 🔧 Backend Deployment (Byethost)

### Prerequisites
- Byethost account credentials
- FTP client (FileZilla recommended)
- Database credentials (provided below)

### Step 1: Setup Database

1. **Log in to Byethost vPanel**
   - Visit: https://byethost.com/login
   - Username: `b7_40426674`
   - Password: `Sharif2025`

2. **Access phpMyAdmin**
   - From vPanel, click on **"MySQL Databases"**
   - Click on **"phpMyAdmin"** button
   - Select database: `b7_40426674_amar_recipe`

3. **Import Database Schema**
   - In phpMyAdmin, click on the **"Import"** tab
   - Click **"Choose File"** and select `database/schema.sql`
   - Click **"Go"** to execute the import
   - Verify all tables are created:
     - ✅ `recipes`
     - ✅ `recipe_submission_requests`
     - ✅ `admin_requests`
     - ✅ `reports`
     - ✅ `ratings`
     - ✅ `admin_chat_messages`

### Step 2: Upload Backend Files via FTP

1. **FTP Connection Details**
   - **Host**: `ftpupload.net`
   - **Username**: `b7_40426674`
   - **Password**: `Sharif2025`
   - **Port**: 21

2. **Connect Using FileZilla**
   - Open FileZilla
   - Enter the FTP details above
   - Click **"Quickconnect"**

3. **Upload Files**
   - Navigate to the `htdocs` folder on the remote server
   - Upload the following directories/files from your local `Amar_Recipe` folder:
     ```
     ✅ src/api/ (all PHP files)
     ✅ admin_api/ (all PHP files)
     ✅ .htaccess (in root)
     ```
   
4. **Create Upload Directories**
   - In the `src/api/` folder, create the following directories:
     - `uploads/` (for recipe images)
     - `admin_dp_uploads/` (for admin profile pictures)
   - Set permissions to **755** or **777** (right-click → File permissions)

### Step 3: Verify Configuration Files

1. **Check `config.php`**
   - Ensure `src/api/config.php` contains correct Byethost credentials:
     ```php
     define('DB_HOST', 'sql212.byethost7.com');
     define('DB_NAME', 'b7_40426674_amar_recipe');
     define('BASE_URL', 'https://amar-recipe.byethost7.com/');
     ```

2. **Check `.htaccess`**
   - Ensure `.htaccess` is in the root directory
   - Verify CORS headers are properly configured

### Step 4: Test Backend API

1. **Test Database Connection**
   - Visit: https://amar-recipe.byethost7.com/src/api/get_recipes.php
   - You should see: `{"success":true,"recipes":[]}`

2. **Test Other Endpoints**
   - Admin requests: https://amar-recipe.byethost7.com/src/api/admin_requests.php
   - Reports: https://amar-recipe.byethost7.com/src/api/get_reports.php

> ✅ **Success**: If you see JSON responses, backend is working!  
> ⚠️ **Error**: See [Troubleshooting](#troubleshooting) section

---

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier is sufficient)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js and npm installed locally

### Step 1: Prepare Frontend

1. **Update Remaining React Components** (if not done)
   - Option A: Run PowerShell script
     ```powershell
     cd Amar_Recipe
     .\update-api-urls.ps1
     ```
   - Option B: Manually import `API_BASE_URL` in remaining files

2. **Test Build Locally**
   ```bash
   cd Amar_Recipe
   npm install
   npm run build
   ```
   - ✅ Verify build completes without errors
   - ✅ Check `dist` folder is created

3. **Preview Build**
   ```bash
   npm run preview
   ```
   - Visit http://localhost:4173
   - Test basic functionality

### Step 2: Push to Git Repository

If not already done:

```bash
git init
git add .
git commit -m "Configure for Byethost deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Visit: https://vercel.com/
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click **"Add New Project"**
   - Select your Git repository
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `Amar_Recipe` (or leave as `.` if repo is the Amar_Recipe folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   - Click **"Environment Variables"**
   - Add the following:
     
     | Name | Value |
     |------|-------|
     | `VITE_API_BASE_URL` | `https://amar-recipe.byethost7.com/src/api/` |
     | `VITE_ADMIN_API_BASE_URL` | `https://amar-recipe.byethost7.com/admin_api/` |
   
   - Select **"Production"**, **"Preview"**, and **"Development"** environments

5. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete (1-3 minutes)
   - You'll get a URL like: `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

```bash
npm install -g vercel
cd Amar_Recipe
vercel login
vercel --prod
```

When prompted, enter your environment variables.

### Step 4: Configure Custom Domain (Optional)

1. Go to Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed

---

## ✅ Post-Deployment Testing

### Backend Tests

- [ ] Visit: https://amar-recipe.byethost7.com/src/api/get_recipes.php
- [ ] Verify JSON response
- [ ] Check CORS headers (Open browser DevTools → Network)

### Frontend Tests

1. **Basic Loading**
   - [ ] Visit your Vercel URL
   - [ ] All pages load correctly
   - [ ] No console errors

2. **Recipe Features**
   - [ ] Browse recipes by category
   - [ ] Search recipes
   - [ ] View recipe details in modal
   - [ ] Submit rating (test with email)

3. **Recipe Submission**
   - [ ] Submit new recipe with image
   - [ ] Verify appears in admin panel

4. **Admin Panel**
   - [ ] Admin login works
   - [ ] View pending submissions
   - [ ] Approve/reject recipes
   - [ ] Upload profile image

5. **Cross-Origin**
   - [ ] No CORS errors in console
   - [ ] API calls work from Vercel to Byethost

---

## 🐛 Troubleshooting

### CORS Errors

**Problem**: `Access-Control-Allow-Origin` errors in browser console

**Solutions**:
1. Verify `.htaccess` is uploaded to Byethost
2. Check `config.php` has `setCorsHeaders()` function
3. Clear browser cache and hard refresh
4. Try accessing API directly in new incognito window

**Check CORS Headers**:
```bash
curl -I https://amar-recipe.byethost7.com/src/api/get_recipes.php
```
Should show: `Access-Control-Allow-Origin: *`

### Database Connection Failed

**Problem**: API returns `{"success":false,"message":"Database connection failed"}`

**Solutions**:
1. Verify credentials in `config.php`:
   - Host: `sql212.byethost7.com`
   - User: `b7_40426674`
   - Database: `b7_40426674_amar_recipe`
2. Check database exists in phpMyAdmin
3. Verify password is correct: `Sharif2025`
4. Try connecting via MySQL client:
   ```bash
   mysql -h sql212.byethost7.com -u b7_40426674 -p
   ```

### Images Not Displaying

**Problem**: Uploaded images show broken links or 404

**Solutions**:
1. Check upload directories exist:
   - `/htdocs/src/api/uploads/`
   - `/htdocs/src/api/admin_dp_uploads/`
2. Verify directory permissions (755 or 777)
3. Check `API_BASE_URL` in frontend config
4. Inspect Network tab to see actual image URL being requested

### Frontend Build Fails

**Problem**: `npm run build` fails with errors

**Solutions**:
1. Delete `node_modules` and `package-lock.json`
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
2. Check for TypeScript/ESLint errors
3. Verify all imports are correct
4. Check Node.js version (needs 18+)

### Vercel Deployment Fails

**Problem**: Deployment fails on Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` is correct
3. Ensure environment variables are set
4. Try deploying from CLI:
   ```bash
   vercel --prod --debug
   ```

### Environment Variables Not Working

**Problem**: API still points to localhost

**Solutions**:
1. Verify variables are set in Vercel dashboard
2. Variable names must match exactly: `VITE_API_BASE_URL`
3. Redeploy after setting variables
4. Check `.env.production` file exists locally
5. Clear browser cache

---

## 📊 Quick Reference

### Byethost Credentials

| Item | Value |
|------|-------|
| **Domain** | amar-recipe.byethost7.com |
| **FTP Host** | ftpupload.net |
| **FTP User** | b7_40426674 |
| **FTP Password** | Sharif2025 |
| **DB Host** | sql212.byethost7.com |
| **DB Name** | b7_40426674_amar_recipe |
| **DB User** | b7_40426674 |
| **DB Password** | Sharif2025 |

### Test URLs

- **Get Recipes**: https://amar-recipe.byethost7.com/src/api/get_recipes.php
- **Admin Login**: https://amar-recipe.byethost7.com/src/api/admin_login.php
- **Get Reports**: https://amar-recipe.byethost7.com/src/api/get_reports.php

### Vercel Environment Variables

```env
VITE_API_BASE_URL=https://amar-recipe.byethost7.com/src/api/
VITE_ADMIN_API_BASE_URL=https://amar-recipe.byethost7.com/admin_api/
```

---

## 📚 Additional Resources

- **Byethost Documentation**: https://byet.host/index.php?/support/
- **Vercel Documentation**: https://vercel.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **React Router**: https://reactrouter.com/

---

## 💡 Tips

1. **Free SSL**: Both Byethost and Vercel provide free SSL certificates
2. **Caching**: Clear browser cache when testing changes
3. **Logs**: Check Vercel deployment logs for errors
4. **Backup**: Export database regularly from phpMyAdmin
5. **Updates**: Use Git for version control

---

**Last Updated**: December 18, 2024  
**Version**: 2.0 (Byethost)
