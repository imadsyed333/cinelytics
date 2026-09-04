import z from "zod";
import { analyzerResponseSchema } from "./schemas";

export type AnalyzerResponse = z.infer<typeof analyzerResponseSchema>;
