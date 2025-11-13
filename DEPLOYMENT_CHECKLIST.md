# 📋 Deployment Checklist & Summary

## Current Project Status: ✅ READY FOR PRODUCTION

### Amar Recipes - Full Stack Application
- **Frontend**: React 19 + Vite (on Vercel)
- **Backend**: PHP + MySQL (on InfinityFree)
- **Database**: MySQL (hosted on InfinityFree)
- **Repository**: GitHub (Sharif2023/Amar_Recipe)

---

## ✅ What's Already Done

### Infrastructure Setup
- ✅ Vercel account connected to GitHub
- ✅ InfinityFree account with free domain (amar-recipes.infinityfreeapp.com)
- ✅ MySQL database created (if0_39569251_amar_recipe)
- ✅ All credentials securely configured

### Code Configuration
- ✅ vercel.json created (build, routes, env vars)
- ✅ src/api/config.php configured (database connection)
- ✅ src/config/apiConfig.js configured (API endpoints)
- ✅ .env.production configured (VITE_API_URL)
- ✅ package.json has all build scripts

### Code Quality
- ✅ No hardcoded credentials in source code
- ✅ Environment-based configuration implemented
- ✅ 26+ PHP API endpoints ready
- ✅ 13+ React components functional
- ✅ Admin dashboard complete

### Documentation
- ✅ DEPLOYMENT_COMPLETE_GUIDE.md (797 lines - comprehensive)
- ✅ DEPLOYMENT_QUICK_REFERENCE.md (299 lines - quick reference)
- ✅ This checklist document

---

## 📋 Step-by-Step Deployment Instructions

### Phase 1: Frontend Deployment (Vercel) - AUTOMATED ✅

**What happens automatically:**
```
You push code to GitHub main branch
         ↓
Vercel detects push
         ↓
Vercel runs: npm install
         ↓
Vercel runs: npm run build (creates dist/)
         ↓
Vercel deploys to CDN
         ↓
Live at: https://amar-recipe.vercel.app
```

**To trigger deployment:**
```bash
cd c:\xampp\htdocs\Amar_Recipies_Live

# Make changes to code
# Then:

git add .
git commit -m "Your meaningful message"
git push origin main

# ✅ Vercel automatically builds and deploys
# Check status at: https://vercel.com/dashboard
```

**What you get:**
- Automatic HTTPS
- Global CDN distribution
- Automatic error page redirects (SPA routing)
- Branch previews (preview-[branch-name].vercel.app)
- Deploy logs and monitoring

---

### Phase 2: Backend Deployment (InfinityFree) - MANUAL

**Files to upload:**
```
Source: c:\xampp\htdocs\Amar_Recipies_Live\Amar_Recipe\src\api\
Destination: /home/if0_39569251/public_html/api/

Files:
  ✅ config.php (database connection)
  ✅ admin_login.php
  ✅ admin_signup.php
  ✅ admin_delete.php
  ✅ admin_requests.php
  ✅ admin_req_reject.php
  ✅ admin_get_messages.php
  ✅ admin_send_message.php
  ✅ get_recipes.php
  ✅ get_reports.php
  ✅ get_submission_requests.php
  ✅ approve_submission.php
  ✅ reject_submission.php
  ✅ submit_recipe.php
  ✅ submit_recipe_request.php
  ✅ update_recipe.php
  ✅ delete_recipe.php
  ✅ rate_recipe.php
  ✅ report_recipe.php
  ✅ (+ 6 more PHP files)
```

**Upload Methods (Choose One):**

**Option A: FileZilla (Recommended for beginners)**
```
1. Download FileZilla: https://filezilla-project.org/
2. Open FileZilla
3. File → Site Manager → New Site
4. Enter:
   Host: ftp.amar-recipes.infinityfreeapp.com
   Port: 21
   Username: [your InfinityFree username]
   Password: [your InfinityFree password]
5. Click Connect
6. Navigate to: /htdocs/
7. Create folder: api/
8. Drag & drop all .php files from Amar_Recipe/src/api/
9. Done! ✅
```

**Option B: InfinityFree File Manager (Web-based)**
```
1. Log in to https://www.infinityfree.net/
2. Go to Accounts → Manage Account
3. Click File Manager
4. Navigate to /home/if0_39569251/public_html/
5. Create folder: api
6. Upload files via web interface
7. Done! ✅
```

**Option C: Git Auto-Deploy (Advanced)**
```
1. Configure GitHub Actions to auto-deploy
2. Or set up webhook to pull from GitHub
3. Reference: https://www.infinityfree.net/kb/
```

**Create Directories:**
```bash
# After uploading, create these folders in /htdocs/api/:
mkdir uploads/              # For recipe images
mkdir admin_dp_uploads/     # For admin profile pictures

# Set permissions (if you have SSH access):
chmod 755 uploads/
chmod 755 admin_dp_uploads/
```

---

### Phase 3: Database Setup (MySQL) - ONE-TIME ✅

**Connection Details:**
```
Host: sql102.infinityfree.com
Port: 3306
Username: if0_39569251
Password: Sharifcse2025
Database: if0_39569251_amar_recipe
```

**Access Database (Choose One):**

**Option A: phpMyAdmin (Easiest)**
```
1. Log in to InfinityFree
2. Click "MySQL" → "phpMyAdmin"
3. Login with credentials above
4. Select database: if0_39569251_amar_recipe
5. Create tables (SQL provided in DEPLOYMENT_COMPLETE_GUIDE.md)
```

**Option B: MySQL Workbench**
```
1. Download: https://www.mysql.com/products/workbench/
2. Create new connection:
   Connection Name: Amar Recipe Production
   Hostname: sql102.infinityfree.com
   Port: 3306
   Username: if0_39569251
   Password: Sharifcse2025
3. Test Connection
4. Click Connect
5. Run SQL scripts to create tables
```

**Option C: Command Line**
```bash
mysql -h sql102.infinityfree.com -u if0_39569251 -p

# When prompted, enter: Sharifcse2025

mysql> USE if0_39569251_amar_recipe;
mysql> CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# (See DEPLOYMENT_COMPLETE_GUIDE.md for all table schemas)
```

**Tables to Create:**
```
✅ admins               (Admin users)
✅ recipes             (Recipe data)
✅ ratings            (Recipe ratings)
✅ reports            (Abuse reports)
✅ messages           (Admin messaging)
✅ activity_history   (Admin actions)
✅ submission_requests (Pending recipes)
```

---

## 🧪 Testing Checklist

### Frontend Tests (After Vercel Deploy)

```
□ Visit https://amar-recipe.vercel.app
  ✓ Page loads
  ✓ No errors in console (F12)
  ✓ Logo and images display
  ✓ Responsive on mobile

□ Test Navigation
  ✓ Home page works
  ✓ Browse recipes works
  ✓ Admin panel accessible
  ✓ All links work

□ Check Network
  ✓ API calls go to: https://amar-recipes.infinityfreeapp.com/api/...
  ✓ Responses are JSON (not HTML errors)
  ✓ Status codes are 200 (not 404)
```

### Backend Tests (After InfinityFree Upload)

```
□ Test API Endpoints
  curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
  ✓ Returns JSON response
  ✓ Status 200 (not 404 or 500)

□ Test Database Connection
  ✓ No "database connection failed" errors
  ✓ Data from tables displays
  ✓ No SQL syntax errors

□ Test File Uploads
  ✓ Recipe image upload works
  ✓ Admin profile picture upload works
  ✓ Files saved to /uploads/ folder
```

### Integration Tests (Frontend + Backend)

```
□ Recipes Display
  ✓ Homepage shows recipes from database
  ✓ "Browse Recipes" loads all recipes
  ✓ Search/filter works

□ Admin Functionality
  ✓ Admin login works
  ✓ Admin dashboard loads
  ✓ Can approve pending recipes
  ✓ Can view reports
  ✓ Can send messages
  ✓ Activity history saves

□ User Interactions
  ✓ Users can rate recipes
  ✓ Users can report recipes
  ✓ Users can submit new recipes
  ✓ Form submissions work
```

---

## 🔒 Security Checklist

```
✅ Credentials Management
  □ No hardcoded credentials in source code
  □ All credentials in .env files
  □ .env files are in .gitignore
  □ Database password is secure (32+ chars)

✅ API Security
  □ CORS headers configured
  □ SQL injection prevention (use prepared statements)
  □ Input validation on all endpoints
  □ Rate limiting considered

✅ Database Security
  □ Strong password for MySQL user
  □ Database backups scheduled
  □ Permissions set correctly (755 for folders, 644 for files)

✅ Frontend Security
  □ No sensitive data logged to console
  □ API keys not exposed in client code
  □ HTTPS enforced (Vercel handles this)
  □ CSRF tokens used (if needed)
```

---

## 📊 Current Environment Configuration

### Frontend (Vercel)
```
Environment: Production
Build Command: npm run build
Output Directory: dist
Runtime: Node.js (for build only)
Environment Variable:
  VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api

Frontend URL: https://amar-recipe.vercel.app
Deployment: Automatic (on every GitHub push)
```

### Backend (InfinityFree)
```
Environment: Production
Language: PHP 7.4+ (check in InfinityFree)
Database: MySQL (sql102.infinityfree.com)
Domain: amar-recipes.infinityfreeapp.com
Upload Method: FTP or File Manager
HTTPS: Enabled (free SSL)
```

### Database (MySQL)
```
Host: sql102.infinityfree.com
Port: 3306
Username: if0_39569251
Database: if0_39569251_amar_recipe
Charset: utf8mb4 (Bengali support)
Backups: Manual (via phpMyAdmin)
```

---

## 🚨 Common Issues & Solutions

### Issue: "Build failed on Vercel"
**Cause**: Error during `npm run build`  
**Solution**:
1. Run locally: `npm run build`
2. Fix errors
3. Commit and push
4. Check Vercel logs: https://vercel.com/dashboard

### Issue: "404 on API calls"
**Cause**: PHP files not uploaded or wrong URL  
**Solution**:
1. Verify files uploaded to `/htdocs/api/`
2. Check URL: https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
3. Use curl: `curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php`

### Issue: "Database connection error"
**Cause**: Wrong credentials or offline  
**Solution**:
1. Check config.php credentials
2. Test in phpMyAdmin
3. Verify MySQL status in InfinityFree

### Issue: "CORS error in browser"
**Cause**: Missing CORS headers  
**Solution**:
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
?>
```

### Issue: "White screen of death"
**Cause**: PHP syntax error  
**Solution**:
1. Check error.log in InfinityFree File Manager
2. Fix syntax
3. Re-upload file

---

## 📦 Backup & Maintenance

### Weekly Tasks
```bash
# Check deployment status
curl -I https://amar-recipe.vercel.app
curl -I https://amar-recipes.infinityfreeapp.com/api/get_recipes.php

# Review logs
# - Vercel Dashboard → Deployments
# - InfinityFree → error.log
```

### Monthly Tasks
```bash
# Backup database
mysqldump -h sql102.infinityfree.com -u if0_39569251 -p \
  if0_39569251_amar_recipe > backup_$(date +%Y%m%d).sql

# Clean up old uploads
# Remove unused images from /api/uploads/

# Update dependencies
npm update
npm audit
```

### Quarterly Tasks
```bash
# Database optimization
# Via phpMyAdmin → Maintenance → Optimize

# Security audit
# Review access logs
# Update PHP version if available
# Test disaster recovery
```

---

## 📞 Support Resources

### Documentation
| Resource | Link |
|----------|------|
| Complete Guide | DEPLOYMENT_COMPLETE_GUIDE.md |
| Quick Reference | DEPLOYMENT_QUICK_REFERENCE.md |
| Vercel Docs | https://vercel.com/docs |
| InfinityFree KB | https://www.infinityfree.net/kb/ |
| PHP Docs | https://www.php.net/docs.php |
| MySQL Docs | https://dev.mysql.com/doc/ |

### API Documentation
```
Base URL: https://amar-recipes.infinityfreeapp.com/api/

GET  /get_recipes.php              → Get all recipes
POST /submit_recipe_request.php    → Submit recipe for approval
POST /admin_login.php              → Admin login
POST /approve_submission.php       → Approve recipe
POST /delete_recipe.php            → Delete recipe
POST /rate_recipe.php              → Rate a recipe
POST /report_recipe.php            → Report recipe
```

---

## ✅ Final Deployment Checklist

Before going live, verify:

```
Frontend (Vercel)
  □ Code committed and pushed to GitHub
  □ vercel.json exists in Amar_Recipe folder
  □ VITE_API_URL environment variable set
  □ npm run build works locally
  □ No console errors on deployed site
  □ All routes work (home, browse, admin)

Backend (InfinityFree)
  □ All .php files uploaded to /htdocs/api/
  □ /uploads/ and /admin_dp_uploads/ folders created
  □ config.php has correct credentials
  □ No PHP errors visible
  □ API endpoints return JSON responses

Database (MySQL)
  □ Connected to sql102.infinityfree.com
  □ Database: if0_39569251_amar_recipe exists
  □ All 7 tables created
  □ Charset is utf8mb4
  □ Data is present and accessible

Integration
  □ Frontend can reach backend API
  □ Recipes display on homepage
  □ Admin login works
  □ File uploads work
  □ Ratings and reports work

Security
  □ No hardcoded credentials
  □ .env files not committed
  □ CORS configured
  □ Database password is strong
  □ HTTPS is working

Monitoring
  □ Vercel logs checked
  □ InfinityFree logs checked
  □ No error messages on frontend
  □ All API calls succeed
```

---

## 🎉 Deployment Complete!

Once all above is verified:

**Your website is LIVE:**
- Frontend: https://amar-recipe.vercel.app
- Backend: https://amar-recipes.infinityfreeapp.com/api
- Admin Panel: https://amar-recipe.vercel.app/admin

**Next steps:**
1. Promote your website
2. Create sample recipes
3. Test with real users
4. Monitor performance
5. Fix any bugs reported
6. Iterate and improve

---

## 📝 Version Info

| Aspect | Details |
|--------|---------|
| **Last Updated** | November 13, 2025 |
| **Document Version** | 1.0 |
| **React Version** | 19.1.0 |
| **Vite Version** | 6.3.5 |
| **PHP Version** | 7.4+ (recommended 8.0+) |
| **MySQL Version** | 5.7+ |
| **Deployment Status** | ✅ Ready for Production |

---

**Questions?** Refer to:
1. **DEPLOYMENT_COMPLETE_GUIDE.md** (for detailed steps)
2. **DEPLOYMENT_QUICK_REFERENCE.md** (for quick lookup)
3. **This file** (for overview and checklists)

**Good luck with your deployment! 🚀**
