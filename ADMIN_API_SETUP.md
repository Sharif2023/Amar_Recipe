# Admin API Files Setup

These files from the `admin_api` folder need to be moved or copied to the `api` folder for InfinityFree deployment:

## Files to Move/Copy

### admin_api/admin_signup.php → api/admin_signup.php
### admin_api/admin_delete.php → api/admin_delete.php  
### admin_api/admin_req_reject.php → api/admin_req_reject.php

## Update Required

After copying these files to the `api` folder, update the first lines to use the config:

**Change from:**
```php
<?php
$conn = new mysqli("localhost", "root", "", "amar_recipe");
```

**Change to:**
```php
<?php
require_once 'config.php';
```

Then copy all database connection lines and use `$conn` instead of creating a new connection.

## For InfinityFree Deployment

1. Copy all files from `src/api/` folder
2. Copy these admin files to the same `api/` folder
3. All files will automatically use the correct database based on environment
4. Upload entire `/api` folder structure to InfinityFree via File Manager

## Local Development

For local development, these files can stay in `admin_api/` or be in `src/api/`. Just ensure:
- `src/Admin/*.jsx` files have correct API URLs configured
- Environment detection works properly
