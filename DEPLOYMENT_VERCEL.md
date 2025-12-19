# Vercel Frontend Deployment Guide

Complete guide for deploying the Amar Recipe React frontend to Vercel.

## Prerequisites

- GitHub account (for repository hosting)
- Vercel account (free tier available)
- Node.js 18+ and npm installed locally
- Backend already deployed to Bytehost

## Step 1: Prepare Repository

### 1.1 Initialize Git (if not already done)
```bash
cd Amar_Recipies_Live
git init
git add .
git commit -m "Initial commit - Amar Recipe project"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) and log in
2. Click **New repository**
3. Repository name: `Amar_Recipe` (or your preferred name)
4. Set as **Public** or **Private**
5. **Do NOT** initialize with README (you already have one)
6. Click **Create repository**

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/Amar_Recipe.git
git branch -M main
git push -u origin main
```

> **⚠️ IMPORTANT**: Verify that `.env.production` and `config.php` with credentials are NOT pushed to GitHub. Check your `.gitignore` is working correctly.

## Step 2: Setup Vercel Account

### 2.1 Sign Up / Log In
1. Go to [Vercel](https://vercel.com)
2. Click **Sign Up** (or **Log In**)
3. Choose **Continue with GitHub** for easy integration
4. Authorize Vercel to access your GitHub repositories

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. From Vercel dashboard, click **Add New** → **Project**
2. Select **Import Git Repository**
3. Find and select your `Amar_Recipe` repository
4. Click **Import**

### 3.2 Configure Project Settings

**Framework Preset**: Vercel should auto-detect **Vite**

**Root Directory**: `Amar_Recipe` (the subdirectory containing package.json)
- Click **Edit** next to Root Directory
- Enter: `Amar_Recipe`

**Build Settings** (usually auto-configured):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3.3 Configure Environment Variables

Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://amar-recipe.byethost7.com/src/api/` |
| `VITE_ADMIN_API_BASE_URL` | `https://amar-recipe.byethost7.com/admin_api/` |

> **📝 Note**: Replace with your actual Bytehost domain

**Environment**: Select **Production**, **Preview**, and **Development** for each variable

### 3.4 Deploy
1. Click **Deploy**
2. Wait for build to complete (usually 1-3 minutes)
3. Once complete, you'll see: ✅ **Deployment Ready**

## Step 4: Access Your Application

### 4.1 Get Deployment URL
Vercel provides:
- **Production URL**: `https://your-project.vercel.app`
- **Deployment URL**: Unique URL for each deployment

### 4.2 Test Application
1. Click **Visit** to open your deployed app
2. Test the following:
   - ✅ Homepage loads
   - ✅ Recipes display correctly
   - ✅ Admin login works
   - ✅ Image uploads work
   - ✅ No CORS errors in browser console

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain
1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Enter your custom domain
4. Follow Vercel's DNS configuration instructions

### 5.2 Update Backend CORS
If using custom domain, update `config.php` on Bytehost:
```php
header('Access-Control-Allow-Origin: https://your-custom-domain.com');
```

## Step 6: Automatic Deployments

### 6.1 Enable Auto-Deploy
Vercel automatically deploys when you push to GitHub:
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically build and deploy the changes.

### 6.2 Preview Deployments
- **Main branch** → Production deployment
- **Other branches** → Preview deployments
- Each pull request gets its own preview URL

## Alternative: Deploy Using Vercel CLI

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login
```bash
vercel login
```

### Deploy from Project Directory
```bash
cd Amar_Recipies_Live/Amar_Recipe
vercel
```

Follow the prompts:
- Setup and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- Project name? `amar-recipe`
- Directory? `./` (you're already in Amar_Recipe)
- Override settings? **N**

### Deploy to Production
```bash
vercel --prod
```

## Troubleshooting

### Build Fails

**Check `package.json` location**:
- Verify Root Directory is set to `Amar_Recipe` in Vercel

**Check build logs**:
- Click on failed deployment → View build logs
- Look for missing dependencies or errors

**Fix locally first**:
```bash
cd Amar_Recipe
npm install
npm run build
```

### Environment Variables Not Working

**Verify variable names**:
- Must start with `VITE_` for Vite projects
- Check spelling matches exactly

**Redeploy after adding variables**:
- Settings → Environment Variables → Add → Redeploy

### CORS Errors After Deployment

**Check backend CORS settings**:
- Update `config.php` to allow your Vercel domain
- Verify `.htaccess` is uploaded to Bytehost

**Clear browser cache**:
```bash
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

### Images Not Loading

**Check image paths**:
- Verify images are uploaded to Bytehost
- Check `BASE_URL` in backend `config.php`

**Check upload directory permissions**:
- Folders must be writable (755 or 777)

## Deployment Checklist

Before marking deployment complete:

- [ ] Frontend builds successfully
- [ ] No console errors on homepage
- [ ] Recipes load correctly from backend
- [ ] Admin panel accessible
- [ ] Admin login works
- [ ] Recipe submission works
- [ ] Image uploads work
- [ ] Recipe rating works
- [ ] Reporting works
- [ ] Mobile responsive design works

## Managing Deployments

### View Deployments
1. Go to Vercel dashboard
2. Click your project
3. **Deployments** tab shows all deployments

### Rollback to Previous Version
1. Find working deployment
2. Click **...** → **Promote to Production**

### Delete Old Deployments
1. Click deployment
2. **...** → **Delete**

## Environment-Specific Configurations

### Production
- Uses `.env.production` values (via Vercel environment variables)
- Minified build
- Source maps disabled

### Preview (Staging)
- Useful for testing before production
- Can set different environment variables
- Automatic preview for pull requests

### Development
Local development only:
- Uses `.env.local`
- Hot module replacement
- Full error messages

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (if desired)
3. ✅ Configure analytics (Vercel Analytics available)
4. ✅ Set up monitoring
5. ✅ Create backup workflow

---

**Need Help?**
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)
- Check Vercel deployment logs for errors
