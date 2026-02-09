# Quick Start Guide: Railway + Vercel Deployment

## 🎯 What You Need to Do

Your project is now ready for deployment! Follow these 3 simple steps:

### 1️⃣ Push to GitHub (5 minutes)

```bash
cd c:\xampp\htdocs\Amar_Recipies_Live
git add .
git commit -m "Prepare for Railway + Vercel deployment"
git push origin main
```

### 2️⃣ Deploy Backend to Railway (20 minutes)

1. Go to [railway.app](https://railway.app) and sign up
2. Connect your GitHub account
3. Create new project → Deploy from GitHub → Select your repo
4. Add MySQL database service (click "+ New" → Database → MySQL)
5. Go to MySQL service → Data → Query → paste contents of `database/schema.sql`
6. Set environment variable:
   - `ALLOWED_ORIGIN` = (will update after Vercel deployment)

**Copy your Railway URL**: `https://your-project-production.up.railway.app`

### 3️⃣ Deploy Frontend to Vercel (10 minutes)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository
3. Select `Amar_Recipe` as root directory
4. Add environment variables:
   ```
   VITE_API_BASE_URL = https://your-railway-url.up.railway.app/src/api/
   VITE_ADMIN_API_BASE_URL = https://your-railway-url.up.railway.app/admin_api/
   ```
5. Deploy!

**Update Railway**: Go back to Railway → Variables → Update `ALLOWED_ORIGIN` with your Vercel URL

---

## 📚 Detailed Guides

- **[DEPLOYMENT_RAILWAY.md](DEPLOYMENT_RAILWAY.md)** - Complete Railway setup guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[walkthrough.md](C:\Users\Admin\.gemini\antigravity\brain\80b9b135-bfea-4fe1-9625-86c42a956a74\walkthrough.md)** - What was changed

---

## 💰 Cost

Railway: ~$10-15/month (Vercel is free for hobby projects)

---

## ✅ What's Been Prepared

- ✅ Docker container for PHP backend
- ✅ Railway MySQL configuration
- ✅ Environment variable setup
- ✅ Vercel optimization
- ✅ Updated CORS settings
- ✅ Complete documentation
- ✅ Build tested and verified

**You're ready to deploy!** 🚀
