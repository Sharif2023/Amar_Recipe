# Railway Deployment - Quick Fix

## ⚠️ Issue: Railway Using Wrong Directory

Railway is trying to deploy from the root directory (`Amar_Recipies_Live`) instead of the `Amar_Recipe` subdirectory where the Dockerfile is located.

## ✅ Solution: Configure Root Directory in Railway

### Option 1: Set Root Directory in Railway Dashboard (RECOMMENDED)

1. Go to your Railway project
2. Click on your web service
3. Go to **Settings** tab
4. Scroll to **Source** section
5. Find **Root Directory** field
6. Set it to: `Amar_Recipe`
7. Click **Save** or **Redeploy**

### Option 2: Set via Environment Variable

In your Railway service **Variables** tab, add:
```
RAILWAY_ROOT_DIRECTORY=Amar_Recipe
```

Then redeploy the service.

### Option 3: Move Files to Root (Alternative)

If the above doesn't work, you can restructure:

**Move these files from `Amar_Recipe/` to root `Amar_Recipies_Live/`:**
- `Dockerfile`
- `railway.json`
- `.dockerignore`

Then update `.dockerignore` and Dockerfile paths accordingly.

---

## 🎯 Quick Fix Steps (Do This Now)

1. **In Railway Dashboard:**
   - Your Service → Settings → Root Directory = `Amar_Recipe`
   - Click outside the field to save
   - Click **Deployments** → **Redeploy** (three dots menu)

2. **Wait for build** (should now use Dockerfile)

3. **Check build logs** - Should see:
   ```
   Building with Dockerfile
   Step 1/10 : FROM php:8.2-apache
   ```

---

## 📸 What You Should See

**Before (current error):**
```
Detected Node
Using npm package manager
No start command was found
```

**After (correct):**
```
Building with Dockerfile
FROM php:8.2-apache
Installing dependencies...
```

---

That's it! The root directory setting tells Railway where to find your Dockerfile.
