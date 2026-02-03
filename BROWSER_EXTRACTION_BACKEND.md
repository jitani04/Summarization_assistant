# Browser-Based URL Extraction with Playwright

## Overview
The `browserExtractionService.ts` is designed for a **Node.js backend environment** to handle bot-gated URLs using Playwright with Chromium.

## Why It's Not Used in This Frontend App
This React app runs entirely in the browser, which cannot execute Playwright (a server-side automation tool). Playwright requires:
- Node.js environment
- Chromium/Firefox/WebKit browser binaries
- File system access
- System resources

## How to Use It
If you want to add server-side extraction for bot-gated URLs, you would:

1. **Create a separate Node.js backend** (e.g., with Express):
```typescript
import express from 'express';
import { extractContentWithBrowser } from './browserExtractionService';

const app = express();

app.post('/api/extract', async (req, res) => {
  try {
    const { url } = req.body;
    const content = await extractContentWithBrowser(url);
    res.json({ content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Backend server running'));
```

2. **Update the React app to call this endpoint**:
```typescript
const extractedContent = await fetch('http://localhost:3001/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url }),
}).then(r => r.json());
```

## Current Implementation
This frontend app uses:
- **Gemini API's `url_context` tool** for accessible URLs
- **Proxy-based extraction** (AllOrigins, Jina AI) as fallback for bot-gated sites
- No server-side automation

## Browser Extraction Features (When Used with Node.js Backend)
- ✅ Loads pages like a real browser with realistic user agent
- ✅ Waits for JavaScript to execute and page to fully render
- ✅ Finds main article content areas
- ✅ Removes ads, navigation, sidebars, comments, footers
- ✅ Cleans and normalizes extracted text
- ✅ Respects robots.txt (caller's responsibility)
- ✅ Does NOT bypass paywalls or authentication

## Installation for Backend Use
```bash
npm install playwright
npx playwright install chromium
```

## Playwright Documentation
- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-browser)
- [Chrome DevTools](https://playwright.dev/docs/debug)
