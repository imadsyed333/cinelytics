import { z } from "zod";
import {
  imdbapiBoxOfficeResponseSchema,
  imdbapiTitleSchema,
  imdbapiTitleSearchSchema,
  imdbapiTitlesResponseSchema,
} from "@/lib/schemas/imdbapi";

export type ImdbapiTitleSearch = z.infer<typeof imdbapiTitleSearchSchema>;
export type ImdbapiTitle = z.infer<typeof imdbapiTitleSchema>;
export type ImdbapiTitlesResponse = z.infer<typeof imdbapiTitlesResponseSchema>;
export type ImdbapiBoxOfficeResponse = z.infer<
  typeof imdbapiBoxOfficeResponseSchema
>;
