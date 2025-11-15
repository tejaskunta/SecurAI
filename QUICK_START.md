# 🎯 Quick Start Guide - GPT Integration

## ⚡ Quick Setup (5 minutes)

### 1. Run Setup Script
```powershell
.\setup-gpt-integration.ps1
```

### 2. Add Your API Keys
Edit `backend\.env`:
```env
# Choose at least ONE:
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### 3. Start Backend
```powershell
cd backend
python main.py
```

### 4. Start Frontend (new terminal)
```powershell
cd frontend
npm run dev
```

### 5. Open Browser
```
http://localhost:5173
```

---

## 🔑 Get API Keys

| Provider | URL | Free Tier |
|----------|-----|-----------|
| **Gemini** | https://makersuite.google.com/app/apikey | ✅ 60 req/min |
| **OpenAI** | https://platform.openai.com/api-keys | ⚠️ Paid (cheap) |

---

## 🎨 Features

✅ **Privacy-First**: Only redacted text sent to AI
✅ **Multi-Provider**: Choose Gemini or OpenAI
✅ **Multiple Models**: GPT-4, GPT-3.5, Gemini Flash/Pro
✅ **Real-time Analysis**: Instant PII detection
✅ **No Copy-Paste**: Get AI responses directly in app

---

## 🧪 Test It

### Example Input:
```
My name is John Doe, email: john@example.com
Can you help me write a resume?
```

### What AI Receives (Redacted):
```
My name is [PERSON], email: [EMAIL]
Can you help me write a resume?
```

### AI Response:
```
Of course! I'd be happy to help you create a professional resume...
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Edit `backend\.env` and add your key |
| Backend won't start | Run `pip install -r requirements.txt` |
| Frontend error | Run `npm install` in frontend folder |
| Port already in use | Change PORT in `.env` or kill process |

---

## 📊 Supported PII Types

- 👤 Names
- 📧 Emails
- 📱 Phone numbers
- 🏠 Addresses
- 💳 Credit cards
- 🆔 SSN, Passport, Aadhaar, PAN
- 📅 Dates
- 🌐 IP addresses
- And more...

---

## 💰 Cost Reference

| Model | Cost per 1K tokens |
|-------|-------------------|
| Gemini Flash | FREE |
| GPT-3.5-turbo | ~$0.002 |
| GPT-4 | ~$0.03 |

---

## 📚 Full Documentation

See `GPT_INTEGRATION.md` for complete details.

---

**Need help?** Check the logs:
- Backend: Console output
- Frontend: Browser console (F12)
