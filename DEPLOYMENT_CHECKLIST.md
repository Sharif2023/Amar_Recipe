# Railway + Vercel Deployment Checklist

Quick reference checklist for deploying Amar Recipe to Railway (backend) and Vercel (frontend).

## ✅ Pre-Deployment Checklist

### Local Preparation
- [ ] All code committed to GitHub
- [ ] Latest changes pushed to main branch
- [ ] Frontend build test passed locally (`npm run build`)
- [ ] Environment variable templates reviewed

### Railway Account Setup
- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] Payment method added to Railway account
- [ ] GitHub account connected to Railway

### Vercel Account Setup
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub account connected to Vercel

---

## 🚂 Railway Backend Deployment

### Step 1: Create Railway Project
- [ ] Go to Railway Dashboard
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose `Amar_Recipies_ReactJS` repository
- [ ] Wait for initial deployment

### Step 2: Add MySQL Database
- [ ] Click "+ New" in Railway project
- [ ] Select "Database" → "Add MySQL"
- [ ] Wait for MySQL service to be provisioned
- [ ] Note: Environment variables auto-populate

### Step 3: Configure Environment Variables
- [ ] Go to Web Service → Variables tab
- [ ] Add `ALLOWED_ORIGIN` (update after Vercel deployment)
- [ ] Verify MySQL variables are present:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASS`
  - `DB_NAME`

### Step 4: Import Database Schema
- [ ] Click on MySQL service
- [ ] Go to "Data" tab → "Query"
- [ ] Copy contents from `database/schema.sql`
- [ ] Execute the SQL
- [ ] Verify tables created successfully

### Step 5: Verify Deployment
- [ ] Check deployment logs for errors
- [ ] Copy Railway public URL (e.g., `https://your-project-production.up.railway.app`)
- [ ] Test API endpoint: `https://your-url/src/api/cors-test.php`
- [ ] Verify JSON response returned

**Railway Backend URL**: `_____________________________________`

---

## ▲ Vercel Frontend Deployment

### Step 1: Import Project
- [ ] Go to Vercel Dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import `Amar_Recipies_ReactJS` repository
- [ ] Select `Amar_Recipe` as root directory

### Step 2: Configure Build Settings
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Framework Preset: Vite

### Step 3: Set Environment Variables
- [ ] Go to "Environment Variables" section
- [ ] Add `VITE_API_BASE_URL`:
  ```
  https://your-railway-url.up.railway.app/src/api/
  ```
- [ ] Add `VITE_ADMIN_API_BASE_URL`:
  ```
  https://your-railway-url.up.railway.app/admin_api/
  ```
- [ ] Select "Production" environment

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Copy Vercel deployment URL

**Vercel Frontend URL**: `_____________________________________`

---

## 🔄 Post-Deployment Configuration

### Update Railway CORS
- [ ] Go back to Railway → Web Service → Variables
- [ ] Update `ALLOWED_ORIGIN` with your Vercel URL:
  ```
  https://your-vercel-app.vercel.app
  ```
- [ ] Redeploy if needed (Railway auto-redeploys on variable change)

### Verify Integration
- [ ] Visit Vercel frontend URL
- [ ] Check browser console for errors
- [ ] Test: Browse recipes (should load from Railway)
- [ ] Test: Submit a recipe
- [ ] Test: Admin login
- [ ] Test: Image upload

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] Recipe list displays correctly
- [ ] Category filtering works
- [ ] Recipe details page loads
- [ ] Dark mode toggle works
- [ ] Responsive on mobile

### Backend API Tests
- [ ] GET `/api/get_recipes.php` returns recipes
- [ ] POST `/api/submit_recipe.php` accepts submissions
- [ ] POST `/api/rate_recipe.php` accepts ratings
- [ ] POST `/api/report_recipe.php` accepts reports
- [ ] CORS headers present in responses

### Admin Panel Tests
- [ ] Admin login works
- [ ] Dashboard loads
- [ ] Can approve recipe submissions
- [ ] Can reject recipe submissions
- [ ] Can view reports
- [ ] Chat system works
- [ ] Profile image upload works

### Database Tests
- [ ] New recipes save to database
- [ ] Ratings update correctly
- [ ] Reports save successfully
- [ ] Admin actions persist

---

## 🐛 Troubleshooting

### Common Issues

**Build fails on Vercel**
- Check build logs for specific errors
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `package.json`

**CORS errors in browser console**
- Verify `ALLOWED_ORIGIN` in Railway matches Vercel URL exactly
- Check Railway deployment logs
- Ensure no trailing slash in URLs

**Database connection fails**
- Verify MySQL service is running in Railway
- Check environment variables are set correctly
- Review Railway deployment logs for connection errors

**Images don't upload**
- Check Railway deployment logs
- Verify upload directory permissions in Dockerfile
- Test with smaller image file

**API returns 500 errors**
- Check Railway logs for PHP errors
- Verify database connection
- Check API endpoint exists

---

## 📝 Deployment URLs

Record your deployment URLs for future reference:

| Service | URL | Status |
|---------|-----|--------|
| Railway Backend | `https://__________________.up.railway.app` | ⏳ |
| Vercel Frontend | `https://__________________.vercel.app` | ⏳ |
| Database | Railway MySQL (Private) | ⏳ |

---

## 🎉 Deployment Complete!

Once all checkboxes are marked:
- [ ] Save this checklist as reference
- [ ] Update GitHub README with live URLs
- [ ] Share the frontend URL with users
- [ ] Monitor Railway logs for any issues
- [ ] Set up cost alerts in Railway dashboard

**Estimated Deployment Time**: 30-45 minutes  
**Monthly Cost**: ~$10-15 USD (Railway)

---

**Need Help?** See [DEPLOYMENT_RAILWAY.md](DEPLOYMENT_RAILWAY.md) for detailed instructions.
