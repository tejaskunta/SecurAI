# 🤖 GPT/LLM Integration Guide for SecurAI

## Overview

SecurAI now supports **multiple LLM providers**, allowing users to get AI responses directly in the app without copy-pasting. The system automatically:

1. ✅ Analyzes text for PII (Personal Identifiable Information)
2. ✅ Redacts sensitive data (names, emails, phone numbers, etc.)
3. ✅ Sends **only redacted text** to the chosen LLM
4. ✅ Returns the AI response to the user

## 🎯 Supported LLM Providers

### 1. **Google Gemini** (Default)
- **Models**: Gemini 1.5 Flash, Gemini 1.5 Pro
- **Best for**: Fast responses, multilingual support
- **API Key**: Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. **OpenAI GPT**
- **Models**: GPT-3.5-turbo, GPT-4, GPT-4-turbo
- **Best for**: Advanced reasoning, complex tasks
- **API Key**: Get it from [OpenAI Platform](https://platform.openai.com/api-keys)

---

## 🚀 Quick Setup

### Backend Setup

1. **Install new dependencies:**
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure API Keys:**

   Create a `.env` file in the `backend/` directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   # Choose ONE or BOTH providers:
   
   # For Gemini (Google):
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   
   # For OpenAI GPT:
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

3. **Start the backend:**
   ```powershell
   python main.py
   ```

### Frontend Setup

The frontend is already configured! Just make sure you're running the latest code:

```powershell
cd frontend
npm install
npm run dev
```

---

## 🔑 Getting API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env` as `GEMINI_API_KEY`

**Free Tier:** 60 requests per minute

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in `.env` as `OPENAI_API_KEY`

**Pricing:**
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens

---

## 💡 How to Use

### In the App:

1. **Select LLM Provider**: Choose between Gemini or OpenAI GPT
2. **Select Model**: Pick the specific model (e.g., GPT-4, Gemini Flash)
3. **Enter Your Prompt**: Type any text, even with sensitive information
4. **Submit**: The app will:
   - Detect and redact PII automatically
   - Send only redacted text to the LLM
   - Display the AI response instantly

### Example Flow:

**Your Input:**
```
My name is John Doe, email john@example.com, phone 555-1234. 
Can you help me draft a professional email?
```

**What Gets Sent to LLM (Redacted):**
```
My name is [PERSON], email [EMAIL], phone [PHONE].
Can you help me draft a professional email?
```

**AI Response:**
```
Of course! I'd be happy to help you draft a professional email.
Could you tell me more about the purpose of the email?
```

---

## 🏗️ Architecture

### Backend Structure

```
backend/
├── main.py              # FastAPI app with /v1/analyze endpoint
├── gemini_client.py     # Google Gemini integration
├── openai_client.py     # OpenAI GPT integration (NEW)
├── privacy_engine.py    # PII detection & redaction
├── models.py            # Request/Response models (UPDATED)
└── requirements.txt     # Dependencies (UPDATED)
```

### Key Changes:

**1. `openai_client.py` (NEW)**
- Integrates OpenAI GPT API
- Supports GPT-3.5-turbo, GPT-4, GPT-4-turbo
- Only receives redacted text (privacy-first)

**2. `models.py` (UPDATED)**
- Added `llm_provider` field (gemini/openai)
- Added `model` field for specific model selection
- Added `llm_response` field (replaces `gemini_response`)

**3. `main.py` (UPDATED)**
- Routes requests to appropriate LLM provider
- Logs provider used in audit logs

### Frontend Structure

```
frontend/src/
├── components/
│   ├── PromptForm.jsx      # LLM provider selection (UPDATED)
│   └── ResultPanel.jsx     # Shows AI response (UPDATED)
└── api.js                  # API client (UPDATED)
```

**Changes:**
- Added dropdown for LLM provider selection
- Added model selection dropdown
- Updated API calls to send `llm_provider` and `model`
- Display which provider was used in results

---

## 🧪 Testing

### Test with Gemini:
```powershell
# In backend/
python -c "from gemini_client import query_gemini; import asyncio; print(asyncio.run(query_gemini('Hello, how are you?')))"
```

### Test with OpenAI:
```powershell
# In backend/
python -c "from openai_client import query_openai; import asyncio; print(asyncio.run(query_openai('Hello, how are you?')))"
```

### Full API Test:
```powershell
curl -X POST http://localhost:8000/v1/analyze `
  -H "Content-Type: application/json" `
  -d '{\"text\": \"My name is John\", \"llm_provider\": \"openai\", \"model\": \"gpt-3.5-turbo\"}'
```

---

## 🔒 Privacy & Security

### What Gets Sent to LLMs:
- ✅ **ONLY redacted text** (PII replaced with placeholders like `[PERSON]`, `[EMAIL]`)
- ✅ No raw personal information
- ✅ No user identifiers

### What's Protected:
- 👤 Names (PERSON)
- 📧 Email addresses (EMAIL)
- 📱 Phone numbers (PHONE)
- 🏠 Addresses (LOCATION)
- 💳 Credit cards (CREDIT_CARD)
- 🆔 SSN, Passport, Aadhaar, PAN (various ID types)
- And many more...

### Audit Logging:
All requests are logged (without raw PII) to MongoDB:
- Privacy score
- Entity types detected
- LLM provider used
- Response length
- Timestamp

---

## 🛠️ Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env` file exists in `backend/`
- Check that `OPENAI_API_KEY` is set correctly
- Restart the backend server

### "Gemini API error"
- Verify your Gemini API key is valid
- Check if you've exceeded rate limits (60 req/min)
- Try using a different model

### Backend not starting:
```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check Python version (requires 3.8+)
python --version
```

### Frontend not connecting:
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Clear browser cache

---

## 📊 Cost Estimation

### Gemini (Free Tier):
- **60 requests/minute**
- **Free** for moderate usage

### OpenAI Pricing (Approximate):
| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| GPT-3.5-turbo | $0.0005 | $0.0015 |
| GPT-4 | $0.03 | $0.06 |
| GPT-4-turbo | $0.01 | $0.03 |

**Example:** 100 requests with ~500 tokens each
- GPT-3.5: ~$0.10
- GPT-4: ~$3.00

---

## 🎯 Next Steps

### Potential Enhancements:

1. **Conversation History**: Maintain context across multiple messages
2. **Streaming Responses**: Real-time token streaming from LLMs
3. **Custom System Prompts**: Let users customize AI behavior
4. **More Providers**: Add Anthropic Claude, Cohere, etc.
5. **Cost Tracking**: Monitor API usage and costs

---

## 📚 API Documentation

### POST `/v1/analyze`

**Request:**
```json
{
  "text": "My email is john@example.com",
  "llm_provider": "openai",
  "model": "gpt-3.5-turbo"
}
```

**Response:**
```json
{
  "original_text": "My email is john@example.com",
  "redacted_text": "My email is [EMAIL]",
  "entities": [
    {
      "entity_type": "EMAIL_ADDRESS",
      "start": 12,
      "end": 28,
      "score": 1.0,
      "text": "john@example.com"
    }
  ],
  "privacy_score": 20,
  "llm_response": "I understand you want to share your email...",
  "llm_provider": "openai"
}
```

---

## 📞 Support

For questions or issues:
1. Check existing GitHub issues
2. Review backend logs: `backend/logs/`
3. Test API endpoints directly with curl/Postman
4. Verify environment variables in `.env`

---

## 🎉 Success!

You now have a **privacy-first AI integration** where users can:
- Choose their preferred LLM provider
- Get instant AI responses
- Keep their sensitive data protected

**No more copy-pasting!** 🚀
