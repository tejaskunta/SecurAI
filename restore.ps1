# Quick Restore Script
# Restores the most recent backup

$backupsDir = "C:\PrivacyShield.AI\backups"
$latestBackup = Get-ChildItem -Path $backupsDir -Directory | Sort-Object Name -Descending | Select-Object -First 1

if ($latestBackup) {
    Write-Host "Found backup: $($latestBackup.Name)" -ForegroundColor Cyan
    Write-Host "Created: $($latestBackup.CreationTime)" -ForegroundColor Gray
    
    $confirm = Read-Host "`nThis will restore files to their backup state. Continue? (y/n)"
    
    if ($confirm -eq 'y') {
        Write-Host "`nRestoring backend..." -ForegroundColor Green
        Copy-Item -Path "$($latestBackup.FullName)\backend\*" -Destination "C:\PrivacyShield.AI\backend" -Recurse -Force
        
        Write-Host "Restoring frontend..." -ForegroundColor Green
        Copy-Item -Path "$($latestBackup.FullName)\frontend\*" -Destination "C:\PrivacyShield.AI\frontend" -Recurse -Force
        
        Write-Host "`n✅ Restore completed!" -ForegroundColor Green
        Write-Host "⚠️  Remember to reinstall dependencies:" -ForegroundColor Yellow
        Write-Host "   Backend: cd backend; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Gray
        Write-Host "   Frontend: cd frontend; npm install" -ForegroundColor Gray
    } else {
        Write-Host "Restore cancelled." -ForegroundColor Yellow
    }
} else {
    Write-Host "No backups found in $backupsDir" -ForegroundColor Red
}
