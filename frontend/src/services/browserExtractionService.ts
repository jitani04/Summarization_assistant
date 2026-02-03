/**
 * Browser-based content extraction service
 * 
 * Calls a Node.js backend server that uses Playwright to extract content
 * from bot-gated and JavaScript-heavy websites.
 * 
 * The backend server must be running on BACKEND_URL
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Extracts readable article text from a URL using the backend server
 * which uses Playwright (Chromium) for reliable content extraction
 * 
 * @param url - The URL to extract content from
 * @returns The extracted article text as a string
 * @throws Error if extraction fails or backend is unavailable
 */
export async function extractContentWithBrowser(url: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Backend returned status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success || !data.content) {
      throw new Error(data.error || 'No content extracted');
    }

    return data.content;
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a connection error
      if (error.message.includes('Failed to fetch')) {
        throw new Error(
          'Browser extraction service unavailable. Make sure backend server is running on ' +
            BACKEND_URL +
            '. See BROWSER_EXTRACTION_BACKEND.md for setup instructions.'
        );
      }
      throw error;
    }
    throw new Error('Browser extraction failed: Unknown error');
  }
}
