# Deployment Guide for securAI

## Architecture
- **Frontend**: Netlify (React + Vite)
- **Backend**: Render (FastAPI + Python)

## Step 1: Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `tejaskunta/securAI`
4. Configure the service:
   - **Name**: `securai-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     cd backend && pip install -r requirements.txt && python -m spacy download en_core_web_lg
     ```
   - **Start Command**: 
     ```bash
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Free

5. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `ALLOW_ORIGINS`: `https://your-app.netlify.app` (update after deploying frontend)

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://securai-backend.onrender.com`

## Step 2: Update Frontend API URL

Update `frontend/src/api.js` to use your Render backend URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://securai-backend.onrender.com';
```

Or create `frontend/.env.production`:
```
VITE_API_URL=https://securai-backend.onrender.com
```

## Step 3: Deploy Frontend to Netlify

### Option A: Using Netlify CLI
```bash
cd frontend
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### Option B: Using Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `tejaskunta/securAI`
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable (optional):
   - `VITE_API_URL`: `https://securai-backend.onrender.com`
6. Click "Deploy site"

## Step 4: Update CORS Settings

After getting your Netlify URL, update the backend environment variable on Render:
- `ALLOW_ORIGINS`: `https://your-actual-netlify-app.netlify.app,http://localhost:5173`

## Testing

1. Open your Netlify URL: `https://your-app.netlify.app`
2. Enter text with PII: "My name is John Doe and I live in New York"
3. Add your Gemini API key
4. Send the message
5. Verify PII is redacted

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Ensure spaCy model downloaded successfully

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct
- Check Network tab for failed requests

### CORS Errors
- Ensure Netlify URL is in `ALLOW_ORIGINS` on Render
- Redeploy backend after updating environment variables

## Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- Cold start takes 30-60 seconds
- 750 hours/month

**Netlify Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month
- No cold starts (CDN-hosted)

## Alternative: Render for Both

Deploy both frontend and backend on Render:
1. Backend: Web Service (as above)
2. Frontend: Static Site
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
