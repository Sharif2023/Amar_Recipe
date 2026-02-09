# PowerShell script to update all hardcoded localhost URLs in React JSX files
# Run this from the Amar_Recipe directory

$files = Get-ChildItem -Path "src" -Include *.jsx,*.js -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has the import
    if ($content -notmatch "import.*API_BASE_URL.*from.*config/api") {
        # Check if file has localhost URLs that need updating
        if ($content -match "http://localhost/Amar_Recipies_jsx/Amar_Recipe/") {
            Write-Host "Processing: $($file.FullName)"
            
            # Replace the URLs
            $content = $content -replace "http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/", "API_BASE_URL + "
            $content = $content -replace "http://localhost/Amar_Recipies_jsx/Amar_Recipe/admin_api/", "ADMIN_API_BASE_URL + "
            
            # For baseImageUrl or similar variable assignments
            $content = $content -replace "const baseImageUrl = 'http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/'", "const baseImageUrl = API_BASE_URL"
            $content = $content -replace "const BASE_URL = `"http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/`"", "const BASE_URL = API_BASE_URL"
            $content = $content -replace "const backendBaseUrl = 'http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/'", "const backendBaseUrl = API_BASE_URL"
            
            # Add import at the top if React file
            if ($content -match "import React") {
                $content = $content -replace "(import React[^;]+;)", "`$1`nimport { API_BASE_URL, ADMIN_API_BASE_URL } from '../config/api';"
            }
            
            Set-Content -Path $file.FullName -Value $content
            Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
        }
    }
}

Write-Host "`nAll files processed!" -ForegroundColor Cyan
