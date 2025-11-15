# securAI Backend Setup Script
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "securAI Backend Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
Write-Host ""

Write-Host "Step 2: Installing core dependencies..." -ForegroundColor Yellow
python -m pip install fastapi uvicorn[standard] python-dotenv pydantic aiohttp python-multipart
Write-Host ""

Write-Host "Step 3: Installing Presidio..." -ForegroundColor Yellow
python -m pip install presidio-analyzer presidio-anonymizer
Write-Host ""

Write-Host "Step 4: Installing spaCy..." -ForegroundColor Yellow
python -m pip install spacy
Write-Host ""

Write-Host "Step 5: Installing MongoDB driver..." -ForegroundColor Yellow
python -m pip install motor pymongo
Write-Host ""

Write-Host "Step 6: Downloading spaCy English model (large file ~800MB)..." -ForegroundColor Yellow
python -m spacy download en_core_web_lg
Write-Host ""

Write-Host "===================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and add your GEMINI_API_KEY" -ForegroundColor White
Write-Host "2. Run: uvicorn main:app --reload" -ForegroundColor White
Write-Host ""
