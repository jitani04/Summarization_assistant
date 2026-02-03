import { GoogleGenAI } from "@google/genai";
import type { Summary } from "../App";

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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { tools },
  });

  const responseText =
    response.text ??
    response.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("") ??
    "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from AI service");
  }

  const summary: Summary = JSON.parse(jsonMatch[0]);

  if (!summary.title || !summary.keyInsights || !summary.nextSteps) {
    throw new Error("Incomplete summary structure from AI service");
  }

  return summary;
}


