import ollama from "ollama";
import { analyzerResponseSchema } from "./schemas";
import { AnalyzerResponse } from "./types";
import { hf } from "./hf";
import { systemPrompt } from "./utils";

export async function runReviewChain(reviewsStr: string): Promise<string> {
  const prompt = `Here are some reviews for a movie:\n${reviewsStr}\nI want you to provide me with a concise paragraph summarizing the overall sentiment and key points mentioned in these reviews.`;

  const response = await ollama.chat({
    model: "gemma4:e2b",
    think: false,
    messages: [{ role: "user", content: prompt }],
    options: { temperature: 0, f16_kv: true },
  });

  return response.message.content.trim()
}

export async function runAnalysisChain(params: {
  title: string;
  release_date: string;
  budget: number;
  revenue: number;
  rating: number;
  overview: string;
  performance: string;
  sentiment: string;
  regionalRevenue: string;
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

  const regionalBlock = params.regionalRevenue
    ? `${params.regionalRevenue}\n\n`
    : "";

  const prompt =
    `The movie ${params.title} (${params.release_date}) had a budget of $${params.budget}, ` +
    `generated $${params.revenue} in revenue, and received a rating of ${params.rating}/10.\n` +
    regionalBlock +
    `Here's a brief overview of the movie: ${params.overview}\n\n` +
    `${params.sentiment}\n\n` +
    `Explain why the movie ${params.performance}. Link the overview (setting, themes, audience) to standout or weak regions, and how that mix shaped the overall result—don't just restate figures.\n\n` +
    `Return ONLY a valid JSON object with exactly these three top-level keys:\n` +
    `- "performance_summary": a single string\n` +
    `- "reasons": an array of plain strings only (do NOT put key:value pairs inside the array)\n` +
    `- "final_thoughts": a single string at the TOP LEVEL, NOT inside the reasons array\n\n` +
    `Correct example: {"performance_summary": "...", "reasons": ["string1", "string2"], "final_thoughts": "..."}\n` +
    `Do not return markdown, numbering, or extra text.\n`;

  const response = await ollama.chat({
    model: "gemma4:e2b",
    think: false,
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
    format: jsonSchema,
    options: { temperature: 0, f16_kv: true },
  });

  const raw = response.message.content.trim()
  if (!raw) {
    throw new Error("Analyzer returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Analyzer returned invalid JSON");
  }

  return analyzerResponseSchema.parse(parsed);
}
