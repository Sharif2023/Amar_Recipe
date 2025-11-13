# Quick Start - Deployment Checklist

## Pre-Deployment Checklist

### Frontend (Vercel)
- [ ] All React components updated to use API config
- [ ] `.env.production` configured with correct API URL
- [ ] Remove all hardcoded localhost URLs
- [ ] Test locally with `npm run build`
- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy and test

### Backend (InfinityFree)
- [ ] All PHP files updated to use `config.php`
- [ ] Database credentials in `config.php` are correct
- [ ] Create MySQL database on InfinityFree
- [ ] Import SQL schema to database
- [ ] Create `/api` folder in htdocs
- [ ] Upload all PHP files to `/api`
- [ ] Create `/api/uploads` folder (chmod 755)
- [ ] Create `/api/admin_dp_uploads` folder (chmod 755)
- [ ] Test API endpoints with curl/Postman

## Deployment Steps Summary

### Step 1: Prepare Frontend
```bash
cd Amar_Recipe
npm install
npm run build
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Vercel
1. Connect GitHub repo to Vercel
2. Set root directory: `Amar_Recipe`
3. Set environment variable: `VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api`
4. Deploy

### Step 4: Upload Backend to InfinityFree
1. FTP into InfinityFree
2. Create `/api` folder in htdocs
3. Upload all files from `src/api/`
4. Create upload directories

### Step 5: Setup Database
1. Create database in InfinityFree
2. Import SQL schema
3. Test connection

### Step 6: Test Everything
```bash
# Test frontend
curl https://your-vercel-url.vercel.app

# Test backend API
curl https://amar-recipes.infinityfreeapp.com/api/get_recipes.php
```

## Important Files Modified

### Frontend
- `Amar_Recipe/src/config/apiConfig.js` - NEW: Central API configuration
- `Amar_Recipe/.env.production` - API URL for production
- `Amar_Recipe/.env.local` - API URL for development
- `Amar_Recipe/src/App.jsx` - Uses environment variables
- `Amar_Recipe/src/Admin/*.jsx` - Updated API calls
- `Amar_Recipe/src/Components/*.jsx` - Updated API calls
- `Amar_Recipe/src/Pages/*.jsx` - Updated API calls
- `Amar_Recipe/package.json` - Updated version

### Backend
- `Amar_Recipe/src/api/config.php` - NEW: Database configuration
- All PHP files in `src/api/` - Updated to use config.php
- `vercel.json` - NEW: Vercel deployment config

### Documentation
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `ADMIN_API_SETUP.md` - Admin API file setup
- `.gitignore` - Git ignore patterns

## Common Issues & Solutions

### Issue: API returns 404
**Solution**: Verify files are in correct folder on InfinityFree. Check exact file names and paths.

### Issue: CORS error
**Solution**: All PHP files have CORS headers. Clear cache and try again.

### Issue: Database not found
**Solution**: Check database exists on InfinityFree. Verify credentials in config.php.

### Issue: Images not uploading
**Solution**: Ensure `/api/uploads/` folder exists and has write permissions (755).

### Issue: Can't login as admin
**Solution**: Verify admin record exists in database. Check password is hashed correctly.

## Contact & Support

For detailed instructions, see:
- `DEPLOYMENT_GUIDE.md` - Full deployment guide
- `Amar_Recipe/README.md` - Development setup

## Environment Variables

### Production (Vercel)
```
VITE_API_URL=https://amar-recipes.infinityfreeapp.com/api
```

### Development (Local)
```
VITE_API_URL=http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api
```

## Database Credentials (InfinityFree)

```
Host: sql102.infinityfree.com
Username: if0_39569251
Password: Sharifcse2025
Database: if0_39569251_amar_recipe
Port: 3306
```

## URLs After Deployment

- **Frontend**: https://amar-recipe.vercel.app (or your custom domain)
- **Backend API**: https://amar-recipes.infinityfreeapp.com/api
- **Admin Login**: https://amar-recipe.vercel.app/adminlogin
- **Main Site**: https://amar-recipe.vercel.app

---

**Status**: ✅ Ready for Deployment
**Last Updated**: November 13, 2025
