import z from "zod";
import { bomRegionalRevenueSchema } from "./schemas";

export type BomRegionalRevenue = z.infer<typeof bomRegionalRevenueSchema>;
