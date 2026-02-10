# Deployment Guide: Render + Vercel

Complete guide for deploying Amar Recipe to production.

**Stack:**
- **Frontend:** Vercel (free)
- **Backend:** Render (free)
- **Database:** Render PostgreSQL (free)

**Total Cost:** $0/month

---

## 🚀 Quick Deployment (15 minutes)

### Step 1: Deploy Backend to Render

1. **Sign up:** Go to https://render.com and login with GitHub
2. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Select your repository
   - Configure:
     - Name: `amar-recipe-backend`
     - Region: Choose closest
     - Branch: `main`
     - **Root Directory:** `Amar_Recipe`
     - Runtime: **Docker**
     - Instance Type: **Free**
3. **Create PostgreSQL Database:**
   - In your Render dashboard, click **"New +"** → **"PostgreSQL"**
   - Name: `amar-recipe-db`
   - Database: `amar_recipe`
   - Plan: **Free**
   - Click **"Create Database"**
4. **Link Database to Web Service:**
   - Go back to your web service → **Environment** tab
   - Click **"Add Environment Variable"**
   - Add these (use values from your PostgreSQL database):
     ```
     DB_HOST = <Internal Database URL from PostgreSQL>
     DB_PORT = 5432
     DB_USER = <from PostgreSQL>
     DB_PASS = <from PostgreSQL>
     DB_NAME = amar_recipe
     RENDER = true
     ALLOWED_ORIGIN = *
     ```
5. **Import Schema:**
   - Go to your PostgreSQL database → **"Query"** tab
   - Copy contents of `Amar_Recipe/database/schema_postgres.sql`
   - Paste and **Execute**
6. **Wait for deployment** (~3-5 minutes)
7. **Copy your Render URL:** `https://amar-recipe-backend.onrender.com`

### Step 2: Test Backend

Open: `https://your-render-url.onrender.com/src/api/get_recipes.php`

Should see: `[]` or recipe JSON data

### Step 3: Deploy Frontend to Vercel

1. **Sign up:** Go to https://vercel.com
2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Select your repository
3. **Configure:**
   - **Root Directory:** `Amar_Recipe`
   - Framework: Vite (auto-detected)
4. **Environment Variables:**
   - Add:
     ```
     VITE_API_BASE_URL = https://your-render-url.onrender.com/src/api/
     VITE_ADMIN_API_BASE_URL = https://your-render-url.onrender.com/admin_api/
     ```
   - Replace `your-render-url` with your actual Render URL
   - Keep the trailing slashes!
5. **Deploy** (2-3 minutes)
6. **Copy your Vercel URL:** `https://your-app.vercel.app`

### Step 4: Update CORS

1. Go to Render → Your web service → **Environment**
2. Update `ALLOWED_ORIGIN` to your Vercel URL:
   ```
   ALLOWED_ORIGIN = https://your-app.vercel.app
   ```
3. No trailing slash!
4. Save (auto-redeploys in ~1 minute)

### Step 5: Test Everything!

Visit your Vercel URL and verify:
- ✅ Homepage loads
- ✅ Recipes display
- ✅ Can submit recipes
- ✅ Admin login works
- ✅ No CORS errors (F12 → Console)

---

## 🎉 Done!

Your app is live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-render-url.onrender.com
- **Database:** Render PostgreSQL

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services **spin down after 15 minutes** of inactivity
- First request after spin-down takes **~30 seconds** to respond
- 750 hours/month (sufficient for 24/7)
- 512 MB RAM

**Render PostgreSQL Free Tier:**
- 1 GB storage
- 90-day expiration (backup your data!)
- 97 connection limit

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments

### Local Development

Your local setup still uses MySQL! The code auto-detects:
- **Production (Render):** Uses PostgreSQL
- **Local:** Uses MySQL

No changes needed to your local database.

---

## 🐛 Troubleshooting

### Backend Build Fails
- Check Render build logs
- Verify Root Directory is `Amar_Recipe`
- Ensure Dockerfile exists in repository

### Database Connection Error
- Verify all DB environment variables are correct
- Check database is running in Render dashboard
- Ensure using internal database URL (not external)

### Frontend Can't Connect to Backend
- Check environment variables have correct Render URL
- Ensure trailing slashes in API URLs
- Verify backend is running (not spun down)

### CORS Errors
- Ensure `ALLOWED_ORIGIN` matches Vercel URL exactly
- No trailing slash in `ALLOWED_ORIGIN`
- Clear browser cache

### 500 Error on API
- Check Render service logs
- Verify database connection
- Check schema was imported correctly

---

## 🔄 Updating Your App

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys (or manual redeploy)

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys

### Update Database Schema
1. Go to Render PostgreSQL → Query tab
2. Execute ALTER TABLE or new schema changes

---

## 💾 Database Backup (Important!)

Render free PostgreSQL expires after 90 days. **Back up your data regularly!**

1. Go to Render PostgreSQL → **Backups** tab
2. Download backup file
3. Store safely

---

## 📞 Need Help?

Common issues:
- **Slow first load:** Normal for free tier (spin-down)
- **Connection timeout:** Database might be asleep, retry
- **Build fails:** Check logs for specific error

For more help, check:
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
