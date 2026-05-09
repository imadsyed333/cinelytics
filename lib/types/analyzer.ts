import z from "zod";
import { analyzerResponseSchema } from "../schemas/analyzer";

export type AnalyzerResponse = z.infer<typeof analyzerResponseSchema>;
