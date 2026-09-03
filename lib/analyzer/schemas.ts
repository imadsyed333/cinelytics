import z from "zod";

export const analyzerResponseSchema = z.object({
  performance_summary: z.string(),
  reasons: z.array(z.string()),
  final_thoughts: z.string(),
});
