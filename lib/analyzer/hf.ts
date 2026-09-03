import { InferenceClient } from "@huggingface/inference";

export const hf = new InferenceClient(process.env.HF_TOKEN);
