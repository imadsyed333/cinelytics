import z from "zod";
import { bomRegionalRevenueSchema } from "../schemas/bom";

export type BomRegionalRevenue = z.infer<typeof bomRegionalRevenueSchema>;