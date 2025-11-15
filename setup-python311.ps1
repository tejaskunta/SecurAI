# Setup Script for Python 3.11
# Run this AFTER installing Python 3.11

Write-Host "🔧 Setting up SecurAI with Python 3.11..." -ForegroundColor Cyan
Write-Host ""

# Check if Python 3.11 is installed
$python311 = py -3.11 --version 2>&1
if ($python311 -like "*Python 3.11*") {
    Write-Host "✓ Python 3.11 found: $python311" -ForegroundColor Green
} else {
    Write-Host "✗ Python 3.11 not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11 from the installer that just downloaded" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Navigate to backend directory
cd "c:\Users\Anurag Krishna\Downloads\securAI\SecurAI\backend"

# Remove old virtual environment
if (Test-Path "venv") {
    Write-Host "Removing old virtual environment..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force venv
}

# Create new virtual environment with Python 3.11
Write-Host "Creating new virtual environment with Python 3.11..." -ForegroundColor Cyan
py -3.11 -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip --quiet

# Install dependencies
Write-Host "Installing dependencies (this will take a few minutes)..." -ForegroundColor Cyan
pip install fastapi uvicorn[standard] python-dotenv aiohttp openai python-multipart --quiet

Write-Host "Installing Presidio and spaCy..." -ForegroundColor Cyan
pip install presidio-analyzer presidio-anonymizer spacy --quiet

Write-Host "Installing MongoDB drivers..." -ForegroundColor Cyan
pip install motor pymongo --quiet

# Download spaCy model
Write-Host "Downloading spaCy English language model (400MB)..." -ForegroundColor Cyan
python -m spacy download en_core_web_lg

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python main.py" -ForegroundColor White
Write-Host ""
Write-Host "Don't forget to add your API keys to backend\.env file!" -ForegroundColor Yellow
Write-Host ""
