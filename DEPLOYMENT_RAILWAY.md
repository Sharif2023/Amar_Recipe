# Railway Backend Deployment Guide

Complete guide to deploy the Amar Recipe PHP backend to Railway with MySQL database.

## 📋 Prerequisites

- Railway account ([Sign up free](https://railway.app/))
- GitHub account (required for Railway deployment)
- Your existing database data exported from Bytehost (optional, for migration)
- Payment method added to Railway (Railway is a paid service)

## 💰 Cost Estimate

Railway charges based on usage:
- **MySQL Database**: ~$5-10/month
- **Web Service**: ~$5/month
- **Total**: Approximately $10-15/month

You get $5 free credit each month, so actual costs may be lower.

## 🚀 Deployment Steps

### 1. Push Code to GitHub

Ensure your latest code is pushed to your GitHub repository:

```bash
cd c:\xampp\htdocs\Amar_Recipies_Live
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your `Amar_Recipies_ReactJS` repository
6. Railway will detect the Dockerfile automatically

### 3. Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically:
   - Create a MySQL database
   - Generate connection credentials
   - Add environment variables to your project

### 4. Configure Environment Variables

Go to your web service → **Variables** tab and add:

```bash
# CORS Configuration (update with your Vercel URL)
ALLOWED_ORIGIN=https://your-app-name.vercel.app

# Database variables are auto-added by Railway MySQL service:
# DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
# These are automatically populated - don't manually set them
```

> [!IMPORTANT]
> The database variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`) are automatically set by Railway when you add the MySQL service. Railway uses special syntax like `${{MYSQLHOST}}` to reference these values.

### 5. Import Database Schema

1. In Railway dashboard, click on your **MySQL service**
2. Go to **"Data"** tab
3. Click **"Query"** to open SQL console
4. Copy the contents of `database/schema.sql` from your project
5. Paste and execute in the SQL console

Alternatively, use a MySQL client:
1. Click **"Connect"** in your MySQL service
2. Copy the connection string
3. Use MySQL Workbench or another client to connect
4. Import `database/schema.sql`

### 6. Migrate Existing Data (Optional)

If you have existing data from Bytehost:

1. **Export from Bytehost**:
   - Login to Bytehost cPanel
   - Go to phpMyAdmin
   - Select your database
   - Click "Export" → "Quick" → "SQL" → "Go"
   - Save the `.sql` file

2. **Import to Railway**:
   - In Railway MySQL console, paste the exported SQL
   - Or use Railway's data import feature

### 7. Deploy

1. Railway will automatically deploy after detecting changes
2. Wait for build to complete (3-5 minutes)
3. Once deployed, Railway will provide a public URL

Your backend will be available at:
```
https://your-project-name-production.up.railway.app
```

## 🔧 Post-Deployment Configuration

### Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update or add:

```bash
VITE_API_BASE_URL=https://your-project-name-production.up.railway.app/src/api/
VITE_ADMIN_API_BASE_URL=https://your-project-name-production.up.railway.app/admin_api/
```

5. **Redeploy** your Vercel frontend to apply changes

### Update Railway CORS Settings

1. In Railway, go to your web service variables
2. Update `ALLOWED_ORIGIN` to your actual Vercel URL:

```bash
ALLOWED_ORIGIN=https://your-actual-app.vercel.app
```

## ✅ Verification

### Test API Endpoints

Test your Railway backend:

```bash
# Test CORS
curl https://your-project-name-production.up.railway.app/src/api/cors-test.php

# Test get recipes
curl https://your-project-name-production.up.railway.app/src/api/get_recipes.php
```

Expected response: JSON with recipes data

### Test Full Application

1. Visit your Vercel frontend URL
2. Browse recipes (should load from Railway backend)
3. Submit a new recipe
4. Login to admin panel
5. Test image uploads

## 🐛 Troubleshooting

### Build Fails

**Error: Dockerfile not found**
- Solution: Ensure `Dockerfile` is in the root of `Amar_Recipe` directory
- Check Railway's build logs for specific errors

**Error: Database connection failed**
- Solution: Verify MySQL service is running in Railway
- Check that database environment variables are set correctly

### CORS Errors

**Error: "Access-Control-Allow-Origin" header missing**
- Solution: Verify `ALLOWED_ORIGIN` is set in Railway variables
- Make sure it matches your exact Vercel URL (no trailing slash)

### Database Connection Issues

**Error: "Database connection failed"**
- Solution: Check MySQL service is healthy in Railway
- Verify database name matches the one created by Railway
- Review environment variable references in `config.php`

### Upload Directory Permissions

**Error: "Failed to move uploaded file"**
- Solution: Rebuild the Docker container (Railway does this automatically)
- Check Dockerfile has correct permissions for upload directories

## 📊 Monitoring

### View Logs

1. In Railway dashboard, select your web service
2. Click **"Deployments"** tab
3. Click on latest deployment
4. View real-time logs

### Monitor Database

1. Select MySQL service in Railway
2. View **"Metrics"** tab for:
   - CPU usage
   - Memory usage
   - Connection count

### Set Up Alerts

1. Go to project **"Settings"**
2. Configure notifications for:
   - Deployment failures
   - High resource usage
   - Database errors

## 💡 Tips

1. **Environment Variables**: Never commit sensitive data. Always use Railway's variable system.

2. **Database Backups**: Railway doesn't automatically backup databases. Consider:
   - Setting up a cron job to export database
   - Using Railway's snapshot feature (paid tier)

3. **Cost Management**: 
   - Monitor usage in Railway dashboard
   - Set usage alerts
   - Consider hibernation for non-production environments

4. **Performance**:
   - Railway automatically scales based on traffic
   - Monitor response times in deployment logs
   - Optimize database queries as needed

## 🔄 Updating Your Deployment

To deploy updates:

```bash
# Make your changes locally
git add .
git commit -m "Update description"
git push origin main
```

Railway automatically detects GitHub pushes and redeploys.

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Railway MySQL Guide](https://docs.railway.app/databases/mysql)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

## 📞 Support

For Railway-specific issues:
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub Discussions](https://github.com/railwayapp/railway/discussions)

For project issues:
- Check this deployment guide
- Review Railway deployment logs
- Open an issue on GitHub

---

**Deployment Status**: Ready for Railway 🚂  
**Last Updated**: February 2026
