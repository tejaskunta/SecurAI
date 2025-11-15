# securAI - Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

### 2. Configure Environment

Edit `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_KEY_HERE
```

### 3. Run Server

```powershell
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

## API Endpoints

- `GET /health` - Health check
- `POST /v1/analyze` - Analyze text
- `GET /v1/sample` - Sample data
- `GET /docs` - Swagger documentation

## Testing

```powershell
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST http://localhost:8000/v1/analyze -H "Content-Type: application/json" -d "{\"text\": \"My name is John\"}"
```

## Optional: MongoDB

If you want audit logging:

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGO_URI` in `.env`
3. Backend will automatically start logging

## Troubleshooting

**spaCy model not found:**
```powershell
python -m spacy download en_core_web_lg
```

**Port already in use:**
```powershell
uvicorn main:app --reload --port 8001
```

**CORS errors:**
- Update `ALLOW_ORIGINS` in `.env`
- Restart server after changes
