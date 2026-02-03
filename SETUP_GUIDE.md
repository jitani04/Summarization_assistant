# Complete Setup Guide

## Project Structure

```
Summarization_assistant/
├── frontend/                     # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── InputForm.tsx
│   │   │   ├── SummaryDisplay.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── services/
│   │   │   ├── summarizationService.ts
│   │   │   ├── urlExtractionService.ts
│   │   │   └── browserExtractionService.ts
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env                      (your API key)
│   ├── .env.example              (template)
│   └── package.json
├── backend/                      # Node.js backend server
│   ├── server.js                 (Express + Playwright)
│   └── package.json
├── package.json                  (root - manages both)
└── Documentation files
```

## Quick Start

### 1. Initial Setup (One Time)

```bash
# Install everything
npm run setup

# This installs:
# - Frontend dependencies (React, Vite, Gemini API, etc.)
# - Backend dependencies (Express, Playwright, Chromium)
```

### 2. Environment Variables

Copy template to actual config:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```
VITE_GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Application

#### Option A: Frontend Only (without bot gate support)
```bash
npm run dev
```
Runs on: http://localhost:5173

Features:
- ✅ URL extraction via Gemini API
- ✅ Proxy-based fallback for some bot-gated sites
- ❌ Browser automation not available

#### Option B: Full Stack (with bot gate support)
```bash
npm run dev:all
```

Runs:
- Frontend on: http://localhost:5173
- Backend on: http://localhost:3001

Features:
- ✅ URL extraction via Gemini API
- ✅ Proxy-based fallback
- ✅ Browser automation for bot-gated sites via Playwright

## How It Works

### Content Extraction Flow

```
User enters URL
    ↓
Try: Gemini API url_context tool
    ↓
[Success] → Return content
    ↓
[Fails/Bot Gate] → Try proxy extraction (AllOrigins, Jina AI)
    ↓
[Success] → Return content
    ↓
[Fails] → Try browser automation (if backend running)
    ↓
[Backend calls Playwright] → Extract via real browser
    ↓
[Success] → Return content to frontend
    ↓
[All fail] → Show error to user
```

### Backend Server

The backend server (`backend/server.js`):
- Runs Express on port 3001
- Listens for extraction requests via POST /api/extract
- Uses Playwright + Chromium to load pages like a real browser
- Waits for JavaScript to execute
- Extracts readable content (removes ads, nav, footers)
- Returns extracted text to the frontend

### Frontend Integration

The frontend React app:
- Never runs Playwright (it's browser-based)
- Calls the backend extraction API when needed
- Falls back gracefully if backend is unavailable
- Shows helpful error messages

## Commands Reference

```bash
# Setup
npm run setup              # Install all dependencies (frontend + backend)

# Development
npm run dev                # Frontend only (port 5173)
npm run dev:all            # Full stack with backend
npm run dev:frontend       # Frontend only
npm run dev:backend        # Backend only (port 3001)

# Production
npm run build              # Build frontend for production
npm run preview            # Preview production build locally
npm run lint               # Run ESLint checks

# Backend Standalone
cd backend
npm run dev                # Run backend server only
npm run start              # Start backend (same as dev)
```

## Important Notes

### Playwright & Chromium
- Playwright is a server-side tool, only runs in the backend
- Chromium is downloaded during `npm run setup` (~200MB)
- Takes a minute or two on first setup
- Not installed in the frontend (frontend can't use it)

### CORS
- Backend has CORS enabled for `http://localhost:5173`
- For production deployment, update CORS settings in `backend/server.js`

### Performance
- First request with bot-gated content is slower (10-20s) due to browser startup
- Subsequent requests are faster
- Browser automation is the fallback, not the primary method

### Limitations
- ❌ Cannot bypass paywalls or authentication
- ❌ Cannot bypass CAPTCHA
- ❌ Respects robots.txt (your responsibility to check)
- ✅ Can extract JavaScript-heavy sites
- ✅ Can bypass JavaScript-based bot gates (not CAPTCHA)

## Troubleshooting

### "Backend extraction service unavailable"
- Make sure backend is running: `npm run dev:all`
- Check that port 3001 is not in use
- Check browser console for CORS errors

### Backend won't start
```bash
# Clear and reinstall
rm -rf backend/node_modules
cd backend
npm install
npm run dev
```

### Playwright crashes on M1/M2 Mac
- Might need Rosetta 2 installed
- Try: `softwareupdate --install-rosetta`

### Port 5173 or 3001 already in use
```bash
# Find process using port
lsof -i :5173
lsof -i :3001

# Kill the process
kill -9 <PID>
```

## Customization

### Change Backend Port
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001;  // Change 3001 here
```

Then update frontend `.env`:
```
VITE_BACKEND_URL=http://localhost:3000
```

### Change Frontend Port
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000,  // Change here
  }
})
```

### Update CORS Settings
Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
}));
```

## Deployment

### Frontend (Vite)
```bash
npm run build
# Outputs to dist/
# Deploy dist/ to your hosting (Vercel, Netlify, etc.)
```

### Backend (Node.js)
```bash
# Deploy backend/ folder to your server
# Install Chromium: npx playwright install chromium
# Set VITE_BACKEND_URL to your backend domain in frontend .env
```

### Example: Deployed Setup
```
Frontend: https://summarizer.example.com (Vercel)
Backend: https://api.summarizer.example.com (Node.js hosting)

Frontend .env:
VITE_GOOGLE_GEMINI_API_KEY=...
VITE_BACKEND_URL=https://api.summarizer.example.com
```

## Need Help?

- Check browser console for errors (F12)
- Check backend logs in terminal
- See `BROWSER_EXTRACTION_BACKEND.md` for technical details

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5174` (or the next available port if 5174 is busy)

## 📱 Features Overview

### Input Options
- **URL Mode**: Paste any article URL and the app will extract the content
- **Text Mode**: Paste or type content directly into the textarea

### Audience Selection
- General Public
- Executive/Decision Makers
- Technical Professionals
- Students
- Researchers

### Summary Purpose
- Informative (comprehensive overview)
- Actionable (decision-focused)
- Learning (educational format)
- Quick Overview (brief synopsis)
- Research Reference (detailed for study)

### Output
- **Title**: Generated headline
- **Key Insights**: 3-4 main takeaways with icons
- **Next Steps**: 3 actionable recommendations

### Export Options
- 📋 Copy to clipboard
- 📥 Download as text file

## 🛠️ Available Commands

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

## 📁 Project Structure

```
Summarization_assistant/
├── src/
│   ├── components/
│   │   ├── InputForm.tsx          # Main input interface
│   │   ├── InputForm.css          # Form styling
│   │   ├── SummaryDisplay.tsx     # Results display
│   │   ├── SummaryDisplay.css     # Summary styling
│   │   ├── LoadingSpinner.tsx     # Loading UI
│   │   └── LoadingSpinner.css     # Spinner animation
│   ├── services/
│   │   ├── summarizationService.ts    # Claude API integration
│   │   └── urlExtractionService.ts    # URL content extraction
│   ├── App.tsx                    # Main component
│   ├── App.css                    # App styling
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── dist/                          # Build output (created by build)
├── .env                           # Environment variables (local - not committed)
├── .env.example                   # Example template
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── README.md                      # Full documentation
```

## 🔧 Technical Details

### Dependencies
- **react**: UI framework
- **axios**: HTTP client for URL fetching
- **typescript**: Type safety
- **vite**: Fast build tool

### API Integration
- **Provider**: Anthropic (Claude)
- **Model**: claude-3-5-sonnet-20241022
- **Max Tokens**: 1024
- **Format**: JSON structured responses

### URL Extraction
- Uses AllOrigins CORS proxy for browser compatibility
- Extracts readable text from HTML
- Handles encoding and cleanup automatically

## ⚠️ Important Notes

### Environment Variables
- `VITE_ANTHROPIC_API_KEY` must be set for the app to work
- Never commit `.env` to git (only `.env.example`)
- Keep your API key private

### API Limits
- Claude API has rate limits based on your plan
- Each summarization request counts against your quota
- Monitor your usage at console.anthropic.com

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CORS proxy used for URL extraction (may have rate limits)

## 🐛 Troubleshooting

### "API key not configured" Error
- Check `.env` file exists
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Restart dev server after changing `.env`

### "Failed to extract content from URL" Error
- URL might be blocked by CORS
- Content might be behind authentication
- Website might have anti-scraping measures
- Try pasting the text directly instead

### Blank Summary
- API response format might have changed
- Check browser console for detailed errors
- Verify API key is valid at console.anthropic.com

### Port Already in Use
- Dev server automatically uses next available port
- Check `http://localhost:5174`, `5175`, etc.
- Or run: `lsof -i :5173` to find what's using the port

## 📊 How Summarization Works

1. **Content Input**: User provides URL or text
2. **Content Extraction**: 
   - If URL: Fetches and cleans HTML
   - If text: Uses as-is
3. **AI Processing**:
   - Sends to Claude with audience and purpose context
   - Requests structured JSON response
   - Parses and validates response
4. **Display**: Shows formatted summary with icons and styling
5. **Export**: Copy or download options available

## 🔐 Security Considerations

- API key is only used on client-side (browser)
- No data is sent to third-party servers except:
  - Anthropic (for summarization)
  - AllOrigins (for URL content - only for URLs you provide)
- Consider using server-side proxy for production
- Environment variables are not exposed in built code

## 🎨 Customization

### Colors
Edit color values in CSS files:
- Primary gradient: `#667eea` to `#764ba2`
- Text colors: `#333`, `#444`, etc.

### Audience/Purpose Options
Edit dropdowns in `InputForm.tsx`:
```tsx
const audiences = {
  general: 'Your label here',
  // ...
}
```

### Summary Fields
Modify the JSON structure in `summarizationService.ts` to add more fields to the summary.

## 📈 Future Enhancements

Consider adding:
- Multiple language support
- Batch summarization
- Summarization history
- User preferences
- API usage tracking
- Different AI model selection

## 🤝 Contributing

The codebase is organized for easy modification:
- Components are self-contained
- Services handle API logic
- CSS is modular per component
- TypeScript types ensure safety

## 📞 Support

If you encounter issues:
1. Check the error message in the browser console
2. Review this guide's troubleshooting section
3. Verify your API key and network connection
4. Check Anthropic's API documentation

## ✨ What You Can Do Now

1. Start the dev server: `npm run dev`
2. Add your Anthropic API key to `.env`
3. Open the app in your browser
4. Try summarizing an article!

---

**Happy Summarizing!** 🎉

For more information, see [README.md](./README.md)
