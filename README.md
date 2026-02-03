# Content Summarizer App

A modern full-stack application for summarizing articles and text content for specific audiences and purposes. Features include URL extraction, bot gate handling, and browser automation for reliable content extraction.

## ✨ Key Features

- **📄 Dual Input Methods**: Accept URLs or paste text directly
- **🤖 Smart Content Extraction**:
  - Gemini API with `url_context` tool for direct access
  - Proxy-based extraction (AllOrigins, Jina AI) as fallback
  - Browser automation (Playwright) for bot-gated sites
- **🎯 Audience-Specific Summaries**: Tailor for different audiences (executives, technical professionals, students, researchers, etc.)
- **🔍 Purpose-Driven Content**: Generate based on intent (informative, actionable, learning, quick overview, research)
- **📋 Structured Output**:
  - Concise titles
  - Key insights with visual cards
  - Actionable next steps with numbering
- **🎨 Modern UI**: 
  - Gray color scheme
  - ChatGPT-style input interface
  - Side-by-side or stacked layout
  - Responsive design

## 🏗️ Architecture

```
Summarization_assistant/
├── frontend/                   ├── backend/
│   ├── src/                    │   ├── server.js
│   ├── public/                 │   └── package.json
│   └── package.json            └── (Express + Playwright)
└── (React/Vite)

Frontend (React/Vite)          Backend (Express/Node.js)
├── InputForm                  ├── Express Server
├── SummaryDisplay            ├── Playwright/Chromium
├── LoadingSpinner            └── Content Extraction
└── Services:                   
    ├── Gemini API ────────────→ Gemini Service
    ├── Proxy Extraction
    └── Browser Service ──────→ Backend API
```

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Playwright + Chromium
- **AI**: Google Gemini API
- **Content Extraction**: Multiple methods (API, proxy, browser automation)
- **Styling**: Modern CSS with responsive design

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run setup script
./setup.sh

# Add your API key to .env
# Then run:
npm run dev:all      # Full stack (frontend + backend)
# or
npm run dev          # Frontend only
```

### Option 2: Manual Setup

```bash
# Install everything
npm run setup

# Configure .env
cp .env.example .env
# Edit .env and add VITE_GOOGLE_GEMINI_API_KEY

# Run frontend only
npm run dev

# Or run full stack in two terminals:
# Terminal 1:
npm run dev

# Terminal 2:
npm run dev:backend
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (free tier available at [ai.google.dev](https://ai.google.dev))

## 🔧 Environment Setup

Create `frontend/.env` file:
```
VITE_GOOGLE_GEMINI_API_KEY=your_api_key_here
VITE_BACKEND_URL=http://localhost:3001  # Optional, defaults to 3001
```

## 📚 Available Commands

```bash
npm run setup              # One-time setup (installs everything)
npm run dev                # Frontend only on port 5173
npm run dev:all            # Full stack (frontend + backend)
npm run dev:frontend       # Frontend only
npm run dev:backend        # Backend only on port 3001
npm run build              # Build frontend for production
npm run preview            # Preview production build
npm run lint               # Run linter
```

## 🤖 How It Works

### Content Extraction Pipeline

1. **Primary**: Gemini API `url_context` tool (fastest, direct access)
2. **Fallback 1**: Proxy-based extraction (AllOrigins, Jina AI)
3. **Fallback 2**: Browser automation via Playwright (handles bot gates)
4. **Bot Gate Detection**: Automatically triggered when needed

### Frontend Workflow

1. User enters URL or pastes text
2. Selects audience and purpose
3. Clicks submit
4. Frontend calls Gemini API with content
5. Returns structured summary
6. If Gemini fails due to bot gate, retries with proxy extraction
7. If proxy fails, calls backend for browser automation

### Backend Workflow (When Running)

1. Receives extraction request from frontend
2. Launches Chromium in headless mode
3. Loads page with realistic browser headers
4. Waits for JavaScript to execute
5. Extracts article content
6. Removes ads, navigation, footers
7. Returns clean text to frontend

## 🎯 Deployment

### Frontend Only (No Bot Gate Support)
- Deploy to Vercel, Netlify, or any static host
- Run: `npm run build`
- Upload `dist/` folder

### Full Stack (With Bot Gate Support)

**Frontend** → Any static host (Vercel, Netlify)
**Backend** → Node.js host (Heroku, Railway, your server)

Update `.env` in production:
```
VITE_GOOGLE_GEMINI_API_KEY=production_key
VITE_BACKEND_URL=https://api.yourdomain.com
```

## ⚙️ Advanced Configuration

### Change Ports
- **Frontend**: Edit `vite.config.ts` 
- **Backend**: Set `PORT` environment variable

### Update CORS (Production)
Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
}));
```

### Custom Extraction Selectors
Edit `backend/server.js` to customize which DOM elements are extracted.

## 📖 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup and configuration
- [BROWSER_EXTRACTION_BACKEND.md](BROWSER_EXTRACTION_BACKEND.md) - Backend technical details
- [backend/README.md](backend/README.md) - Backend API reference

## 🐛 Troubleshooting

**"Backend extraction service unavailable"**
- Ensure backend is running: `npm run dev:all`
- Check port 3001 is not in use
- Check browser console for CORS errors

**Playwright installation fails**
- Try: `npx playwright install --with-deps chromium`
- On M1/M2 Mac: May need `softwareupdate --install-rosetta`

**Port already in use**
```bash
lsof -i :5173   # Find process using port
kill -9 <PID>   # Kill it
```

## 📝 License

MIT

## 🙋 Support

For issues or questions:
1. Check the troubleshooting section in SETUP_GUIDE.md
2. Review browser console for errors (F12)
3. Check backend logs in terminal
4. See BROWSER_EXTRACTION_BACKEND.md for technical details


## Installation

1. **Navigate to the project directory**:
   ```bash
   cd Summarization_assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** (already provided, but you can reference `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Add your Anthropic API key** to the `.env` file:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

## Development

### Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Usage

1. **Choose Input Method**:
   - Select "Paste Text" to directly input article content
   - Select "Enter URL" to provide a web article link

2. **Set Summarization Parameters**:
   - **Target Audience**: Choose from general public, executives, technical professionals, students, or researchers
   - **Purpose of Summary**: Select from informative, actionable, learning-focused, quick overview, or research reference

3. **Generate Summary**:
   - Click "Summarize Content" button
   - Wait for the AI to process (shows loading spinner)

4. **Review and Export**:
   - View the structured summary with title, key insights, and next steps
   - Copy the summary to your clipboard
   - Download as a `.txt` file

## Project Structure

```
src/
├── components/
│   ├── InputForm.tsx          # Main input form component
│   ├── InputForm.css          # Form styling
│   ├── SummaryDisplay.tsx     # Summary output component
│   ├── SummaryDisplay.css     # Summary styling
│   ├── LoadingSpinner.tsx     # Loading indicator
│   └── LoadingSpinner.css     # Spinner styling
├── services/
│   ├── summarizationService.ts    # Claude API integration
│   └── urlExtractionService.ts    # URL content extraction
├── App.tsx                    # Main app component
├── App.css                    # App styling
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```


## How It Works

### Input Processing
- Users can input content as either a URL or pasted text
- URL input uses a CORS proxy to fetch and extract text content
- Content is cleaned of HTML and formatted for processing

### Summarization
- Content is sent to Gemini API with context about the target audience and purpose
- Gemini generates a structured JSON response with:
  - **Title**: A concise, engaging headline
  - **Key Insights**: 3-4 important takeaways
  - **Next Steps**: 3 actionable recommendations

### Output
- Summaries are displayed with visual styling and icons
- Users can copy the summary or download it as a text file
  - **Title**: A concise, engaging headline
  - **Key Insights**: 3-4 important takeaways
  - **Next Steps**: 3 actionable recommendations

### Output
- Summaries are displayed with visual styling and icons
- Users can copy the summary or download it as a text file

## Error Handling

The app includes comprehensive error handling for:
- Invalid URLs
- Failed content extraction
- API connection issues
- Invalid API responses
- Missing API key configuration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **react**: ^18.3.1 - UI framework
- **react-dom**: ^18.3.1 - DOM renderer
- **axios**: Latest - HTTP client
- **typescript**: Latest - Type safety
- **vite**: Latest - Build tool

## License

MIT

## Support

For issues or questions, please check the error messages displayed in the app or review the console for detailed error information.

## Future Enhancements

- Support for multiple languages
- Batch summarization of multiple URLs
- Custom summary templates
- Summarization history
- Integration with additional LLM providers
- PDF file upload support
- API rate limiting display

---

Built with React, TypeScript, and Vite. Powered by Anthropic's Claude AI.

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
