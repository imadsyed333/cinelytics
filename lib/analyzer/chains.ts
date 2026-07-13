import ollama from "ollama";
import { analyzerResponseSchema } from "../schemas/analyzer";
import { AnalyzerResponse } from "../types/analyzer";

export async function runReviewChain(reviewsStr: string): Promise<string> {
  const prompt = `Here are some reviews for a movie:\n${reviewsStr}\nI want you to provide me with a concise paragraph summarizing the overall sentiment and key points mentioned in these reviews.`;

  const response = await ollama.chat({
    model: "qwen3.5:0.8b",
    think: false,
    messages: [{ role: "user", content: prompt }],
    options: { temperature: 0 },
  });

  return response.message.content;
}

export async function runAnalysisChain(params: {
  systemPrompt: string;
  title: string;
  release_date: string;
  budget: number;
  revenue: number;
  rating: number;
  overview: string;
  performance: string;
  sentiment: string;
}): Promise<AnalyzerResponse> {
  const jsonSchema = {
    type: "object",
    properties: {
      performance_summary: { type: "string" },
      reasons: { type: "array", items: { type: "string" } },
      final_thoughts: { type: "string" },
    },
    required: ["performance_summary", "reasons", "final_thoughts"],
  };

  const userPrompt =
    `${params.systemPrompt}\n` +
    `The movie ${params.title} (${params.release_date}) had a budget of $${params.budget}, ` +
    `generated $${params.revenue} in revenue, and received a rating of ${params.rating}/10. ` +
    `Here's a brief overview of the movie: ${params.overview}\n\n` +
    `${params.sentiment}\n\n` +
    `Based on this information, provide specific reasons to explain why the movie ${params.performance} at the box office.\n\n` +
    `Return ONLY a valid JSON object with exactly these three top-level keys:\n` +
    `- "performance_summary": a single string\n` +
    `- "reasons": an array of plain strings only (do NOT put key:value pairs inside the array)\n` +
    `- "final_thoughts": a single string at the TOP LEVEL, NOT inside the reasons array\n\n` +
    `Correct example: {"performance_summary": "...", "reasons": ["string1", "string2"], "final_thoughts": "..."}\n` +
    `Do not return markdown, numbering, or extra text.\n`;

  const response = await ollama.chat({
    model: "qwen3.5:2b",
    think: false,
    messages: [{ role: "user", content: userPrompt }],
    format: jsonSchema,
    options: { temperature: 0 },
  });

  const raw = response.message.content;

  const parsed = JSON.parse(raw);
  return analyzerResponseSchema.parse(parsed);
}
