# securAI Backup Script
# Creates timestamped backups of your working code

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "C:\PrivacyShield.AI\backups\backup_$timestamp"

Write-Host "Creating backup: $backupDir" -ForegroundColor Green

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Copy backend (excluding venv and cache)
Write-Host "Backing up backend..." -ForegroundColor Cyan
Copy-Item -Path ".\backend\*" -Destination "$backupDir\backend" -Recurse -Exclude @("venv", "__pycache__", "*.pyc", ".pytest_cache")

# Copy frontend (excluding node_modules)
Write-Host "Backing up frontend..." -ForegroundColor Cyan
Copy-Item -Path ".\frontend\*" -Destination "$backupDir\frontend" -Recurse -Exclude @("node_modules", "dist", ".vite")

# Copy root files
Write-Host "Backing up root files..." -ForegroundColor Cyan
Copy-Item -Path ".\README.md" -Destination "$backupDir\" -ErrorAction SilentlyContinue
Copy-Item -Path ".\LICENSE" -Destination "$backupDir\" -ErrorAction SilentlyContinue
Copy-Item -Path ".\.gitignore" -Destination "$backupDir\" -ErrorAction SilentlyContinue

# Create backup info file
$info = @"
Backup Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Backend Status: Both servers running
- Backend: http://127.0.0.1:8000
- Frontend: http://localhost:5173

Configuration:
- Python: 3.11.9 (venv)
- Gemini Model: gemini-1.5-pro
- spaCy Model: en_core_web_lg
- Presidio Version: 2.2.360

Notes:
- venv and node_modules excluded (can be recreated)
- Use this backup to restore if issues occur
"@

$info | Out-File -FilePath "$backupDir\BACKUP_INFO.txt" -Encoding UTF8

Write-Host "`n✅ Backup completed successfully!" -ForegroundColor Green
Write-Host "📁 Location: $backupDir" -ForegroundColor Yellow
Write-Host "`nTo restore: Copy contents back to C:\PrivacyShield.AI" -ForegroundColor Gray
