import { analyzerResponseSchema } from "../schemas/analyzer";
import { AnalyzerResponse } from "../types/analyzer";

export const fetchAnalysis = async (movieId: number): Promise<AnalyzerResponse> => {
  const res = await fetch(`${process.env.ANALYZER_URL}/analyze/${movieId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    // cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error(`Analyzer error: ${res.status}`);
  }
  const json = await res.json();

  const parsed = analyzerResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid analyzer response");
  }

  return parsed.data;
};
