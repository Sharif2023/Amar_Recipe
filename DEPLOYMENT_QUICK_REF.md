# Quick Deployment Reference - Byethost + Vercel

## 🔧 Backend (Byethost) - amar-recipe.byethost7.com

### FTP Details
- **Host**: ftpupload.net
- **Username**: b7_40426674
- **Password**: Sharif2025
- **Port**: 21

### Database Details
- **Host**: sql212.byethost7.com
- **Database**: b7_40426674_amar_recipe
- **Username**: b7_40426674
- **Password**: Sharif2025
- **Port**: 3306

### Files to Upload
```
src/api/*       → /htdocs/src/api/
admin_api/*     → /htdocs/admin_api/
.htaccess       → /htdocs/.htaccess
```

### Create These Directories
```
/htdocs/src/api/uploads/          (755 or 777)
/htdocs/src/api/admin_dp_uploads/ (755 or 777)
```

### Test URLs
- ✅ Get Recipes: https://amar-recipe.byethost7.com/src/api/get_recipes.php
- ✅ Admin Requests: https://amar-recipe.byethost7.com/src/api/admin_requests.php
- ✅ Get Reports: https://amar-recipe.byethost7.com/src/api/get_reports.php

---

## 🚀 Frontend (Vercel)

### Environment Variables
```env
VITE_API_BASE_URL=https://amar-recipe.byethost7.com/src/api/
VITE_ADMIN_API_BASE_URL=https://amar-recipe.byethost7.com/admin_api/
```

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `Amar_Recipe` (if applicable)

### Quick Deploy Commands
```bash
# Local test
cd Amar_Recipe
npm install
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

---

## ⚡ Quick Deployment Steps

### Backend (5 minutes)
1. ✅ Upload PHP files via FTP (FileZilla)
2. ✅ Import `database/schema.sql` in phpMyAdmin
3. ✅ Create `uploads/` and `admin_dp_uploads/` directories
4. ✅ Test: https://amar-recipe.byethost7.com/src/api/get_recipes.php

### Frontend (3 minutes)
1. ✅ Push code to Git
2. ✅ Import project in Vercel dashboard
3. ✅ Set environment variables
4. ✅ Deploy
5. ✅ Test your Vercel URL

---

## 🔍 Common Issues & Quick Fixes

### CORS Error
✅ Check `.htaccess` uploaded  
✅ Verify `config.php` has CORS headers  
✅ Clear browser cache

### Database Connection Failed
✅ Host: `sql212.byethost7.com`  
✅ User: `b7_40426674`  
✅ Password: `Sharif2025`  
✅ Database: `b7_40426674_amar_recipe`

### Images Not Loading
✅ Create `uploads/` directory  
✅ Set permissions to 755 or 777  
✅ Check `API_BASE_URL` correct

### Build Fails
✅ Delete `node_modules`, run `npm install`  
✅ Check all imports correct  
✅ Review Vercel build logs

---

## 📞 Support Links

- **Byethost Support**: https://byet.host/index.php?/support/
- **Vercel Docs**: https://vercel.com/docs
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Updated**: December 18, 2024 | **Version**: 2.0 (Byethost)
