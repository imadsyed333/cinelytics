# Migrate Cinelytics LLM Logic to Next.js

## Overview

This document provides step-by-step instructions to replicate the LLM analysis pipeline from this FastAPI/Python server into a Next.js app. The pipeline does two things in sequence:

1. **Sentiment step** — summarizes movie reviews into a single paragraph using a small LLM.
2. **Analysis step** — produces a structured JSON analysis of the movie's box office performance using a larger LLM.

Both models are served locally via [Ollama](https://ollama.com).

---

## Source Logic Summary

### Endpoint

`GET /analyze/{movie_id}`

### Pipeline Steps

1. Fetch movie metadata from an external API (TMDB-compatible).
2. Fetch up to 5 reviews for the movie from the same API.
3. Compute a performance label (`"was a hit"`, `"was a moderate success"`, `"broke-even"`, or `"underperformed"`) based on the `revenue / budget` ratio.
4. **Review chain**: Send the stringified reviews to `qwen3.5:0.8b` (via Ollama) with a sentiment-summary prompt → get back a plain-text paragraph.
5. **Analysis chain**: Send movie metadata + the sentiment paragraph to `qwen3.5:4b` (via Ollama) with a structured-output prompt → get back a JSON object matching the `AnalysisResponse` schema.
6. Return the `AnalysisResponse` JSON to the caller.

### `AnalysisResponse` Schema

```json
{
  "performance_summary": "string",
  "reasons": ["string", "string", "string"],
  "final_thoughts": "string"
}
```

---

## Target Architecture in Next.js

Create a Next.js API Route at `app/api/analyze/[movieId]/route.ts` (App Router) that replicates the full pipeline.

---

## Step 1 — Install Dependencies

```bash
npm install ollama zod
```

- **`ollama`** — Official Ollama JavaScript client for calling local models.
- **`zod`** — Schema validation and JSON parsing (replaces Pydantic).

---

## Step 2 — Environment Variables

Add the following to your `.env.local` file:

```env
API_KEY=your_tmdb_bearer_token
API_URL=https://api.themoviedb.org/3
```

These map directly to the Python server's `API_KEY` and `API_URL` env vars loaded via `python-dotenv`.

---

## Step 3 — Type Definitions

Create `lib/cinelytics/types.ts`:

```ts
export interface MovieData {
  title: string;
  release_date: string;
  budget: number;
  revenue: number;
  rating: number;
  overview: string;
}

export interface MovieReview {
  id: string;
  author: string;
  content: string;
}

export interface AnalysisResponse {
  performance_summary: string;
  reasons: string[];
  final_thoughts: string;
}
```

---

## Step 4 — Zod Schema for LLM Output Validation

Create `lib/cinelytics/schema.ts`:

```ts
import { z } from "zod";

export const AnalysisResponseSchema = z.object({
  performance_summary: z
    .string()
    .describe(
      "A concise summary of the movie's box office performance, e.g., 'The movie was a hit, generating 4x its budget in revenue.'",
    ),
  reasons: z
    .array(z.string())
    .length(3)
    .describe(
      "A list of three specific reasons explaining the movie's box office performance.",
    ),
  final_thoughts: z
    .string()
    .describe("A brief concluding statement summarizing the overall analysis."),
});
```

---

## Step 5 — Utility Functions

Create `lib/cinelytics/utils.ts`:

```ts
import { MovieData, MovieReview } from "./types";

const API_KEY = process.env.API_KEY!;
const API_URL = process.env.API_URL!;

// Equivalent to fetch_movie_data + parse_movie_data in utils.py
export async function fetchMovieData(movieId: number): Promise<MovieData> {
  const res = await fetch(`${API_URL}/movie/${movieId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch movie data: ${res.status} - ${await res.text()}`,
    );
  }

  const data = await res.json();

  return {
    title: data.title ?? "",
    release_date: data.release_date ?? "",
    budget: data.budget ?? 0,
    revenue: data.revenue ?? 0,
    rating: data.vote_average ?? 0,
    overview: data.overview ?? "",
  };
}

// Equivalent to fetch_reviews + parse_reviews in utils.py
export async function fetchReviews(movieId: number): Promise<MovieReview[]> {
  const res = await fetch(`${API_URL}/movie/${movieId}/reviews`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch reviews: ${res.status} - ${await res.text()}`,
    );
  }

  const data = await res.json();
  const results: any[] = data.results ?? [];

  return results.map((item) => ({
    id: item.id ?? "",
    author: item.author ?? "",
    content: item.content ?? "",
  }));
}

// Equivalent to stringify_reviews in utils.py — limits to first 5 reviews
export function stringifyReviews(reviews: MovieReview[]): string {
  return reviews
    .slice(0, 5)
    .map((r) => `Review by ${r.author}:\n${r.content}`)
    .join("\n\n")
    .trim();
}

// Equivalent to describe_performance in utils.py
export function describePerformance(revenue: number, budget: number): string {
  if (budget === 0) return "Unknown";
  const ratio = revenue / budget;
  if (ratio >= 3.0) return "was a hit";
  if (ratio >= 2.0) return "was a moderate success";
  if (ratio >= 1.5) return "broke-even";
  return "underperformed";
}

// Equivalent to system_prompt in utils.py
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
```

---

## Step 6 — LLM Chain Functions

Create `lib/cinelytics/chains.ts`:

```ts
import Ollama from "ollama";
import { AnalysisResponseSchema } from "./schema";
import { AnalysisResponse } from "./types";

const ollama = new Ollama();

/**
 * Review chain — equivalent to:
 *   review_chain = review_prompt | reviewer | parser
 * Uses qwen3.5:0.8b to summarize review sentiment into a plain-text paragraph.
 */
export async function runReviewChain(reviewsStr: string): Promise<string> {
  const prompt = `Here are some reviews for a movie:\n${reviewsStr}\nI want you to provide me with a concise paragraph summarizing the overall sentiment and key points mentioned in these reviews.`;

  const response = await ollama.chat({
    model: "qwen3.5:0.8b",
    messages: [{ role: "user", content: prompt }],
    options: {
      temperature: 0,
      num_predict: 128,
    },
  });

  return response.message.content.trim();
}

/**
 * Analysis chain — equivalent to:
 *   analysis_chain = analysis_prompt | analyzer | analysis_parser
 * Uses qwen3.5:4b to produce a structured JSON AnalysisResponse.
 */
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
}): Promise<AnalysisResponse> {
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
    `Return ONLY valid JSON matching this schema. Do not return markdown, numbering, or extra text.\n` +
    `Schema: ${JSON.stringify(jsonSchema)}`;

  const response = await ollama.chat({
    model: "qwen3.5:4b",
    messages: [{ role: "user", content: userPrompt }],
    format: jsonSchema, // Ollama structured output — enforces JSON schema at the model level
    options: {
      temperature: 0,
      num_predict: 128,
    },
  });

  const raw = response.message.content.trim();
  const parsed = JSON.parse(raw);

  // Validate with Zod (equivalent to Pydantic validation in the Python parser)
  return AnalysisResponseSchema.parse(parsed);
}
```

> **Note on structured output**: The `format` field in `ollama.chat()` accepts a JSON Schema object and instructs the model to produce valid JSON matching that schema. This is the direct equivalent of `PydanticOutputParser` in LangChain.

---

## Step 7 — API Route

Create `app/api/analyze/[movieId]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  fetchMovieData,
  fetchReviews,
  stringifyReviews,
  describePerformance,
  systemPrompt,
} from "@/lib/cinelytics/utils";
import { runReviewChain, runAnalysisChain } from "@/lib/cinelytics/chains";

export async function GET(
  _req: NextRequest,
  { params }: { params: { movieId: string } },
) {
  const movieId = parseInt(params.movieId, 10);

  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  const [movieData, movieReviews] = await Promise.all([
    fetchMovieData(movieId),
    fetchReviews(movieId),
  ]);

  const reviewsStr = stringifyReviews(movieReviews);
  const performance = describePerformance(movieData.revenue, movieData.budget);

  // Step 1: sentiment summary (review chain)
  const sentiment = await runReviewChain(reviewsStr);

  // Step 2: structured analysis (analysis chain)
  const analysis = await runAnalysisChain({
    systemPrompt,
    title: movieData.title,
    release_date: movieData.release_date,
    budget: movieData.budget,
    revenue: movieData.revenue,
    rating: movieData.rating,
    overview: movieData.overview,
    performance,
    sentiment,
  });

  return NextResponse.json(analysis);
}
```

---

## Step 8 — Ollama Setup

Ensure Ollama is running locally and both models are pulled:

```bash
ollama serve
ollama pull qwen3.5:0.8b
ollama pull qwen3.5:4b
```

Ollama defaults to `http://localhost:11434`. The `ollama` npm package uses this automatically. If your Ollama instance runs on a different host (e.g., in a Docker container or remote machine), pass the host to the client:

```ts
const ollama = new Ollama({ host: "http://your-ollama-host:11434" });
```

---

## File Structure Summary

```
lib/
  cinelytics/
    types.ts       ← MovieData, MovieReview, AnalysisResponse interfaces
    schema.ts      ← Zod schema for LLM output validation
    utils.ts       ← API fetching, string helpers, system prompt, describePerformance
    chains.ts      ← runReviewChain, runAnalysisChain (Ollama calls)
app/
  api/
    analyze/
      [movieId]/
        route.ts   ← GET handler — orchestrates the full pipeline
.env.local         ← API_KEY, API_URL
```

---

## Python → TypeScript Equivalence Reference

| Python (FastAPI server)                                  | TypeScript (Next.js)                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ChatOllama(model="qwen3.5:0.8b")`                       | `ollama.chat({ model: "qwen3.5:0.8b" })`                                              |
| `ChatOllama(model="qwen3.5:4b")`                         | `ollama.chat({ model: "qwen3.5:4b" })`                                                |
| `PydanticOutputParser(pydantic_object=AnalysisResponse)` | `AnalysisResponseSchema.parse(JSON.parse(raw))` + `format: jsonSchema` in Ollama call |
| `StrOutputParser()`                                      | `.trim()` on `response.message.content`                                               |
| `review_prompt \| reviewer \| parser`                    | `runReviewChain()`                                                                    |
| `analysis_prompt \| analyzer \| analysis_parser`         | `runAnalysisChain()`                                                                  |
| `fetch_movie_data(movie_id)`                             | `fetchMovieData(movieId)`                                                             |
| `fetch_reviews(movie_id)`                                | `fetchReviews(movieId)`                                                               |
| `stringify_reviews(reviews)`                             | `stringifyReviews(reviews)`                                                           |
| `describe_performance(revenue, budget)`                  | `describePerformance(revenue, budget)`                                                |
| `system_prompt` string in `utils.py`                     | `systemPrompt` export in `utils.ts`                                                   |
| `.env` via `python-dotenv`                               | `.env.local` via Next.js built-in env loading                                         |
| FastAPI CORS middleware for `localhost:3000`             | Not needed — route is in the same Next.js app                                         |
