import { analyzerResponseSchema } from "../schemas/analyzer";

export const fetchAnalysis = async (
  title: string,
  budget: number,
  revenue: number,
  release_date: string,
  overview: string,
) => {
  const res = await fetch(`${process.env.ANALYZER_URL}/analyze`, {
    method: "POST",
    body: JSON.stringify({
      title,
      budget,
      revenue,
      release_date,
      overview,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
