# securAI - Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Configure Environment

Verify `.env` file points to backend:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```powershell
npm run dev
```

Frontend runs at: http://localhost:5173

## Build for Production

```powershell
npm run build
```

Build output is in `dist/` folder.

## Preview Production Build

```powershell
npm run preview
```

## Features

- ✅ Real-time PII detection and highlighting
- ✅ Privacy score visualization
- ✅ Entity highlighting with color coding
- ✅ Offline mode with sample data fallback
- ✅ Local history (last 20 analyses)
- ✅ Beautiful animated background (Unicorn Studio)
- ✅ Responsive Material-UI design

## Customization

### Change Theme

Edit `src/main.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    // Your colors here
  },
})
```

### Modify Animations

Edit `src/unicornstudio/UnicornBackground.jsx` to customize particle effects.

## Troubleshooting

**Backend connection failed:**
- Ensure backend is running on http://localhost:8000
- Frontend will automatically use sample data as fallback

**Build errors:**
```powershell
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 in use:**
Edit `vite.config.js` and change the port number.
