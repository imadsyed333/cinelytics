import { TmdbMovieReview } from "../types/tmdb";

export function stringifyReviews(reviews: TmdbMovieReview[]): string {
  return reviews
    .slice(0, 5)
    .map((r) => `Review by ${r.author}:\n${r.content}`)
    .join("\n\n")
    .trim();
}

export function describePerformance(revenue: number, budget: number): string {
  if (budget === 0) return "Unknown";
  const ratio = revenue / budget;
  if (ratio >= 3.0) return "was a hit";
  if (ratio >= 2.0) return "was a moderate success";
  if (ratio >= 1.5) return "broke-even";
  return "underperformed";
}

export const systemPrompt = `You are a film industry analyst specializing in box office performance.

Your task is to analyze structured movie data and explain the movie's box office performance.

Follow these rules strictly:
- Base your reasoning ONLY on the provided data
- Do NOT invent facts or external knowledge
- Be concise but insightful
- Focus on causal factors (why performance happened)
- Avoid vague statements like "it depends" or "various factors"

Structure your response exactly as follows:

1. Performance Summary (1–2 sentences)
2. Key Factors (bullet points, 3–6 items)
3. Final Assessment (1–2 sentences with clear judgment)

Each factor must clearly explain cause → effect.`;
