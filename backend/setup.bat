@echo off
echo ===================================
echo securAI Backend Setup
echo ===================================
echo.

echo Step 1: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 2: Installing core dependencies...
python -m pip install fastapi uvicorn[standard] python-dotenv pydantic aiohttp python-multipart
echo.

echo Step 3: Installing Presidio...
python -m pip install presidio-analyzer presidio-anonymizer
echo.

echo Step 4: Installing spaCy...
python -m pip install spacy
echo.

echo Step 5: Installing MongoDB driver...
python -m pip install motor pymongo
echo.

echo Step 6: Downloading spaCy English model (this may take a while)...
python -m spacy download en_core_web_lg
echo.

echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo Next steps:
echo 1. Edit .env file and add your GEMINI_API_KEY
echo 2. Run: uvicorn main:app --reload
echo.
pause
