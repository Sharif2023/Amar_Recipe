# Render Deployment - Quick Start Checklist

Follow these steps in order. Check off each one as you complete it.

## ☑️ Step 1: Set Up Database (PlanetScale) - 5 minutes

- [ ] Go to https://planetscale.com and sign up/login
- [ ] Click **"Create database"**
  - Name: `amar-recipe-db`
  - Region: Choose closest to you
  - Plan: **Hobby (Free)**
- [ ] Click **"Create database"**
- [ ] Wait for database to initialize (~1 minute)
- [ ] Click **"Connect"** button
- [ ] Select **"General"** from dropdown
- [ ] **COPY** these connection details (you'll need them):
  ```
  Host: _______________________________
  Username: ___________________________
  Password: ___________________________
  Database: amar-recipe-db
  Port: 3306
  ```
- [ ] Click **"Console"** tab
- [ ] Open file: `c:\xampp\htdocs\Amar_Recipies_Live\Amar_Recipe\database\schema.sql`
- [ ] Copy ALL contents of schema.sql
- [ ] Paste into PlanetScale console
- [ ] Click **"Execute"** or **"Run"**
- [ ] Verify tables created (should see: users, recipes, categories, etc.)

---

## ☑️ Step 2: Deploy Backend (Render) - 5 minutes

- [ ] Go to https://render.com and sign up/login with GitHub
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Find and select your repository (should see it in the list)
- [ ] Configure service:
  - **Name:** `amar-recipe-backend`
  - **Region:** (choose closest)
  - **Branch:** `main`
  - **Root Directory:** `Amar_Recipe`
  - **Runtime:** Docker
  - **Instance Type:** Free
- [ ] Click **"Advanced"** to add environment variables
- [ ] Add these variables (use your PlanetScale details from Step 1):
  ```
  DB_HOST = <your-planetscale-host>
  DB_PORT = 3306
  DB_USER = <your-planetscale-username>
  DB_PASS = <your-planetscale-password>
  DB_NAME = amar-recipe-db
  ALLOWED_ORIGIN = *
  ```
- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (3-5 minutes) - watch the build logs
- [ ] Deployment shows **"Live"** (green)
- [ ] **COPY your Render URL:**
  ```
  https://_________________________________.onrender.com
  ```

---

## ☑️ Step 3: Test Backend - 1 minute

- [ ] Open in browser: `https://your-render-url.onrender.com/src/api/get_recipes.php`
- [ ] Should see JSON: `[]` or recipe data
- [ ] ✅ Backend is working!

---

## ☑️ Step 4: Deploy Frontend (Vercel) - 3 minutes

- [ ] Go to https://vercel.com and login
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Find your repository and click **"Import"**
- [ ] Configure:
  - **Root Directory:** Click Edit → Enter `Amar_Recipe`
  - **Framework Preset:** Vite (should auto-detect)
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
- [ ] Click **"Environment Variables"** section
- [ ] Add variable 1:
  ```
  Name: VITE_API_BASE_URL
  Value: https://your-render-url.onrender.com/src/api/
  ```
  ⚠️ Replace `your-render-url` with your actual Render URL
  ⚠️ Keep the `/src/api/` at the end!
  
- [ ] Add variable 2:
  ```
  Name: VITE_ADMIN_API_BASE_URL
  Value: https://your-render-url.onrender.com/admin_api/
  ```
  ⚠️ Replace `your-render-url` with your actual Render URL
  ⚠️ Keep the `/admin_api/` at the end!

- [ ] Click **"Deploy"**
- [ ] Wait for deployment (2-3 minutes)
- [ ] **COPY your Vercel URL:**
  ```
  https://_________________________________.vercel.app
  ```

---

## ☑️ Step 5: Update CORS - 1 minute

- [ ] Go back to **Render** → Your service → **Environment** tab
- [ ] Find `ALLOWED_ORIGIN` variable
- [ ] Change from `*` to your Vercel URL (exact copy):
  ```
  https://your-app.vercel.app
  ```
  ⚠️ No trailing slash!
- [ ] Click **"Save Changes"**
- [ ] Render will auto-redeploy (~1 minute)

---

## ☑️ Step 6: Test Complete App! - 2 minutes

- [ ] Visit your Vercel URL in browser
- [ ] Homepage loads correctly
- [ ] Can browse recipes
- [ ] Can submit a recipe
- [ ] Admin login works
- [ ] No errors in browser console (press F12)

---

## 🎉 Done!

Your app is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-render-url.onrender.com
- **Database:** PlanetScale (5GB free)

**Total cost:** $0/month! 🎉

---

## 🐛 If Something Goes Wrong

**Backend doesn't deploy:**
- Check Render build logs for errors
- Verify Root Directory is `Amar_Recipe`
- Ensure Dockerfile exists in repo

**Backend returns errors:**
- Verify all environment variables are set correctly
- Check database connection details from PlanetScale

**Frontend-backend connection fails:**
- Check environment variables have correct Render URL
- Ensure `ALLOWED_ORIGIN` in Render matches Vercel URL exactly

**CORS errors:**
- Make sure `ALLOWED_ORIGIN` has no trailing slash
- Match Vercel URL exactly

---

## 📞 Need Help?

Let me know which step you're stuck on and what error you're seeing!
