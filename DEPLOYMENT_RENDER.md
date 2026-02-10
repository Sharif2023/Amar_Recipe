# Render Backend Deployment Guide

## 🚀 Quick Start

Render.com offers better PHP Docker support than Railway and has a generous free tier.

**Estimated time:** 15 minutes  
**Cost:** Free tier available (sufficient for this project)

---

## 📋 Prerequisites

- GitHub account with your code pushed
- Render.com account (sign up at https://render.com)
- MySQL database (Render doesn't offer managed MySQL on free tier, so we'll use PlanetScale free tier)

---

## 🗄️ Step 1: Set Up Database (PlanetScale)

### Create Database

1. Go to https://planetscale.com and sign up
2. Click **"Create database"**
3. Database name: `amar-recipe-db`
4. Region: Choose closest to you
5. Plan: **Hobby (Free)**
6. Click **"Create database"**

### Get Connection Details

1. In your database dashboard, click **"Connect"**
2. Select **"General"** from framework dropdown
3. Copy the connection details:
   - Host
   - Username
   - Password
   - Database name
   - Port (usually 3306)

### Import Schema

1. Click **"Console"** tab in PlanetScale
2. Open `c:\xampp\htdocs\Amar_Recipies_Live\Amar_Recipe\database\schema.sql`
3. Copy all contents
4. Paste into PlanetScale console
5. Click **"Execute"**

---

## 🐳 Step 2: Deploy Backend to Render

### Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### Configure Service

**Service settings:**
- **Name:** `amar-recipe-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `Amar_Recipe`
- **Runtime:** `Docker`
- **Instance Type:** `Free`

### Environment Variables

Click **"Advanced"** and add these variables:

```
DB_HOST=<your-planetscale-host>
DB_PORT=3306
DB_USER=<your-planetscale-username>
DB_PASS=<your-planetscale-password>
DB_NAME=<your-planetscale-database>
ALLOWED_ORIGIN=*
```

Replace `<your-planetscale-...>` with your actual PlanetScale connection details.

### Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy (takes 3-5 minutes)
3. Watch build logs for any errors

---

## ✅ Step 3: Test Backend

Once deployment shows **"Live"**:

1. Copy your Render URL (e.g., `https://amar-recipe-backend.onrender.com`)
2. Test in browser:
   ```
   https://your-render-url.onrender.com/src/api/get_recipes.php
   ```
3. You should see JSON response (empty array or recipe data)

---

## 🎨 Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. **Root Directory:** `Amar_Recipe`
5. **Framework:** Vite
6. **Environment Variables:**
   - `VITE_API_BASE_URL` = `https://your-render-url.onrender.com/src/api/`
   - `VITE_ADMIN_API_BASE_URL` = `https://your-render-url.onrender.com/admin_api/`
7. Click **"Deploy"**

---

## 🔄 Step 5: Update CORS

After Vercel deploys:

1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Go back to Render → Your service → **Environment**
3. Update `ALLOWED_ORIGIN` to your Vercel URL:
   ```
   ALLOWED_ORIGIN=https://your-app.vercel.app
   ```
4. Save (Render will auto-redeploy)

---

## 🎉 Done!

Your app is now live:
- **Frontend:** Vercel URL
- **Backend:** Render URL
- **Database:** PlanetScale

---

## 🐛 Troubleshooting

### Build Fails on Render
- Check build logs for errors
- Verify Dockerfile exists in `Amar_Recipe/` folder
- Ensure Root Directory is set correctly

### Backend Returns Errors
- Check environment variables are set correctly
- Verify database connection details
- Check Render service logs

### CORS Errors
- Ensure `ALLOWED_ORIGIN` in Render matches your Vercel URL exactly
- No trailing slash in ALLOWED_ORIGIN

---

## 💰 Cost Breakdown

- **Render Web Service:** Free (750 hours/month)
- **PlanetScale Database:** Free (1 database, 5GB storage)
- **Vercel Frontend:** Free (hobby tier)
- **Total:** $0/month! 🎉

---

## 📊 Free Tier Limits

**Render Free Tier:**
- 750 hours/month (enough for 24/7 uptime)
- Services spin down after 15 min inactivity
- First request after spin-down takes ~30 seconds

**PlanetScale Free Tier:**
- 1 database
- 5 GB storage
- 1 billion row reads/month
- 10 million row writes/month

Perfect for development and small production apps!
