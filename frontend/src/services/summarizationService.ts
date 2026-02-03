import { GoogleGenAI } from "@google/genai";
import type { Summary } from "../App";
import { extractContentFromUrl } from "./urlExtractionService";

const GOOGLE_GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

export async function summarizeContent(
  content: string,
  audience: string,
  purpose: string
): Promise<Summary> {
  if (!GOOGLE_GEMINI_API_KEY) {
    throw new Error(
      "Google Gemini API key not configured. Please set VITE_GOOGLE_GEMINI_API_KEY environment variable."
    );
  }

  const ai = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY });

  const audienceDescriptions: Record<string, string> = {
    general: "a general audience with no specialized knowledge",
    executive: "executive-level decision makers",
    technical: "technical professionals and engineers",
    student: "students and learners",
    researcher: "academic researchers and scholars",
  };

  const purposeDescriptions: Record<string, string> = {
    informative: "to provide comprehensive information",
    actionable: "to enable decision-making and action",
    learning: "for educational and learning purposes",
    quick: "for a quick overview and understanding",
    research: "for research and reference purposes",
  };

  const prompt = `You are an expert summarizer. Analyze the following content and create a structured summary tailored for ${audienceDescriptions[audience]} with a purpose of ${purposeDescriptions[purpose]}.

Content to summarize:
${content}

Please respond with a JSON object in this exact format:
{
  "title": "A concise, engaging title for this content",
  "keyInsights": [
    "First key insight",
    "Second key insight",
    "Third key insight",
    "Fourth key insight"
  ],
  "nextSteps": [
    "First action or next step",
    "Second action or next step",
    "Third action or next step"
  ]
}

Ensure the insights and next steps are appropriate for the ${audience} audience and serve the ${purpose} purpose. Return ONLY valid JSON, no additional text.`;

  const tools = [{ url_context: {} }] as unknown as Array<Record<string, unknown>>;

  // Check if content is a URL
  const isUrl = content.trim().startsWith('http://') || content.trim().startsWith('https://');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: isUrl ? { tools } : undefined,
    });

    const responseText =
      response.text ??
      response.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("") ??
      "";

    // Check if response indicates a bot gate or access issue
    const botGateIndicators = [
      'javascript',
      'cookies',
      'verify',
      'browser',
      'enable',
      'security check',
      'cloudflare',
      'captcha'
    ];
    
    const lowerResponse = responseText.toLowerCase();
    const hasBotGate = botGateIndicators.some(indicator => 
      lowerResponse.includes(indicator) && lowerResponse.includes('browser')
    );

    // If bot gate detected and we have a URL, try proxy-based extraction
    if (hasBotGate && isUrl) {
      try {
        const extractedContent = await extractContentFromUrl(content.trim());
        
        // Retry with extracted content (no url_context tools)
        const retryPrompt = `You are an expert summarizer. Analyze the following content and create a structured summary tailored for ${audienceDescriptions[audience]} with a purpose of ${purposeDescriptions[purpose]}.

Content to summarize:
${extractedContent}

Please respond with a JSON object in this exact format:
{
  "title": "A concise, engaging title for this content",
  "keyInsights": [
    "First key insight",
    "Second key insight",
    "Third key insight",
    "Fourth key insight"
  ],
  "nextSteps": [
    "First action or next step",
    "Second action or next step",
    "Third action or next step"
  ]
}

Ensure the insights and next steps are appropriate for the ${audience} audience and serve the ${purpose} purpose. Return ONLY valid JSON, no additional text.`;

        const retryResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: retryPrompt,
        });

        const retryText =
          retryResponse.text ??
          retryResponse.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => part.text ?? "")
            .join("") ??
          "";

        const retryJsonMatch = retryText.match(/\{[\s\S]*\}/);
        if (retryJsonMatch) {
          const retrySummary: Summary = JSON.parse(retryJsonMatch[0]);
          if (retrySummary.title && retrySummary.keyInsights && retrySummary.nextSteps) {
            return retrySummary;
          }
        }
      } catch (extractError) {
        // If extraction fails, continue with original response
        console.warn('Proxy-based extraction fallback failed:', extractError);
      }
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI service");
    }

    const summary: Summary = JSON.parse(jsonMatch[0]);

    if (!summary.title || !summary.keyInsights || !summary.nextSteps) {
      throw new Error("Incomplete summary structure from AI service");
    }

    return summary;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Summarization failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during summarization");
  }
}


