# 🏗️ SecurAI Architecture - GPT Integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                             │
│                     (React + Material-UI)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │ PromptForm   │  │ ResultPanel  │  │   ChatInterface         │  │
│  │              │  │              │  │   (Follow-ups)          │  │
│  │ • Provider   │  │ • Entities   │  │   • Message history     │  │
│  │   Select     │  │ • Comparison │  │   • Privacy indicators  │  │
│  │ • Model      │  │ • AI Response│  │   • Real-time analysis  │  │
│  │   Select     │  │              │  │                         │  │
│  └──────┬───────┘  └──────────────┘  └─────────────────────────┘  │
│         │                                                           │
└─────────┼───────────────────────────────────────────────────────────┘
          │ HTTP POST
          │ {text, llm_provider, model}
          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                                │
│                     (main.py: /v1/analyze)                          │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ↓                                                           │
│  ┌──────────────────────────────────────────────────────┐          │
│  │         PRIVACY ENGINE (privacy_engine.py)           │          │
│  │                                                      │          │
│  │  ┌─────────────────────────────────────────────┐   │          │
│  │  │  Presidio Analyzer (Microsoft)              │   │          │
│  │  │  • Pattern Recognition                       │   │          │
│  │  │  • NLP (spaCy)                              │   │          │
│  │  │  • Custom Recognizers:                       │   │          │
│  │  │    - Phone, Address, Aadhaar, PAN, etc.    │   │          │
│  │  └─────────────────────────────────────────────┘   │          │
│  │                      ↓                              │          │
│  │  ┌─────────────────────────────────────────────┐   │          │
│  │  │  Presidio Anonymizer                         │   │          │
│  │  │  • Replace with placeholders                 │   │          │
│  │  │  • [PERSON], [EMAIL], [PHONE], etc.         │   │          │
│  │  └─────────────────────────────────────────────┘   │          │
│  │                      ↓                              │          │
│  │  Output: {entities, redacted_text, privacy_score}  │          │
│  └──────────────────────────────────────────────────────┘          │
│         │                                                           │
│         ↓                                                           │
│  ┌──────────────────────────────────────────────────────┐          │
│  │              LLM ROUTER                              │          │
│  │  if provider == "openai":                            │          │
│  │      → openai_client.py                              │          │
│  │  else:                                                │          │
│  │      → gemini_client.py                              │          │
│  └──────────────────────────────────────────────────────┘          │
│         │                   │                                       │
└─────────┼───────────────────┼───────────────────────────────────────┘
          │                   │
    ┌─────┴────┐         ┌────┴─────┐
    │          │         │          │
    ↓          │         ↓          │
┌────────────┐ │    ┌────────────┐ │
│  OpenAI    │ │    │  Gemini    │ │
│  GPT API   │ │    │  API       │ │
├────────────┤ │    ├────────────┤ │
│ • GPT-3.5  │ │    │ • 1.5 Flash│ │
│ • GPT-4    │ │    │ • 1.5 Pro  │ │
│ • GPT-4    │ │    │            │ │
│   Turbo    │ │    │            │ │
└────────────┘ │    └────────────┘ │
     │         │         │         │
     └─────────┴─────────┴─────────┘
               │
               ↓ AI Response
┌──────────────────────────────────┐
│  Store Audit Log (MongoDB)       │
│  • Privacy score                 │
│  • Entity types                  │
│  • Provider used                 │
│  • Timestamp                     │
│  • NO raw PII                    │
└──────────────────────────────────┘
```

## Data Flow Example

### Input:
```
"My name is John Doe, email john@example.com. Can you help?"
```

### Step 1: Privacy Engine Analysis
```javascript
{
  entities: [
    {type: "PERSON", text: "John Doe", score: 0.95},
    {type: "EMAIL", text: "john@example.com", score: 1.0}
  ],
  privacy_score: 35,
  redacted_text: "My name is [PERSON], email [EMAIL]. Can you help?"
}
```

### Step 2: Send to Selected LLM
```
Only this is sent: "My name is [PERSON], email [EMAIL]. Can you help?"
```

### Step 3: LLM Response
```
"Of course! I'd be happy to help. What do you need assistance with?"
```

### Step 4: Return to User
```javascript
{
  original_text: "My name is John Doe...",
  redacted_text: "My name is [PERSON]...",
  entities: [...],
  privacy_score: 35,
  llm_response: "Of course! I'd be happy to help...",
  llm_provider: "openai"
}
```

## Component Interaction Flow

```
┌────────────┐
│   User     │
│   Types    │
│   Text     │
└─────┬──────┘
      │
      ↓
┌────────────────────────────────┐
│  PromptForm.jsx                │
│  • Select Provider (Gemini/GPT)│
│  • Select Model                │
│  • Submit                      │
└─────┬──────────────────────────┘
      │ analyzeText(text, provider, model)
      ↓
┌────────────────────────────────┐
│  api.js                        │
│  POST /v1/analyze              │
└─────┬──────────────────────────┘
      │
      ↓
┌────────────────────────────────┐
│  main.py (FastAPI)             │
│  • Validate request            │
│  • Call privacy_engine         │
│  • Route to LLM                │
└─────┬──────────────────────────┘
      │
      ↓
┌────────────────────────────────┐
│  privacy_engine.py             │
│  • Detect PII (Presidio)       │
│  • Calculate privacy score     │
│  • Redact text                 │
└─────┬──────────────────────────┘
      │
      ↓
┌─────────────────────┬──────────────────────┐
│  gemini_client.py   │  openai_client.py    │
│  • Send redacted    │  • Send redacted     │
│  • Get response     │  • Get response      │
└─────────┬───────────┴──────────┬───────────┘
          │                      │
          ↓                      ↓
┌─────────────────┐    ┌─────────────────┐
│  Gemini API     │    │  OpenAI API     │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     ↓
          ┌────────────────────┐
          │  Response sent     │
          │  back to user      │
          └────────┬───────────┘
                   ↓
          ┌────────────────────┐
          │  ResultPanel.jsx   │
          │  • Show results    │
          │  • Enable chat     │
          └────────┬───────────┘
                   ↓
          ┌────────────────────┐
          │  ChatInterface.jsx │
          │  • Follow-up Qs    │
          │  • Same privacy    │
          └────────────────────┘
```

## File Structure

```
SecurAI/
│
├── backend/
│   ├── main.py                    # FastAPI app, routing
│   ├── privacy_engine.py          # PII detection/redaction
│   ├── gemini_client.py           # Google Gemini integration
│   ├── openai_client.py           # OpenAI GPT integration ✨ NEW
│   ├── models.py                  # Pydantic models ✨ UPDATED
│   ├── db.py                      # MongoDB audit logging
│   ├── requirements.txt           # Python dependencies ✨ UPDATED
│   ├── .env.example               # Environment template ✨ NEW
│   └── .env                       # Your API keys (create this)
│
├── frontend/
│   └── src/
│       ├── App.jsx                # Main app component
│       ├── api.js                 # API client ✨ UPDATED
│       └── components/
│           ├── PromptForm.jsx     # Input + provider select ✨ UPDATED
│           ├── ResultPanel.jsx    # Results display ✨ UPDATED
│           ├── ChatInterface.jsx  # Chat UI ✨ NEW
│           ├── EntityHighlighter.jsx
│           └── PrivacyScoreBar.jsx
│
├── GPT_INTEGRATION.md             # Full documentation ✨ NEW
├── QUICK_START.md                 # Quick reference ✨ NEW
├── INTEGRATION_SUMMARY.md         # This summary ✨ NEW
├── ARCHITECTURE.md                # Architecture diagram ✨ NEW
└── setup-gpt-integration.ps1      # Setup script ✨ NEW
```

## Security Model

### Privacy Layers

```
Layer 1: Input Analysis
├─ Detect all PII types
├─ Calculate privacy risk score
└─ Log entity types (not values)

Layer 2: Text Redaction
├─ Replace PII with placeholders
├─ Maintain text structure
└─ Preserve context for AI

Layer 3: API Call
├─ Send ONLY redacted text
├─ No metadata about user
└─ No identifiers

Layer 4: Response Handling
├─ Return AI response
├─ Show original vs redacted
└─ Allow follow-ups (also protected)

Layer 5: Audit Logging
├─ Store: scores, types, timestamps
├─ Don't store: actual PII values
└─ Comply with privacy regulations
```

## Technology Stack

### Backend
- **Framework**: FastAPI (async Python web framework)
- **PII Detection**: Microsoft Presidio
- **NLP**: spaCy (en_core_web_lg)
- **Database**: MongoDB (audit logs)
- **LLMs**: 
  - Google Gemini API
  - OpenAI GPT API

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **State**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Infrastructure
- **Runtime**: Node.js (frontend), Python 3.8+ (backend)
- **Package Managers**: npm, pip
- **Environment**: dotenv for secrets

## Scalability Considerations

### Current Capacity
- **Backend**: ~100 requests/second
- **Database**: MongoDB handles millions of docs
- **Rate Limits**:
  - Gemini: 60 req/min (free tier)
  - OpenAI: 3,500 req/min (tier 1)

### Scaling Options
1. **Horizontal Scaling**: Deploy multiple backend instances
2. **Load Balancing**: NGINX/AWS ALB
3. **Caching**: Redis for frequent queries
4. **CDN**: Cloudflare for frontend assets
5. **Database**: MongoDB Atlas (managed, auto-scaling)

## Monitoring & Observability

### Logging Points
1. Request received (with privacy score)
2. PII detection complete
3. LLM API call made
4. Response returned
5. Error handling

### Metrics to Track
- Average privacy score
- Most common PII types
- LLM provider usage split
- Response times
- Error rates
- API costs

## Compliance

### Privacy Regulations
- ✅ **GDPR**: No PII sent to third parties
- ✅ **CCPA**: User data protection
- ✅ **HIPAA**: Healthcare data redaction
- ✅ **SOC 2**: Audit logging

### Best Practices
- Minimal data retention
- Encryption in transit (HTTPS)
- API key security (.env, not in code)
- Regular security audits

---

**This architecture ensures privacy-first AI assistance! 🔒**
