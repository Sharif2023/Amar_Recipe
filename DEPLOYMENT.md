# Deployment Guide: Render + Vercel

Complete guide for deploying Amar Recipe to production.

**Stack:**
- **Frontend:** Vercel (free)
- **Backend:** Render (free)
- **Database:** Supabase (free)

**Total Cost:** $0/month

---

## 🚀 Quick Deployment (15 minutes)

### Step 1: Set Up Supabase Database

1. **Sign up:** Go to https://supabase.com and create a new project named `amar-recipe`.
2. **Get Connection String:**
   - Go to **Project Settings** → **Database**.
   - Copy the **URI** connection string.
   - **Direct Connection**: `postgresql://postgres:[YOUR-PASSWORD]@db.iseehucuytvgtpdqupzp.supabase.co:5432/postgres`
   - **Transaction Pooler** (Recommended for Render): `postgresql://postgres.iseehucuytvgtpdqupzp:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
3. **Import Schema:**
   - In Supabase, go to the **SQL Editor**.
   - Click **"New query"**.
   - Copy contents of `Amar_Recipe/database/schema_postgres.sql` from your local files.
   - Paste into the editor and click **Run**.

### Step 2: Deploy Backend to Render

1. **Sign up:** Go to https://render.com and login with GitHub
2. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Select your repository
   - Configure:
     - Name: `amar-recipe-backend`
     - **Root Directory:** `Amar_Recipe`
     - Runtime: **Docker**
     - Instance Type: **Free**
3. **Configure Environment Variables:**
   - Go to the **Environment** tab.
   - Add:
     ```
     DATABASE_URL = postgresql://postgres.iseehucuytvgtpdqupzp:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
     RENDER = true
     ALLOWED_ORIGIN = https://your-app.vercel.app
     ```
   - *Note: Replace `[YOUR-PASSWORD]` in the URI with `amar-recipepostgres`.*

### Step 3: Deploy Frontend to Vercel

1. **Sign up:** Go to https://vercel.com
2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Select your repository
3. **Configure:**
   - **Root Directory:** `Amar_Recipe`
   - Framework: Vite (auto-detected)
4. **Environment Variables:**
   - Add backend URLs:
     ```
     VITE_API_BASE_URL = https://your-render-url.onrender.com/src/api/
     VITE_ADMIN_API_BASE_URL = https://your-render-url.onrender.com/src/api/
     ```
   - Add Supabase details (if needed for future JS SDK use):
     ```
     VITE_SUPABASE_URL = https://iseehucuytvgtpdqupzp.supabase.co
     VITE_SUPABASE_ANON_KEY = sb_publishable_RQrGCRUYSEgMDlzvyG7E0g_Be-0uXS3
     ```
   - Replace `your-render-url` with your actual Render service URL.
     ```
     VITE_API_BASE_URL = https://your-render-url.onrender.com/src/api/
     VITE_ADMIN_API_BASE_URL = https://your-render-url.onrender.com/src/api/
     ```
   - Replace `your-render-url` with your actual Render service URL.
5. **Deploy**

---

### Step 4: Update CORS

1. Go to Render → Your web service → **Environment**
2. Update `ALLOWED_ORIGIN` to your Vercel URL (e.g., `https://your-app.vercel.app`).
3. No trailing slash!
4. Save (auto-redeploys in ~1 minute).

### Step 5: Test Everything!

Visit your Vercel URL and verify:
- ✅ Homepage loads
- ✅ Recipes display
- ✅ Can submit recipes
- ✅ Admin login works
- ✅ No CORS errors (F12 → Console)
- ✅ Results are coming from Supabase

### Step 6: Set Up Email Service (Resend)
*Verification emails are mandatory for this project.*

1. **Sign up:** Go to https://resend.com and create a free account.
2. **Get API Key:**
   - Go to **API Keys** in the dashboard.
   - Click **Create API Key**.
   - Copy the key (it starts with `re_`).
3. **Configure Render:**
   - Go to your Render dashboard → **Environment**.
   - Add new variable: `RESEND_API_KEY` = `your-api-key-here`.
   - Add new variable: `SMTP_FROM_EMAIL` = `onboarding@resend.dev` (or your own domain if configured).
4. **Save Changes:** Render will auto-redeploy.

---

## 🎉 Done!

Your app is live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-render-url.onrender.com
- **Database:** Supabase PostgreSQL

---

---

## 📝 Important Notes

### Free Tier Limitations

**Supabase Free Tier (Database):**
- 500MB database size.
- 5GB bandwidth.
- Project pauses after 1 week of inactivity (can be manually resumed).

**Render Free Tier (Backend):**
- Services **spin down after 15 minutes** of inactivity.
- First request after spin-down takes **~30 seconds** to respond.
- 750 hours/month (sufficient for 24/7).
- 512 MB RAM.

**Vercel Free Tier (Frontend):**
- 100 GB bandwidth/month.
- Unlimited deployments.


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
- Verify all DB environment variables are correct in Render
- Check database is active in Supabase dashboard
- Ensure using the correct transaction pooler or direct URI

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
1. Go to Supabase → **SQL Editor**
2. Execute ALTER TABLE or new schema changes

---

## 💾 Database Backup (Important!)

Supabase provides automated backups for free projects (with some limitations) or you can export manually.

1. Go to Supabase → **Table Editor** or **SQL Editor**
2. Regularly export your data or use the Supabase CLI for backups.
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
