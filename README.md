# 🔐 securAI - Privacy-First AI Chat Platform

> **Intelligent PII Detection & Redaction System**  
> Protect your sensitive data before it reaches AI models

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Presidio](https://img.shields.io/badge/Presidio-PII_Detection-blue?style=for-the-badge)](https://microsoft.github.io/presidio/)

---

## 📸 Screenshots

### Main Interface - PII Detection & AI Chat
![Main Interface](Screenshot%202025-11-16%20091728.png)

### PII Detection Results
![PII Detection](Screenshot%202025-11-16%20091753.png)

### Redacted Text Analysis
![Redacted Analysis](Screenshot%202025-11-16%20091822.png)

### Privacy Score & Compliance Dashboard
![Privacy Dashboard](Screenshot%202025-11-16%20091833.png)

---

## 🎯 What is securAI?

**securAI** automatically detects and redacts personally identifiable information (PII) from user prompts **before** sending them to AI models like Google Gemini. Built with Microsoft Presidio, spaCy NLP, and Google's Gemini API.

### 🌟 Key Features

- 🛡️ **Real-time PII Detection** - Names, emails, phone numbers, SSN, credit cards
- 🔒 **Automatic Redaction** - Sensitive data masked before AI processing
- 📊 **Privacy Scoring** - Calculate risk levels (0-100)
- 🌐 **Case-Insensitive** - Detects "JOHN", "john", or "John"
- 💼 **Professional Context** - Recognizes occupations and organizations
- 🇮🇳 **Indian Documents** - Aadhaar, PAN, Passport, Voter ID
- ✅ **Compliance** - GDPR, HIPAA, PCI-DSS validation

### 🔍 Detected PII Types

**Personal:** Names, Emails, Phone Numbers, Addresses, Locations  
**Financial:** Credit Cards, SSN, Bank Accounts  
**Indian IDs:** Aadhaar, PAN Card, Voter ID, Vehicle Registration  
**Professional:** Occupation, Organization Names  
**Other:** IP Addresses, URLs, Dates

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Google Gemini API Key** - [Get Free Key](https://makersuite.google.com/app/apikey)

---

## 🔧 Installation Steps

### 1️⃣ Clone Repository

```bash
git clone https://github.com/tejaskunta/SecurAI.git
cd SecurAI
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (200MB - REQUIRED)
python -m spacy download en_core_web_lg
```

**Create `.env` file in `backend` directory:**

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-1.5-flash
PORT=8000
ALLOW_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Start backend server:**

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at **http://localhost:8000**

---

### 3️⃣ Frontend Setup

**Open new terminal:**

```bash
cd frontend

# Install dependencies
npm install
```

**Create `.env` file in `frontend` directory:**

```env
VITE_API_URL=http://localhost:8000
```

**Start frontend server:**

```bash
npm run dev
```

✅ Frontend running at **http://localhost:5173**

---

## 🎉 Usage

1. Open **http://localhost:5173** in your browser
2. Enter your Gemini API key in settings (first time only)
3. Type a prompt with PII:
   ```
   My name is john doe, email john@example.com, phone 555-0123
   ```
4. View detected PII, privacy score, and redacted text
5. Get AI response (processed with redacted text only)

### Example Detections

| Input | Detection |
|-------|-----------|
| `My name is john doe` | [PERSON] |
| `Email: user@example.com` | [EMAIL] |
| `Phone: 555-0123` | [PHONE] |
| `SSN: 123-45-6789` | [US_SSN] |
| `Aadhaar: 1234 5678 9012` | [AADHAAR] |
| `PAN: abcde1234f` | [PAN] |
| `I work as software engineer` | [OCCUPATION] |
| `Employed at google inc` | [ORGANIZATION] |

---

## 🛠️ Troubleshooting

**Backend won't start:**
```bash
# Install missing dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_lg
```

**Port already in use:**
```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**CORS errors:**
- Check `ALLOW_ORIGINS` in backend `.env`
- Restart backend after changing `.env`

**Gemini API errors:**
- Verify API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Update `GEMINI_API_KEY` in `.env`

---

## 📦 Tech Stack

**Backend:** FastAPI, Presidio, spaCy, Google Gemini API, MongoDB (optional)  
**Frontend:** React 18, Vite, Material-UI, Axios  
**PII Detection:** Microsoft Presidio 2.2.351 + spaCy en_core_web_lg

---

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 👥 Authors

**Team CodeRed**  

---

## 🔗 Links

- **Repository:** [github.com/tejaskunta/SecurAI](https://github.com/tejaskunta/SecurAI)
- **Presidio:** [microsoft.github.io/presidio](https://microsoft.github.io/presidio/)
- **Gemini API:** [ai.google.dev](https://ai.google.dev)

---

**⚠️ Note:** This tool is for educational purposes. Always review detected PII and test thoroughly before production use.

