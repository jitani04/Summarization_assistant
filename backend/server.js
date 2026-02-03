import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Extracts readable article text from a URL using Playwright (Chromium)
 * Handles bot-gated and JavaScript-heavy websites
 */
async function extractContentWithBrowser(url, timeout = 30000) {
  let browser;
  try {
    // Launch Chromium browser
    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout,
    });

    // Wait for main content to be available
    await page.waitForTimeout(2000);

    // Extract article text
    const articleText = await page.evaluate(() => {
      // Find main content areas
      const mainSelectors = [
        'article',
        '[role="main"]',
        '.article',
        '.post',
        '.content',
        '#main',
        'main',
      ];

      let mainContent = null;
      for (const selector of mainSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          mainContent = element;
          break;
        }
      }

      // If no main content found, use body
      if (!mainContent) {
        mainContent = document.body;
      }

      // Clone the content to avoid modifying the original
      const clonedContent = mainContent.cloneNode(true);

      // Remove unwanted elements
      const removeSelectors = [
        'script',
        'style',
        'nav',
        'footer',
        '.advertisement',
        '.ad',
        '.sidebar',
        '.related',
        '.comments',
        '[data-ad-slot]',
        '.navbar',
        '.header',
        'noscript',
      ];

      removeSelectors.forEach((selector) => {
        clonedContent.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Extract text content
      const text = clonedContent.innerText || clonedContent.textContent || '';

      // Clean up whitespace
      const cleanedText = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');

      return cleanedText;
    });

    if (!articleText || articleText.trim().length === 0) {
      throw new Error('No readable content extracted from the page');
    }

    return articleText;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Browser extraction failed: ${message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'summarization-backend' });
});

// Extract content from URL endpoint
app.post('/api/extract', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Extracting content from: ${url}`);
    const content = await extractContentWithBrowser(url);

    res.json({
      success: true,
      url,
      content,
      length: content.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Extraction error: ${message}`);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📄 Extraction endpoint: POST http://localhost:${PORT}/api/extract`);
  console.log(`❤️  Health check: GET http://localhost:${PORT}/health\n`);
});
