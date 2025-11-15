# SecurAI Setup Script for Windows (PowerShell)
# Run this script to set up the GPT integration

Write-Host "🚀 Setting up SecurAI with GPT Integration..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend\main.py")) {
    Write-Host "❌ Error: Please run this script from the SecurAI root directory" -ForegroundColor Red
    exit 1
}

# Backend setup
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
cd backend

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Green
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created! Please edit it and add your API keys." -ForegroundColor Green
    Write-Host ""
    Write-Host "To get API keys:" -ForegroundColor Cyan
    Write-Host "  - Gemini: https://makersuite.google.com/app/apikey" -ForegroundColor White
    Write-Host "  - OpenAI: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host ""
    
    # Prompt user to add keys now
    $response = Read-Host "Do you want to add your API keys now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host ""
        $geminiKey = Read-Host "Enter your Gemini API key (or press Enter to skip)"
        $openaiKey = Read-Host "Enter your OpenAI API key (or press Enter to skip)"
        
        if ($geminiKey) {
            (Get-Content ".env") -replace "YOUR_GEMINI_API_KEY_HERE", $geminiKey | Set-Content ".env"
            Write-Host "✅ Gemini API key saved!" -ForegroundColor Green
        }
        
        if ($openaiKey) {
            (Get-Content ".env") -replace "YOUR_OPENAI_API_KEY_HERE", $openaiKey | Set-Content ".env"
            Write-Host "✅ OpenAI API key saved!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies. Please check your Python installation." -ForegroundColor Red
    cd ..
    exit 1
}

Write-Host "✅ Backend setup complete!" -ForegroundColor Green

# Frontend setup
Write-Host ""
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
cd ..\frontend

if (Test-Path "node_modules") {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies. Please check your Node.js installation." -ForegroundColor Red
        cd ..
        exit 1
    }
    
    Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
}

cd ..

# Summary
Write-Host ""
Write-Host "✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your API keys are set in backend\.env" -ForegroundColor White
Write-Host "2. Start the backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "3. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see GPT_INTEGRATION.md" -ForegroundColor Cyan
Write-Host ""
