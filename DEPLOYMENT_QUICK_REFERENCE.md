# 🚀 Deployment Quick Reference Card

## At a Glance

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| **Frontend** | Vercel | https://amar-recipe.vercel.app | ✅ Active |
| **Backend API** | InfinityFree | https://amar-recipes.infinityfreeapp.com/api | ✅ Active |
| **Database** | InfinityFree MySQL | sql102.infinityfree.com:3306 | ✅ Active |
| **Repository** | GitHub | github.com/Sharif2023/Amar_Recipe | ✅ Connected |

---

## 3-Step Deploy Process

### Step 1: Commit & Push (Automatic Vercel Deploy)
```bash
cd c:\xampp\htdocs\Amar_Recipies_Live
git add .
git commit -m "Your message"
git push origin main
# ✅ Vercel automatically builds & deploys
```

### Step 2: Upload Backend (If PHP Files Changed)
```bash
# Option A: Use FileZilla FTP
ftp.amar-recipes.infinityfreeapp.com
Upload: Amar_Recipe/src/api/ → /htdocs/api/

# Option B: Use InfinityFree File Manager
InfinityFree Panel → File Manager → Upload files
```

### Step 3: Verify Deployment
```bash
# Check Frontend
curl -I https://amar-recipe.vercel.app
# Should return HTTP 200

# Check Backend
curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
# Should return JSON response

# Check Database
Visit phpMyAdmin in InfinityFree Panel
Verify tables exist: admins, recipes, ratings, reports, messages
```

---

## Key Credentials

```
🔐 NEVER commit these - use .env files!

InfinityFree MySQL:
  Host: sql102.infinityfree.com
  User: if0_39569251
  Pass: Sharifcse2025
  DB: if0_39569251_amar_recipe
  Port: 3306

Vercel Env Var:
  VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api

FTP Access:
  Host: ftp.amar-recipes.infinityfreeapp.com
  User: [Your InfinityFree username]
  Pass: [Your InfinityFree password]
  Port: 21
```

---

## File Locations

```
📁 Repository Root
  ├── Amar_Recipe/
  │   ├── src/
  │   │   ├── api/                ← 26+ PHP endpoints
  │   │   ├── config/
  │   │   │   └── apiConfig.js    ← API URL configuration
  │   │   ├── Components/         ← React components
  │   │   ├── Pages/             ← React pages
  │   │   └── Admin/             ← Admin dashboard
  │   ├── vercel.json            ← Vercel config (build, routes)
  │   ├── package.json           ← Dependencies
  │   ├── vite.config.js         ← Build config
  │   └── .env.production        ← Production API URL
  └── DEPLOYMENT_COMPLETE_GUIDE.md ← Full guide (this file)

📁 InfinityFree (/htdocs/)
  └── api/                       ← Upload PHP files here
      ├── config.php             ← Database config
      ├── admin_login.php
      ├── get_recipes.php
      └── (... 20+ more .php files)
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| **404 on API calls** | Wrong API URL or PHP not uploaded | Check VITE_API_URL, upload to /api/ folder |
| **Blank React page** | Build failed or bundle not loaded | Check Vercel logs, run `npm run build` locally |
| **Database connection error** | Wrong credentials or offline | Verify config.php, check MySQL in InfinityFree |
| **CORS errors** | Missing CORS headers in PHP | Add header() calls in API files |
| **File upload fails** | No permission on /uploads/ | SSH into InfinityFree, `chmod 755 uploads/` |
| **PHP errors (white screen)** | Syntax error or missing extension | Check error.log, verify PHP version 7.4+ |

---

## Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] No hardcoded credentials in files
- [ ] `.env` files are in `.gitignore`
- [ ] `npm run build` works locally
- [ ] Vercel env var `VITE_API_URL` is set
- [ ] PHP files uploaded to InfinityFree `/api/` folder
- [ ] MySQL database created with all tables
- [ ] `/uploads/` and `/admin_dp_uploads/` directories exist
- [ ] Tested at least one API endpoint (get_recipes.php)

---

## Post-Deployment Verification

- [ ] Frontend: https://amar-recipe.vercel.app (loads without errors)
- [ ] Backend: https://amar-recipes.infinityfreeapp.com/api/get_recipes.php (JSON response)
- [ ] Database: phpMyAdmin shows all tables
- [ ] API calls: DevTools Network tab shows 200 responses
- [ ] Admin: Login page works
- [ ] Recipes: Display on homepage
- [ ] No console errors: F12 → Console tab is clean

---

## Useful Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (port 5173)
npm run build            # Build production bundle (creates dist/)
npm run preview          # Preview production build locally
npm run lint             # Check code quality

# Git
git status              # See changes
git add .               # Stage all changes
git commit -m "msg"     # Commit
git push origin main    # Push (Vercel auto-deploys)
git log --oneline -5    # Last 5 commits
git diff                # View pending changes

# MySQL (from terminal if installed)
mysql -h sql102.infinityfree.com -u if0_39569251 -p
mysql> USE if0_39569251_amar_recipe;
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM recipes;
```

---

## Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api
```

### Backend (config.php) - Auto-detects:
```php
// Production (ENVIRONMENT=production)
SQL: sql102.infinityfree.com / if0_39569251 / Sharifcse2025

// Development (ENVIRONMENT=development)
SQL: localhost / root / (empty)
```

---

## Deployment Flow Diagram

```
Local Development
  ↓
git push origin main
  ↓
GitHub (Sharif2023/Amar_Recipe)
  ↓
↙ Vercel Auto-Deploy        ↘ FTP Upload to InfinityFree
  ↓                              ↓
React Build                   PHP Files
  ↓                              ↓
npm run build                src/api/*.php
  ↓                              ↓
Creates dist/                 /htdocs/api/
  ↓                              ↓
amar-recipe.vercel.app    amar-recipes.infinityfreeapp.com/api
     ↓
   [Both services connect to database]
     ↓
sql102.infinityfree.com : if0_39569251_amar_recipe
     ↓
✅ Live & Operational
```

---

## Quick Health Check Script

Run this to verify everything:

```bash
# Windows PowerShell
$frontend = (curl -I https://amar-recipe.vercel.app 2>/dev/null).StatusCode
$backend = (curl -s https://amar-recipes.infinityfreeapp.com/api/get_recipes.php | ConvertFrom-Json).success

Write-Host "Frontend Status: $frontend (200 = OK)"
Write-Host "Backend Status: $backend (true = OK)"
Write-Host "✅ Deployment Healthy!" -ForegroundColor Green
```

---

## Key API Endpoints

```
GET  /get_recipes.php                    → Fetch all recipes
POST /submit_recipe_request.php          → Submit new recipe
POST /submit_recipe.php                  → Submit with approval
POST /admin_login.php                    → Admin authentication
POST /approve_submission.php             → Approve pending recipe
POST /update_recipe.php                  → Edit recipe
POST /delete_recipe.php                  → Remove recipe
POST /rate_recipe.php                    → Add rating
POST /report_recipe.php                  → Report inappropriate
GET  /get_submission_requests.php        → View pending recipes
GET  /get_reports.php                    → View user reports
GET  /admin_get_messages.php             → Get admin messages
```

**All endpoints URL**: `https://amar-recipes.infinityfreeapp.com/api/`

---

## Monthly Maintenance Tasks

```bash
# Week 1: Backup & Verify
mysqldump -h sql102.infinityfree.com -u if0_39569251 -p if0_39569251_amar_recipe > backup.sql

# Week 2: Check Logs
Vercel Dashboard → Deployments → Check logs
InfinityFree → File Manager → View error.log

# Week 3: Security
Update dependencies: npm update
Check for vulnerabilities: npm audit

# Week 4: Database Optimization
phpMyAdmin → Database → Maintenance → Optimize
Check storage usage in InfinityFree
```

---

## Emergency Contacts

- **Vercel Issues**: https://vercel.com/support
- **InfinityFree Issues**: https://www.infinityfree.net/support
- **GitHub Issues**: https://github.com/Sharif2023/Amar_Recipe/issues

---

## Document Reference

| Document | Purpose |
|----------|---------|
| **DEPLOYMENT_COMPLETE_GUIDE.md** | Full comprehensive guide (THIS) |
| **DEPLOYMENT_QUICK_REFERENCE.md** | Quick reference card (overview) |
| **.env.production** | Production environment variables |
| **src/api/config.php** | Database configuration |
| **src/config/apiConfig.js** | Frontend API endpoints |
| **vercel.json** | Vercel build & deployment config |
| **package.json** | Node.js dependencies & scripts |

---

**Last Updated**: November 13, 2025  
**Status**: ✅ Ready for Production Deployment

For detailed information, see `DEPLOYMENT_COMPLETE_GUIDE.md`
