import z from "zod";

export const analyzerResponseSchema = z.object({
    analysis: z.string()
})