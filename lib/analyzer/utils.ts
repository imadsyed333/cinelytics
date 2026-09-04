import { BomRegionalRevenue } from "../bom/types";
import { TmdbMovieReview } from "../tmdb/types";

const TOP_REGIONAL_MARKETS = 15;

const formatRegionalRevenue = (revenue: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(revenue);

export function stringifyReviews(reviews: TmdbMovieReview[]): string {
  return reviews
    .slice(0, 5)
    .map((r) => `Review by ${r.author}:\n${r.content}`)
    .join("\n\n")
    .trim();
}

export function stringifyRegionalRevenue(
  rows: BomRegionalRevenue[],
): string {
  const positive = rows
    .filter((row) => row.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  if (positive.length === 0) return "";

  const total = positive.reduce((sum, row) => sum + row.revenue, 0);
  const share = (revenue: number) => `${Math.round((revenue / total) * 100)}%`;

  const top = positive.slice(0, TOP_REGIONAL_MARKETS);
  const restTotal = positive
    .slice(TOP_REGIONAL_MARKETS)
    .reduce((sum, row) => sum + row.revenue, 0);

  const lines = top.map(
    (row) =>
      `- ${row.country}: ${formatRegionalRevenue(row.revenue)} (${share(row.revenue)})`,
  );

  if (restTotal > 0) {
    lines.push(
      `- Other: ${formatRegionalRevenue(restTotal)} (${share(restTotal)})`,
    );
  }

  return `Regional box office (top markets by gross):\n${lines.join("\n")}`;
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
- Ground claims in the provided data; do not invent territories, figures, or events
- Be concise but insightful
- Focus on causal factors (why performance happened)
- Avoid vague statements like "it depends" or "various factors"
- When regional box office is provided, explain why the film's content (setting, themes, audience from the overview) would land better or worse in those markets, and how that mix drove overall results. Do not just restate the numbers.

Structure your response exactly as follows:

1. Performance Summary (1–2 sentences)
2. Key Factors (bullet points, 3–6 items)
3. Final Assessment (1–2 sentences with clear judgment)

Each factor must clearly explain cause → effect.`;
