# 🎬 Demo Script - SecurAI GPT Integration

Use this script to demonstrate your SecurAI app with GPT integration.

---

## 🎯 Demo Overview (5 minutes)

**Tagline**: "AI assistance without compromising your privacy"

### Key Messages:
1. Automatic PII detection and redaction
2. Choice of AI providers (Gemini/OpenAI)
3. Direct responses - no copy-pasting needed
4. Interactive chat with continued privacy protection

---

## 📋 Demo Script

### Part 1: Introduction (30 seconds)

**Show:** Homepage with logo and welcome message

**Say:**
> "SecurAI is a privacy-first AI assistant. Unlike other tools, we automatically detect and remove personal information before sending your queries to AI. You get smart answers without compromising your privacy."

---

### Part 2: Provider Selection (30 seconds)

**Show:** LLM provider dropdown

**Do:** Click dropdown, show options (Gemini, OpenAI GPT)

**Say:**
> "You can choose between Google Gemini or OpenAI's GPT models. Each has different strengths - Gemini is free and fast, while GPT-4 is more advanced for complex tasks."

**Do:** Select "OpenAI GPT" and choose "GPT-3.5-turbo"

---

### Part 3: Privacy in Action (1.5 minutes)

**Type this example:**
```
My name is Sarah Johnson, and my email is sarah.johnson@techcorp.com. 
I'm planning a vacation next week. My phone is 555-0123, and I live at 
123 Main Street, Boston, MA 02101. Can you help me write an 
out-of-office email message?
```

**Do:** Click "Analyze & Send to OpenAI"

**Show:** Loading indicator

**Say:**
> "Watch what happens. SecurAI is now scanning for personal information..."

**Show:** Results panel with:
- Privacy score bar (should be high)
- Detected entities chips
- Side-by-side comparison

**Say:**
> "Look at this! We detected 5 sensitive pieces of information:
> - Your name: Sarah Johnson
> - Email address
> - Phone number
> - Full home address
> - And we calculated a privacy risk score of 68%
>
> Here's the original text with sensitive data highlighted, and here's what we actually sent to OpenAI - all personal details replaced with placeholders like [PERSON], [EMAIL], and [LOCATION]."

**Show:** AI Response

**Say:**
> "And we got a helpful response from GPT - without exposing any of your personal information!"

---

### Part 4: Interactive Chat (1 minute)

**Show:** Chat interface at the bottom

**Say:**
> "Now you can continue the conversation with follow-up questions, and we'll continue protecting your privacy."

**Type:**
```
Can you make it more formal and add my contact info: sarah.johnson@techcorp.com
```

**Do:** Click send

**Show:** New message appears with privacy indicators

**Say:**
> "Notice that even in follow-up messages, we automatically detect and redact any personal information. Each message shows its own privacy score, and you can see exactly what was protected."

**Show:** AI's follow-up response

---

### Part 5: Switching Providers (30 seconds)

**Do:** Scroll back up, change to "Gemini" and model to "Gemini 1.5 Flash"

**Type:**
```
My credit card 4532-1234-5678-9012 was charged. Can you draft a dispute letter?
```

**Do:** Submit

**Show:** Results with credit card redacted

**Say:**
> "We support multiple AI providers. Here we switched to Google Gemini. Notice the credit card number was automatically detected and redacted before sending. The AI never sees your actual card number."

---

### Part 6: Closing (30 seconds)

**Show:** Full screen with multiple results

**Say:**
> "That's SecurAI - your privacy-first AI assistant. Whether you're using it for work, personal tasks, or anything in between, you can trust that your sensitive information stays private. No copy-pasting, no manual redaction, just secure AI assistance."

**Show:** Quick stats:
> "Supports 30+ types of personal information, works with multiple AI providers, and keeps complete audit logs for compliance."

---

## 🎤 Alternative Demo Scenarios

### Scenario 1: Healthcare
```
I'm Dr. Smith. My patient John Doe (DOB: 01/15/1980, SSN: 123-45-6789) 
has symptoms of fever and cough. What tests should I order?
```

**Expected:** Names, DOB, SSN all redacted

---

### Scenario 2: HR/Recruitment
```
Candidate: Jane Williams
Email: jane.w@email.com
Phone: 555-9876
Resume: 5 years at TechCorp, BS from MIT
Can you draft an interview invitation?
```

**Expected:** Name, email, phone redacted

---

### Scenario 3: Customer Support
```
Customer ID: 12345
Email: angry.customer@gmail.com
Issue: My credit card ending in 6789 was overcharged $500
Can you draft a response?
```

**Expected:** Email and partial card number redacted

---

### Scenario 4: Legal
```
Plaintiff: Robert Anderson
Address: 456 Oak Ave, Denver, CO 80202
Case: Contract dispute involving $50,000
Draft a settlement offer letter
```

**Expected:** Name and address redacted

---

## 📊 Demo Talking Points

### Privacy Features:
- ✅ 30+ PII types detected
- ✅ Real-time analysis (under 200ms)
- ✅ Presidio by Microsoft (enterprise-grade)
- ✅ No data retention of PII
- ✅ Full audit logs

### AI Capabilities:
- ✅ Multiple providers (Gemini, OpenAI)
- ✅ Model selection (GPT-3.5, GPT-4, etc.)
- ✅ Chat-style conversations
- ✅ Context-aware responses
- ✅ Fast response times

### User Experience:
- ✅ No copy-pasting needed
- ✅ Beautiful Material-UI interface
- ✅ Real-time privacy scores
- ✅ Entity highlighting
- ✅ Conversation history

### Technical:
- ✅ FastAPI backend (async)
- ✅ React frontend
- ✅ MongoDB audit logging
- ✅ RESTful API
- ✅ Easy deployment

---

## 🎭 Common Questions & Answers

**Q: "How accurate is the PII detection?"**
> "We use Microsoft's Presidio, which is enterprise-grade and highly accurate. We also added custom recognizers for phone numbers, addresses, and Indian ID systems like Aadhaar and PAN."

**Q: "What if it misses something?"**
> "We use multiple detection methods - pattern matching, NLP, and context analysis. If something is missed, you can always review the redacted text before sending."

**Q: "Can I use my own AI model?"**
> "Currently we support Gemini and OpenAI, but the architecture is extensible. We can add more providers like Claude, Cohere, or even local models."

**Q: "What about cost?"**
> "Gemini is free for up to 60 requests per minute. OpenAI is pay-as-you-go, with GPT-3.5 costing about $0.002 per 1,000 tokens - very affordable."

**Q: "Is this GDPR/HIPAA compliant?"**
> "We don't store raw PII, only redacted text and metadata. All sensitive data is removed before any external API calls. This aligns with privacy regulations, but consult your legal team for specific compliance requirements."

**Q: "Can I self-host this?"**
> "Absolutely! The entire stack is open source. You can deploy it on your own servers or cloud infrastructure."

---

## 🎬 Recording Tips

### Before Recording:
1. Clear browser cache
2. Close unnecessary tabs
3. Test all features once
4. Have sample text ready
5. Check audio levels

### During Recording:
1. Speak clearly and slowly
2. Pause between sections
3. Show mouse cursor clearly
4. Zoom in on important details
5. Keep demo under 5 minutes

### After Recording:
1. Add captions/subtitles
2. Include timestamps
3. Add music (optional)
4. Export in HD (1080p)
5. Upload to YouTube/Vimeo

---

## 📸 Screenshot Checklist

Capture these key screens:
- [ ] Homepage with provider selection
- [ ] Example input with PII
- [ ] Privacy score bar (high score)
- [ ] Detected entities chips
- [ ] Side-by-side comparison
- [ ] AI response
- [ ] Chat interface
- [ ] Multiple providers comparison

---

## 🎯 Demo Success Criteria

Your demo should show:
- ✅ Multiple types of PII detected
- ✅ High privacy score (50+)
- ✅ Clear visual redaction
- ✅ AI response that makes sense
- ✅ Chat follow-up working
- ✅ Provider switching
- ✅ Smooth user experience

---

**Go wow your audience! 🚀**
