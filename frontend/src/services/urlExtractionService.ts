import axios from 'axios'

export async function extractContentFromUrl(url: string): Promise<string> {
  try {
    // Validate URL
    new URL(url)
  } catch {
    throw new Error('Invalid URL format')
  }

  try {
    const candidates = buildProxyCandidates(url)

    for (const candidate of candidates) {
      try {
        const response = await axios.get(candidate, { timeout: 15000 })
        const raw = normalizeProxyResponse(response.data)
        const textContent = raw.includes('<')
          ? extractTextFromHtml(raw)
          : raw.trim()

        if (textContent.trim()) {
          return textContent
        }
      } catch {
        // Try next candidate
      }
    }

    throw new Error('Could not extract readable content from the URL')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Could not extract')) {
        throw error
      }
      throw new Error(
        `Failed to fetch content from URL: ${error.message || 'Unknown error'}`
      )
    }
    throw new Error('Failed to fetch content from URL')
  }
}

function buildProxyCandidates(url: string): string[] {
  const encoded = encodeURIComponent(url)
  const normalized = url.replace(/^https?:\/\//i, '')

  return [
    `https://api.allorigins.win/get?url=${encoded}`,
    `https://r.jina.ai/https://${normalized}`,
    `https://r.jina.ai/http://${normalized}`,
  ]
}

function normalizeProxyResponse(data: unknown): string {
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object' && 'contents' in data) {
    const contents = (data as { contents?: unknown }).contents
    return typeof contents === 'string' ? contents : ''
  }

  return ''
}

function extractTextFromHtml(html: string): string {
  // Remove script and style elements
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .trim()

  return text
}
