# 🐍 Python 3.11 Installation & Setup Guide

## Step 1: Install Python 3.11

The installer should be downloading. Once downloaded:

1. **Run the installer** (`python-3.11.10-amd64.exe`)
2. **IMPORTANT:** Check ☑️ "Add Python 3.11 to PATH"
3. Click "Install Now"
4. Wait for installation to complete
5. Click "Close"

## Step 2: Verify Installation

Open a **NEW PowerShell window** and run:

```powershell
py -3.11 --version
```

You should see: `Python 3.11.10`

## Step 3: Run Setup Script

In PowerShell, run:

```powershell
cd "c:\Users\Anurag Krishna\Downloads\securAI\SecurAI"
.\setup-python311.ps1
```

This will:
- ✅ Remove old Python 3.13 virtual environment
- ✅ Create new Python 3.11 virtual environment  
- ✅ Install all dependencies
- ✅ Download spaCy language model (400MB)

**Time:** ~5-10 minutes depending on internet speed

## Step 4: Add API Keys

Edit `backend\.env` and add your API keys:

```env
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

Get keys from:
- Gemini: https://makersuite.google.com/app/apikey
- OpenAI: https://platform.openai.com/api-keys

## Step 5: Start the App

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Anurag Krishna\Downloads\securAI\SecurAI\backend"
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Anurag Krishna\Downloads\securAI\SecurAI\frontend"
npm run dev
```

**Open:** http://localhost:5173

---

## Troubleshooting

### "py: No suitable Python runtime found"
- Make sure you installed Python 3.11 with "Add to PATH" checked
- Restart your terminal/PowerShell
- Try running the installer again

### "Access Denied" when removing venv
- Close all VS Code terminals
- Close VS Code entirely
- Open new PowerShell as Administrator
- Run the setup script again

### Setup script fails
Run commands manually:
```powershell
cd "c:\Users\Anurag Krishna\Downloads\securAI\SecurAI\backend"
Remove-Item -Recurse -Force venv
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

---

## Why Python 3.11?

Python 3.13 is too new and has compatibility issues with:
- ✗ spaCy (NLP library)
- ✗ Presidio (PII detection)
- ✗ Some other dependencies

Python 3.11 is:
- ✅ Stable
- ✅ Fully compatible with all dependencies
- ✅ Well-tested with Presidio & spaCy

---

**After Python 3.11 is installed, run:** `.\setup-python311.ps1`
