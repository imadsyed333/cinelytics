import z from "zod";

export const bomRegionalRevenueSchema = z.object({
    country: z.string(),
    revenue: z.number(),
})