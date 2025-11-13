# 🎨 Deployment Architecture & Visual Guides

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         END USER                                │
│                      (Browser/Client)                           │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTPS (Encrypted)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────────┐  ┌─────────────────┐  ┌──────────────┐
│  Vercel CDN      │  │  Vercel Region  │  │ Vercel Logs  │
│  (Global)        │  │  (Closest to    │  │              │
│                  │  │   User)         │  │              │
│  amar-recipe.    │  │                 │  │              │
│  vercel.app      │  │  Servers:       │  │ Deployment   │
│                  │  │  - Node.js      │  │ Monitoring   │
│  Serves:         │  │  - Build Node   │  │              │
│  - index.html    │  │  - Runtime      │  │              │
│  - JS bundles    │  │                 │  │              │
│  - CSS files     │  │                 │  │              │
│  - Images        │  │                 │  │              │
│  - Assets        │  │                 │  │              │
└──────────────────┘  └─────────────────┘  └──────────────┘
        │                    │
        └────────────────────┼─────────────────────┬──────────┐
                             │                     │          │
              ┌──────────────┴──────────────┐      │          │
              │                             │      │          │
              │  GitHub Repository          │      │          │
              │  (Sharif2023/Amar_Recipe)   │      │          │
              │                             │      │          │
              │  Triggers:                  │      │          │
              │  - Vercel builds on push    │      │          │
              │  - Auto-deploy to Vercel    │      │          │
              │                             │      │          │
              └─────────────────────────────┘      │          │
                                                   │          │
                         API Calls ───────────────┴──────────┤
                        (CORS enabled)                        │
                                                              │
        ┌─────────────────────────────────────────────────────┴─────┐
        │                                                            │
        │              InfinityFree Hosting                          │
        │           amar-recipes.infinityfreeapp.com               │
        │                                                            │
        │  ┌──────────────────────────────────────────────────┐    │
        │  │                 /htdocs/ Folder                  │    │
        │  │                                                  │    │
        │  │  ┌──────────────────────────────────────────┐   │    │
        │  │  │            /api/ Directory               │   │    │
        │  │  │                                          │   │    │
        │  │  │  config.php ..................┐          │   │    │
        │  │  │  admin_login.php           │          │   │    │
        │  │  │  get_recipes.php           │          │   │    │
        │  │  │  submit_recipe.php         │ 26 PHP   │   │    │
        │  │  │  approve_submission.php    │ API      │   │    │
        │  │  │  delete_recipe.php         │ Files    │   │    │
        │  │  │  rate_recipe.php           │          │   │    │
        │  │  │  ... (18 more .php files)  │          │   │    │
        │  │  │                            │          │   │    │
        │  │  │  ┌─────────────────────┐  │          │   │    │
        │  │  │  │ /uploads/           │  │          │   │    │
        │  │  │  │ (Recipe images)     │  │          │   │    │
        │  │  │  └─────────────────────┘  │          │   │    │
        │  │  │                            │          │   │    │
        │  │  │  ┌─────────────────────┐  │          │   │    │
        │  │  │  │ /admin_dp_uploads/  │  │          │   │    │
        │  │  │  │ (Admin profile pics)│  │          │   │    │
        │  │  │  └─────────────────────┘  │          │   │    │
        │  │  │                            └──────────┘   │    │
        │  │  └────────────────────────────────────────────┘   │    │
        │  │                       ▲                            │    │
        │  │                       │ All require()              │    │
        │  │                       │ config.php                │    │
        │  └───────────────────────┼────────────────────────────┘    │
        │                          │                                 │
        │  ┌───────────────────────┼────────────────────────────┐    │
        │  │  PHP Configuration    │                            │    │
        │  │  (Inside config.php)  │                            │    │
        │  │                       ▼                            │    │
        │  │  Environment Check                                 │    │
        │  │  ├─ ENVIRONMENT=production?                        │    │
        │  │  │  └─ Use InfinityFree MySQL Credentials          │    │
        │  │  │     (sql102.infinityfree.com)                   │    │
        │  │  │                                                 │    │
        │  │  └─ ENVIRONMENT=development?                       │    │
        │  │     └─ Use localhost MySQL                         │    │
        │  └─────────────────────────────────────────────────────┘    │
        │                          │                                 │
        └──────────────────────────┼─────────────────────────────────┘
                                   │
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   MySQL Server           │
                    │  (sql102.               │
                    │   infinityfree.com)      │
                    │                          │
                    │  Database:               │
                    │  if0_39569251_           │
                    │  amar_recipe             │
                    │                          │
                    │  Tables:                 │
                    │  • admins                │
                    │  • recipes               │
                    │  • ratings               │
                    │  • reports               │
                    │  • messages              │
                    │  • activity_history      │
                    │  • submission_requests   │
                    │                          │
                    │  Charset:                │
                    │  utf8mb4                 │
                    │  (Bengali support)       │
                    │                          │
                    │  Backups:                │
                    │  Monthly via             │
                    │  phpMyAdmin              │
                    └──────────────────────────┘
```

---

## Data Flow Diagram

### Request Flow (Frontend → Backend → Database)

```
USER INTERACTION
       │
       │ Clicks button / Submits form
       │
       ▼
┌─────────────────────────────────────┐
│    React Component (Frontend)        │
│    - AdminPanel.jsx                 │
│    - BrowseRecipe.jsx               │
│    - SubmitRecipe.jsx               │
└────────────────────┬────────────────┘
                     │
                     │ Makes API call using:
                     │ fetch() or axios
                     │ import { API_CONFIG }
                     │ from 'src/config/apiConfig.js'
                     │
                     ▼
        ┌────────────────────────┐
        │  apiConfig.js          │
        │  BASE_URL: (from env)  │
        │  Endpoints: (defined)  │
        └────────────────────────┘
                     │
                     │ Constructs URL:
                     │ https://amar-recipes.
                     │ infinityfreeapp.com/api/
                     │ + endpoint path
                     │
                     ▼
┌─────────────────────────────────────┐
│  HTTPS Request → InfinityFree       │
│  Headers: Content-Type: application │
│           json                      │
│           Access-Control-Allow-*    │
│  Body: JSON data (if POST)          │
└────────────────────┬────────────────┘
                     │
                     ▼
         InfinityFree Web Server
         (Apache/Nginx)
                     │
                     ▼
        ┌────────────────────┐
        │  PHP Endpoint      │
        │  (e.g., get_       │
        │   recipes.php)     │
        └────────────────────┘
                     │
                     │ require_once('config.php')
                     │
                     ▼
        ┌────────────────────┐
        │  config.php        │
        │  Checks:           │
        │  ENVIRONMENT var   │
        │  (production)      │
        │  Connects to:      │
        │  sql102.infinityfree.com
        │  User: if0_39569251
        │  Pass: Sharifcse2025
        │  DB: if0_39569251_
        │       amar_recipe
        └────────────────────┘
                     │
                     │ $conn created successfully
                     │
                     ▼
        ┌────────────────────┐
        │  Execute Query     │
        │  $query =          │
        │  "SELECT * FROM    │
        │   recipes ..."     │
        │  $result =         │
        │  $conn->query()    │
        └────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │   MySQL Database         │
         │  if0_39569251_amar_recipe│
         │                          │
         │  Executes query,         │
         │  retrieves data          │
         └──────────────┬───────────┘
                        │
                        ▼
        ┌────────────────────┐
        │  Build Response    │
        │  $response = array(│
        │   'success' =>true │
        │   'data' =>[]      │
        │  );                │
        │  echo json_        │
        │  encode($response);│
        └────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────┐
│  JSON Response (via HTTPS)           │
│  {                                   │
│    "success": true,                  │
│    "data": [                         │
│      { id: 1, title: "Recipe"...},   │
│      { id: 2, title: "Recipe"...}    │
│    ]                                 │
│  }                                   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  React Component receives JSON       │
│  - Parse response                    │
│  - setState(data)                    │
│  - Re-render with new data           │
└──────────────────┬───────────────────┘
                   │
                   ▼
            ┌─────────────────┐
            │  Updated UI     │
            │  Shows recipes  │
            │  to user        │
            └─────────────────┘
                   │
                   ▼
              ✅ SUCCESS
```

---

## Deployment Pipeline Diagram

```
LOCAL DEVELOPMENT
      │
      │ Developer makes changes
      │
      ▼
┌──────────────────────────────┐
│  Local Machine               │
│  c:\xampp\htdocs\...         │
│                              │
│  Tests:                      │
│  npm run dev      ✓          │
│  npm run build    ✓          │
│  npm run lint     ✓          │
└──────────────┬───────────────┘
               │
               │ git add .
               │ git commit -m "message"
               │ git push origin main
               │
               ▼
       ┌──────────────────────┐
       │  GitHub Repository   │
       │  Sharif2023/         │
       │  Amar_Recipe         │
       │  (main branch)       │
       └──────────────┬───────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          │                       │
          ▼                       ▼
  ┌───────────────┐       ┌─────────────────┐
  │  Vercel       │       │  Manual Upload  │
  │  (Automatic)  │       │  to InfinityFree│
  │               │       │  (Manual)       │
  │ Triggers:     │       │                 │
  │ • git push    │       │ Upload via:     │
  │ • Webhook     │       │ • FileZilla FTP │
  │ • API         │       │ • Web File Mgr  │
  │               │       │ • Git pull      │
  └───────┬───────┘       └────────┬────────┘
          │                        │
          │ npm install            │
          │ npm run build          │ Place files in:
          │ Creates /dist/         │ /htdocs/api/
          │                        │
          ▼                        ▼
  ┌──────────────────────────────────────┐
  │         Frontend (Vercel)            │
  │    amar-recipe.vercel.app            │
  │                                      │
  │    /dist/ files deployed:            │
  │    • index.html                      │
  │    • assets/main.[hash].js           │
  │    • assets/styles.[hash].css        │
  │    • images, fonts, etc.             │
  │                                      │
  │    ✅ Live & Accessible             │
  └──────────────────────────────────────┘
          │                       │
          │ (API calls to)        │ (Backend is)
          │                       │
          ▼                       ▼
  ┌──────────────────────────────────────┐
  │      Backend (InfinityFree)          │
  │   amar-recipes.infinityfreeapp.com   │
  │                                      │
  │    /htdocs/api/ files deployed:      │
  │    • config.php                      │
  │    • admin_login.php                 │
  │    • get_recipes.php                 │
  │    • ... (26 total endpoints)        │
  │    • /uploads/ (recipe images)       │
  │    • /admin_dp_uploads/ (profiles)   │
  │                                      │
  │    ✅ Live & Accessible             │
  └──────────────────────────────────────┘
          │                       │
          │ (Queries)             │
          └───────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │   MySQL Database     │
         │ sql102.infinityfree  │
         │ .com                 │
         │                      │
         │ if0_39569251_        │
         │ amar_recipe          │
         │                      │
         │ ✅ Live & Accessible│
         └──────────────────────┘
                      │
                      ▼
               ✅ FULL STACK LIVE
         (Frontend + Backend + DB)
```

---

## File Structure Diagram

```
Amar_Recipe Project
│
├── 📁 src/
│   ├── 📁 api/                     ← Backend PHP APIs
│   │   ├── config.php              ← Database connection
│   │   ├── admin_login.php
│   │   ├── admin_signup.php
│   │   ├── admin_delete.php
│   │   ├── admin_requests.php
│   │   ├── admin_req_reject.php
│   │   ├── admin_get_messages.php
│   │   ├── admin_send_message.php
│   │   ├── get_recipes.php
│   │   ├── get_reports.php
│   │   ├── get_submission_requests.php
│   │   ├── approve_submission.php
│   │   ├── reject_submission.php
│   │   ├── submit_recipe.php
│   │   ├── submit_recipe_request.php
│   │   ├── update_recipe.php
│   │   ├── delete_recipe.php
│   │   ├── rate_recipe.php
│   │   ├── report_recipe.php
│   │   ├── check_user_rating.php
│   │   ├── change_password.php
│   │   ├── delete_account.php
│   │   ├── update_admin_profile.php
│   │   ├── update_admin_status.php
│   │   ├── get_admin_activity_history.php
│   │   ├── get_submission_count.php
│   │   ├── get_submission_history.php
│   │   ├── get_report_count.php
│   │   ├── update_report_status.php
│   │   ├── delete_report.php
│   │   ├── 📁 uploads/             ← Recipe images
│   │   └── 📁 admin_dp_uploads/    ← Admin profile pics
│   │
│   ├── 📁 config/
│   │   └── apiConfig.js            ← API endpoints configuration
│   │
│   ├── 📁 Components/              ← React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── BrowseRecipe.jsx
│   │   ├── RecipeModal.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── AdminFooter.jsx
│   │   └── ...
│   │
│   ├── 📁 Pages/                   ← React pages
│   │   ├── About.jsx
│   │   ├── SubmitRecipe.jsx
│   │   └── ...
│   │
│   ├── 📁 Admin/                   ← Admin dashboard
│   │   ├── AdminLogin.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── AdminProfile.jsx
│   │   ├── AdminManagement.jsx
│   │   ├── SubmissionRequest.jsx
│   │   ├── Reports.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── HistoryDropdown.jsx
│   │   ├── ChatModal.jsx
│   │   ├── AdminViewRecipeModal.jsx
│   │   └── ...
│   │
│   ├── 📁 assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── ...
│   │
│   ├── App.jsx                     ← Main React app
│   ├── main.jsx                    ← Entry point
│   └── index.css                   ← Global styles
│
├── 📄 package.json                 ← Node dependencies
├── 📄 vite.config.js               ← Vite build config
├── 📄 vercel.json                  ← Vercel deployment config
├── 📄 tailwind.config.js           ← Tailwind CSS config
├── 📄 eslint.config.js             ← ESLint rules
├── 📄 index.html                   ← HTML template
│
├── .env.production                 ← Production env vars
├── .env.local                      ← Development env vars
├── .env.example                    ← Env vars template
├── .gitignore                      ← Git ignore rules
│
└── 📚 Documentation/
    ├── DEPLOYMENT_CHECKLIST.md                    (566 lines)
    ├── DEPLOYMENT_COMPLETE_GUIDE.md               (797 lines)
    ├── DEPLOYMENT_QUICK_REFERENCE.md              (299 lines)
    ├── README_DEPLOYMENT_DOCS.md                  (373 lines)
    ├── DEPLOYMENT_DOCUMENTATION_SUMMARY.md        (507 lines)
    └── This file (Architecture Diagrams)
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────┐
│            Amar Recipes Application Stack            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         FRONTEND (Browser/Client)           │  │
│  │                                             │  │
│  │  React 19.1.0                              │  │
│  │  └─ React components (UI)                  │  │
│  │  └─ State management (useState, etc.)      │  │
│  │  └─ Hooks (useEffect, useContext, etc.)    │  │
│  │                                             │  │
│  │  React Router DOM 7.6.0                    │  │
│  │  └─ Client-side routing                    │  │
│  │  └─ Page navigation                        │  │
│  │                                             │  │
│  │  Vite 6.3.5 (Build Tool)                   │  │
│  │  └─ Fast development server                │  │
│  │  └─ Optimized production builds            │  │
│  │  └─ ES modules support                     │  │
│  │                                             │  │
│  │  Tailwind CSS 4.1.7 (Styling)              │  │
│  │  └─ Utility-first CSS framework            │  │
│  │  └─ Responsive design                      │  │
│  │  └─ Pre-built components                   │  │
│  │                                             │  │
│  │  React Icons 5.5.0 (Icons)                 │  │
│  │  └─ SVG icons collection                   │  │
│  │  └─ Easy integration                       │  │
│  │                                             │  │
│  │  Axios or Fetch API (HTTP Requests)        │  │
│  │  └─ API calls to backend                   │  │
│  │  └─ JSON request/response                  │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│           ▼ (via HTTP/HTTPS)                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         BACKEND (Server-side)               │  │
│  │                                             │  │
│  │  PHP 7.4+ (Server Language)                │  │
│  │  └─ Server-side scripts                    │  │
│  │  └─ Request processing                     │  │
│  │  └─ Business logic                         │  │
│  │  └─ Database queries                       │  │
│  │                                             │  │
│  │  MySQLi (Database Extension)               │  │
│  │  └─ MySQL object-oriented interface        │  │
│  │  └─ Prepared statements                    │  │
│  │  └─ Connection pooling                     │  │
│  │  └─ Error handling                         │  │
│  │                                             │  │
│  │  Apache Web Server (HTTP Server)           │  │
│  │  └─ Serves .php files                      │  │
│  │  └─ Handles CORS headers                   │  │
│  │  └─ File serving                           │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│           ▼ (via Database Protocol)               │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         DATABASE (Data Storage)             │  │
│  │                                             │  │
│  │  MySQL 5.7+ (Relational Database)          │  │
│  │  └─ Structured data storage                │  │
│  │  └─ ACID compliance                        │  │
│  │  └─ Multi-table relationships              │  │
│  │  └─ Indexing for performance               │  │
│  │  └─ Charset: utf8mb4 (Bengali support)     │  │
│  │                                             │  │
│  │  Tables:                                    │  │
│  │  ├─ admins (Admin users)                   │  │
│  │  ├─ recipes (Recipe data)                  │  │
│  │  ├─ ratings (User ratings)                 │  │
│  │  ├─ reports (Abuse reports)                │  │
│  │  ├─ messages (Admin messaging)             │  │
│  │  ├─ activity_history (Admin logs)          │  │
│  │  └─ submission_requests (Pending recipes)  │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         HOSTING & DEPLOYMENT PLATFORMS              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FRONTEND HOSTING:                                 │
│  Vercel (https://vercel.com)                       │
│  ├─ Global CDN for static files                    │
│  ├─ Automatic HTTPS/SSL                           │
│  ├─ Git integration (GitHub)                       │
│  ├─ Automatic deployments                         │
│  ├─ Build logs & monitoring                       │
│  └─ Free tier available                           │
│                                                     │
│  BACKEND HOSTING & DATABASE:                       │
│  InfinityFree (https://www.infinityfree.net)      │
│  ├─ Free hosting (ad-supported)                    │
│  ├─ PHP support (7.4+)                            │
│  ├─ MySQL database included                       │
│  ├─ FTP access                                    │
│  ├─ File manager                                  │
│  ├─ phpMyAdmin for database management            │
│  └─ Free domain (.infinityfreeapp.com)            │
│                                                     │
│  VERSION CONTROL:                                  │
│  GitHub (https://github.com)                      │
│  ├─ Source code repository                        │
│  ├─ Version tracking                              │
│  ├─ Collaboration                                 │
│  ├─ CI/CD integration                             │
│  └─ Free for public repositories                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Deployment Flow Timeline

```
Local Development
│
├─ Day 1: Initial Development
│  ├─ Create React components
│  ├─ Create PHP API endpoints
│  ├─ Set up database schema
│  └─ Test locally
│
├─ Day 2: Configuration
│  ├─ Configure vercel.json
│  ├─ Configure .env files
│  ├─ Configure apiConfig.js
│  └─ Configure config.php
│
├─ Day 3: Testing
│  ├─ npm run build ✓
│  ├─ npm run lint ✓
│  ├─ Test all endpoints
│  └─ Test all features
│
└─ Day 4: Deployment
   │
   ├─ FRONTEND DEPLOYMENT (Vercel) - AUTOMATIC
   │  ├─ git push origin main
   │  ├─ GitHub webhook triggers Vercel
   │  ├─ Vercel: npm install
   │  ├─ Vercel: npm run build (creates /dist/)
   │  ├─ Vercel: Deploy to CDN
   │  ├─ Frontend live: amar-recipe.vercel.app ✅
   │  └─ Time: ~5-10 minutes
   │
   ├─ BACKEND DEPLOYMENT (InfinityFree) - MANUAL
   │  ├─ Upload /src/api/*.php files
   │  ├─ Set file permissions (chmod)
   │  ├─ Create /uploads/ directories
   │  ├─ Verify config.php credentials
   │  ├─ Backend live: amar-recipes.infinityfreeapp.com/api ✅
   │  └─ Time: ~10-20 minutes
   │
   └─ DATABASE (MySQL) - ONE-TIME
      ├─ Access phpMyAdmin
      ├─ Create database (if needed)
      ├─ Create 7 tables
      ├─ Import sample data (optional)
      ├─ Database live: sql102.infinityfree.com ✅
      └─ Time: ~15-30 minutes
        
TOTAL DEPLOYMENT TIME: ~30-60 minutes (mostly manual FTP upload)

POST-DEPLOYMENT
│
├─ Testing (15-30 min)
│  ├─ Test homepage
│  ├─ Test API endpoints
│  ├─ Test admin login
│  ├─ Test file uploads
│  ├─ Test all features
│  └─ Verify no errors
│
├─ Monitoring (ongoing)
│  ├─ Check Vercel dashboard
│  ├─ Check InfinityFree logs
│  ├─ Monitor performance
│  └─ Track errors
│
└─ Maintenance (ongoing)
   ├─ Weekly: Backup database
   ├─ Weekly: Check logs
   ├─ Monthly: Update dependencies
   ├─ Monthly: Database optimization
   └─ Quarterly: Security audit
```

---

## Request-Response Cycle Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
│                  (Click button, submit form)                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              REACT COMPONENT (Frontend)                      │
│                                                              │
│  onClick = { async () => {                                  │
│    const response = await fetch(                            │
│      API_CONFIG.BASE_URL +                                  │
│      API_CONFIG.RECIPES.GET_ALL,                            │
│      { method: 'GET' }                                      │
│    );                                                        │
│    const data = await response.json();                       │
│    setState(data);                                           │
│  }}                                                          │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTPS GET/POST
                       │ URL: https://amar-recipes.
                       │      infinityfreeapp.com/api/
                       │      get_recipes.php
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  InfinityFree Web Server             │
    │  (Apache/Nginx)                      │
    └──────────────────────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  PHP Script Execution                │
    │  (get_recipes.php)                   │
    │                                      │
    │  <?php                               │
    │  require_once 'config.php';          │
    │  $query = "SELECT * FROM recipes"; │
    │  $result = $conn->query($query);    │
    │  ...                                 │
    │  ?>                                  │
    └──────────────────┬───────────────────┘
                       │
                       │ SQL Query
                       │ SELECT * FROM recipes
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  MySQL Database                      │
    │  (sql102.infinityfree.com)           │
    │                                      │
    │  Database: if0_39569251_amar_recipe │
    │  Table: recipes                      │
    │                                      │
    │  Returns: Rows of data               │
    └──────────────────┬───────────────────┘
                       │
                       │ Data result
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  PHP Processes Result                │
    │                                      │
    │  $response = array(                  │
    │    'success' => true,                │
    │    'data' => $recipes                │
    │  );                                  │
    │  echo json_encode($response);        │
    └──────────────────┬───────────────────┘
                       │
                       │ JSON Response
                       │ {
                       │   "success": true,
                       │   "data": [...]
                       │ }
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│            REACT COMPONENT (Frontend)                        │
│                                                              │
│  // Response received                                        │
│  const data = await response.json();                         │
│  // Parse JSON                                               │
│  setState(data);                                             │
│  // Update state & re-render                                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  DOM Updated         │
            │  Component re-render │
            │  Display new data    │
            └──────────────────────┘
                       │
                       ▼
              ✅ USER SEES DATA
```

---

## Environment Variables & Configuration Flow

```
┌──────────────────────────────────────────────────────────────┐
│              ENVIRONMENT CONFIGURATION                        │
└──────────────────────────────────────────────────────────────┘

DEVELOPMENT
├─ Machine: Local Computer
├─ OS: Windows/Mac/Linux
├─ .env.local File:
│  └─ VITE_API_URL=http://localhost/Amar_Recipies_jsx/...
├─ config.php:
│  └─ ENVIRONMENT=development
│  └─ MySQL: localhost / root / (empty)
├─ apiConfig.js:
│  └─ Uses VITE_API_URL from .env.local
└─ Result: Development/testing locally

PRODUCTION
├─ Vercel (Frontend)
│  ├─ Hosting: vercel.com
│  ├─ Environment Variables Set:
│  │  └─ VITE_API_URL=https://amar-recipes.
│  │                  infinityfreeapp.com/api
│  ├─ apiConfig.js:
│  │  └─ Uses VITE_API_URL from Vercel env vars
│  └─ Result: Frontend at amar-recipe.vercel.app
│
├─ InfinityFree (Backend)
│  ├─ Hosting: infinityfree.net
│  ├─ config.php detects:
│  │  └─ ENVIRONMENT=production (system env var)
│  ├─ MySQL Credentials:
│  │  ├─ Host: sql102.infinityfree.com
│  │  ├─ User: if0_39569251
│  │  ├─ Pass: Sharifcse2025
│  │  ├─ DB: if0_39569251_amar_recipe
│  │  └─ Port: 3306
│  └─ Result: Backend at amar-recipes.infinityfreeapp.com
│
└─ Both communicate via HTTPS API calls

SECURITY
├─ .env files: NOT committed to git
├─ .gitignore: Lists .env files
├─ Vercel UI: Secrets in Environment Variables
├─ InfinityFree: PHP config.php (secured)
└─ Result: Credentials protected from exposure
```

---

## CI/CD Pipeline (Simplified)

```
LOCAL DEVELOPMENT
      │
      │ Developer:
      │ - Makes code changes
      │ - Tests locally
      │ - Commits changes
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  git push origin main                                       │
│  (Push to GitHub)                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────────────────────────────┐
                  │  GitHub Repository                      │
                  │  (Sharif2023/Amar_Recipe)               │
                  │                                         │
                  │  Triggers Webhook to Vercel:           │
                  │  "Push event detected"                  │
                  └──────────────┬──────────────────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────────────────┐
                  │  Vercel CI/CD Pipeline                  │
                  │                                         │
                  │  Step 1: Pull Code                      │
                  │  ├─ Clone repository                    │
                  │  ├─ Checkout main branch                │
                  │  └─ Get latest code                     │
                  │                                         │
                  │  Step 2: Install Dependencies           │
                  │  ├─ npm install                         │
                  │  ├─ Resolve package.json                │
                  │  └─ Install 30+ packages                │
                  │                                         │
                  │  Step 3: Build                          │
                  │  ├─ npm run build                       │
                  │  ├─ Transpile JSX to JS                 │
                  │  ├─ Bundle code                         │
                  │  ├─ Optimize assets                     │
                  │  ├─ Creates /dist/ folder               │
                  │  └─ ~100KB gzipped bundle               │
                  │                                         │
                  │  Step 4: Deploy to CDN                  │
                  │  ├─ Upload files to Vercel servers      │
                  │  ├─ Replicate across regions            │
                  │  ├─ Invalidate caches                   │
                  │  └─ Set up routing rules                │
                  │                                         │
                  │  Step 5: Finalize                       │
                  │  ├─ SSL certificate setup               │
                  │  ├─ Domain setup                        │
                  │  ├─ HTTPS redirect                      │
                  │  └─ Mark as "Deployed"                  │
                  │                                         │
                  └──────────────┬──────────────────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────────────────┐
                  │  Production: amar-recipe.vercel.app    │
                  │  ✅ Live & Accessible                  │
                  │  ✅ HTTPS Enabled                      │
                  │  ✅ CDN Global Distribution             │
                  └─────────────────────────────────────────┘

MANUAL DEPLOYMENT (Backend)
      │
      │ Developer:
      │ - Updates PHP files in Amar_Recipe/src/api/
      │ - Commits to GitHub
      │ - Manually uploads to InfinityFree via:
      │   └─ FileZilla FTP
      │   └─ Web File Manager
      │   └─ Git pull (if configured)
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  /htdocs/api/ on InfinityFree                               │
│  ✅ Live & Accessible                                      │
│  ✅ HTTPS Enabled                                          │
└─────────────────────────────────────────────────────────────┘

RESULT: Full Stack Deployment Complete
├─ Frontend: Automatic (Vercel)
├─ Backend: Manual (InfinityFree)
└─ Database: Managed separately (MySQL)
```

---

## Error Handling Flow

```
FRONTEND REQUEST
       │
       ▼
   ┌─────────┐
   │  Fetch  │
   └────┬────┘
        │
        ├─ NETWORK ERROR
        │  └─ "Failed to fetch"
        │     └─ Console error
        │        └─ Show error message to user
        │
        ├─ HTTP STATUS ERROR (404, 500, etc.)
        │  └─ response.status !== 200
        │     └─ Parse JSON error
        │        └─ {success: false, message: "error"}
        │           └─ Show error message
        │
        ├─ CORS ERROR
        │  └─ "Access to XMLHttpRequest blocked by CORS"
        │     └─ Check CORS headers in PHP
        │        └─ Fix headers in API
        │
        └─ SUCCESS (200 OK)
           └─ response.json()
              └─ {success: true, data: {...}}
                 └─ Process data
                    └─ Update UI

BACKEND (PHP) ERROR HANDLING
       │
       ▼
   ┌──────────────┐
   │  PHP Script  │
   └────┬─────────┘
        │
        ├─ DATABASE CONNECTION ERROR
        │  └─ $conn->connect_error
        │     └─ http_response_code(500)
        │        └─ echo json_encode(['success'=>false, 'message'=>'DB error'])
        │           └─ Log to error.log
        │
        ├─ QUERY ERROR
        │  └─ $conn->error
        │     └─ http_response_code(400)
        │        └─ echo json_encode(['success'=>false, 'message'=>$error])
        │           └─ Log to error.log
        │
        ├─ VALIDATION ERROR
        │  └─ Missing required fields
        │     └─ http_response_code(400)
        │        └─ echo json_encode(['success'=>false, 'message'=>'...'])
        │           └─ Log validation failure
        │
        ├─ AUTHENTICATION ERROR
        │  └─ Invalid credentials
        │     └─ http_response_code(401)
        │        └─ echo json_encode(['success'=>false, 'message'=>'Auth failed'])
        │           └─ Log failed attempt
        │
        └─ SUCCESS
           └─ http_response_code(200)
              └─ echo json_encode(['success'=>true, 'data'=>$result])
                 └─ Log transaction
```

---

**This completes the comprehensive deployment documentation with visual diagrams and architecture explanations!**

For implementation details, refer to:
- **DEPLOYMENT_COMPLETE_GUIDE.md** for step-by-step instructions
- **DEPLOYMENT_CHECKLIST.md** for verification procedures
- **DEPLOYMENT_QUICK_REFERENCE.md** for command reference

---

*Last Updated: November 13, 2025*  
*Version: 1.0*
