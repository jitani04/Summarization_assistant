# Backend Server for Content Extraction

Express.js + Playwright server for extracting content from bot-gated and JavaScript-heavy websites.

## Quick Start

```bash
# Install dependencies
npm install

# Install Chromium browser
npx playwright install chromium

# Start server
npm run dev
```

Server runs on: `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```

Returns: `{ status: 'ok', service: 'summarization-backend' }`

### Extract Content
```
POST /api/extract
Content-Type: application/json

{
  "url": "https://example.com/article"
}
```

Returns:
```json
{
  "success": true,
  "url": "https://example.com/article",
  "content": "Extracted article text...",
  "length": 5000
}
```

## Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## How It Works

1. Receives URL from frontend
2. Launches Chromium browser
3. Loads page with realistic user agent
4. Waits for JavaScript execution
5. Finds main article content
6. Removes ads, nav, footers, sidebars
7. Returns clean text to frontend

## Environment Variables

- `PORT` - Server port (default: 3001)

```bash
PORT=3000 npm run dev
```

## Limitations

- ❌ Cannot bypass paywalls or CAPTCHA
- ✅ Handles JavaScript-based bot gates
- ✅ Extracts from dynamic content
- ✅ Works with most modern sites

## Performance

- First request: ~10-20 seconds (browser startup)
- Subsequent requests: ~5-10 seconds each
- Consider using connection pooling for production

## Deployment

For production deployment to servers like Heroku, Railway, or your own VPS:

1. Install system dependencies: `npx playwright install --with-deps`
2. Set PORT environment variable
3. Keep Chromium cache directories accessible
4. Update CORS settings for your frontend domain

Example for production:
```bash
PORT=3001 npm start
```
