# 🔐 securAI

> **Privacy-first AI prompt analyzer with PII detection and redaction**  
> Built by **Team CodeRed** for GitHub Copilot & VS Code Agents

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Presidio](https://img.shields.io/badge/Presidio-PII_Detection-blue?style=for-the-badge)](https://microsoft.github.io/presidio/)

---

## 🎯 What is securAI?

**securAI** automatically detects and redacts personally identifiable information (PII) from user prompts before sending them to AI models like Google Gemini. This ensures:

- ✅ **Privacy Protection**: Never send sensitive data to AI APIs
- ✅ **Compliance**: GDPR, HIPAA, and other privacy regulations
- ✅ **Transparency**: See exactly what was redacted
- ✅ **Audit Trail**: MongoDB logging for compliance

### Detected PII Types

- 👤 Names (PERSON)
- 📧 Email addresses
- 📱 Phone numbers
- 💳 Credit card numbers
- 🏠 Addresses & locations
- 🆔 SSN, driver's licenses, passports
- 🔢 IP addresses
- 🌐 URLs
- 📅 Dates and more...

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │ ──────> │   Backend    │ ──────> │   Gemini AI  │
│  React + MUI│         │   FastAPI    │         │  (Redacted)  │
└─────────────┘         └──────────────┘         └──────────────┘
                              │
                              │
                              ▼
                        ┌──────────────┐
                        │   Presidio   │
                        │ PII Detection│
                        └──────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │   MongoDB    │
                        │  Audit Logs  │
                        └──────────────┘
```

---

## 📦 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Presidio Analyzer** - Microsoft's PII detection engine
- **Presidio Anonymizer** - PII redaction/masking
- **spaCy** - NLP model (`en_core_web_lg`)
- **Gemini API** - Google AI (receives only redacted text)
- **MongoDB** - Audit logging (Motor async driver)
- **Python 3.9+** with asyncio

### Frontend
- **Vite + React 18** - Fast, modern build tool
- **Material-UI (MUI)** - Google's Material Design
- **Axios** - HTTP client with fallback support
- **LocalStorage** - Client-side history (max 20 items)
- **Unicorn Studio** - Custom animated particle background

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** & npm
- **MongoDB** (optional, for audit logs)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-org/privacyshield-ai.git
cd privacyshield-ai
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

# Download spaCy model (REQUIRED)
python -m spacy download en_core_web_lg

# Configure environment variables
# Edit .env file and add your Gemini API key
notepad .env  # Windows
# or
nano .env     # macOS/Linux
```

**Edit `.env` file:**

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=securai
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-pro
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models
PORT=8000
ALLOW_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Run the backend:**

```bash
uvicorn main:app --reload
```

Backend will be available at: **http://localhost:8000**

### 3️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env file if needed
notepad .env  # Windows
# or
nano .env     # macOS/Linux
```

**Verify `.env` file:**

```env
VITE_API_URL=http://localhost:8000
```

**Run the frontend:**

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4️⃣ Open Your Browser

Navigate to **http://localhost:5173** and start analyzing prompts!

---

## 🧪 Testing

### Test the Backend API

```bash
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST http://localhost:8000/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "My name is John Doe and my email is john@example.com"}'

# Get sample data
curl http://localhost:8000/v1/sample
```

### Test Frontend Fallback

1. Stop the backend server
2. Try submitting a prompt in the frontend
3. You should see sample data with an "OFFLINE MODE" warning

---

## 📂 Project Structure

```
PrivacyShield.AI/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── gemini_client.py        # Gemini API integration
│   ├── privacy_engine.py       # Presidio PII detection
│   ├── db.py                   # MongoDB connection
│   ├── models.py               # Pydantic models
│   ├── utils.py                # Helper functions
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── public/
│       └── sample.json         # Sample response data
│
├── frontend/
│   ├── public/
│   │   └── sample.json         # Fallback sample data
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── api.js              # API client with fallback
│   │   ├── components/
│   │   │   ├── PromptForm.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   ├── EntityHighlighter.jsx
│   │   │   ├── PrivacyScoreBar.jsx
│   │   │   └── HistoryTable.jsx
│   │   └── unicornstudio/      # Animated background
│   │       ├── UnicornBackground.jsx
│   │       ├── config.js
│   │       └── index.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
└── README.md                   # This file
```

---

## 🔒 Privacy & Security

### ✅ What We DO

- ✅ Detect PII using Microsoft Presidio
- ✅ Redact sensitive data before AI processing
- ✅ Log only metadata (no raw PII)
- ✅ Store history in browser localStorage (user-controlled)
- ✅ Display what was redacted (transparency)

### ❌ What We DON'T DO

- ❌ Send original text to Gemini API
- ❌ Store raw PII in MongoDB
- ❌ Share data with third parties
- ❌ Track users or collect analytics

### Privacy Score Calculation

```python
score = sum(entity_weight × confidence) for all entities
# Capped at 100
```

**Entity Weights:**
- Critical (25-30): SSN, Credit Card, Passport
- High (18-22): Email, Phone, Medical License
- Medium (12-15): Person, IP Address
- Low (5-10): Date, URL

---

## 🌐 Deployment

### Backend Deployment Options

#### Option 1: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard
# Deploy
railway up
```

#### Option 2: Google Cloud Run

```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT/privacyshield-backend .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT/privacyshield-backend

# Deploy to Cloud Run
gcloud run deploy privacyshield-backend \
  --image gcr.io/YOUR_PROJECT/privacyshield-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Option 3: Render

1. Create new **Web Service**
2. Connect your GitHub repository
3. Set **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_lg`
4. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend-url.com
```

**Important**: Update backend CORS settings to allow your Vercel domain!

---

## 🛠️ Development

### Adding New Entity Types

Edit `backend/privacy_engine.py`:

```python
ENTITY_WEIGHTS = {
    "PERSON": 15,
    "YOUR_NEW_TYPE": 20,  # Add here
    # ...
}
```

### Customizing Redaction Format

Edit `backend/privacy_engine.py`:

```python
anonymized_result = anonymizer.anonymize(
    text=text,
    analyzer_results=analyzer_results,
    operators={
        "PERSON": OperatorConfig("replace", {"new_value": "[REDACTED_NAME]"}),
        # Customize here
    }
)
```

### Changing Theme Colors

Edit `frontend/src/main.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',  // Change primary color
    },
    // ...
  },
})
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ImportError: No module named 'presidio_analyzer'`

```bash
pip install presidio-analyzer presidio-anonymizer
```

**Problem**: `OSError: [E050] Can't find model 'en_core_web_lg'`

```bash
python -m spacy download en_core_web_lg
```

**Problem**: MongoDB connection error

```bash
# MongoDB is optional. Comment out in main.py if not using:
# await save_audit_log(...)
```

### Frontend Issues

**Problem**: `CORS policy` error

- Ensure backend `.env` has correct `ALLOW_ORIGINS`
- Restart backend after changing `.env`

**Problem**: "Failed to connect to backend"

- Check backend is running on http://localhost:8000
- Verify `VITE_API_URL` in frontend `.env`
- Frontend should fall back to sample.json automatically

---

## 📊 API Documentation

Once backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| POST | `/v1/analyze` | Analyze text for PII |
| GET | `/v1/sample` | Get sample data |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8, use Black formatter
- **Frontend**: Use ESLint, Prettier
- **Commits**: Conventional Commits format

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team CodeRed

Built with ❤️ for privacy-conscious developers.

### Authors

- **Team CodeRed** - *Initial work*

### Acknowledgments

- Microsoft Presidio for PII detection
- Google Gemini for AI capabilities
- FastAPI & React communities

---

## 📧 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/privacyshield-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/privacyshield-ai/discussions)
- 📧 **Email**: support@privacyshield.ai

---

## 🗺️ Roadmap

- [ ] Support for more languages (spaCy models)
- [ ] Custom entity type definitions
- [ ] Export audit logs as CSV/JSON
- [ ] Chrome extension for real-time redaction
- [ ] Integration with other AI providers (OpenAI, Anthropic)
- [ ] On-premise deployment guide
- [ ] Docker Compose setup
- [ ] Kubernetes manifests

---

**⭐ Star this repo if you find it useful!**

