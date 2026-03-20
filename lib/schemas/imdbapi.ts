import { z } from "zod";

/* ---------- Base / Shared ---------- */

export const imdbapiImageSchema = z.object({
  url: z.url(),
  width: z.number(),
  height: z.number(),
});

export const imdbapiRatingSchema = z.object({
  aggregateRating: z.number().nullable(),
  voteCount: z.number().nullable(),
});

/* ---------- Name ---------- */

export const imdbapiNameSchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

/* ---------- Title ---------- */

export const imdbapiTitleSchema = z.object({
  id: z.string(),
  type: z.string(),
  primaryTitle: z.string(),
  primaryImage: imdbapiImageSchema.nullable().optional(),
  startYear: z.number().optional(),
  runtimeSeconds: z.number().nullable(),
  genres: z.array(z.string()).optional(),
  rating: imdbapiRatingSchema.nullable(),
  plot: z.string().nullable(),
  directors: z.array(imdbapiNameSchema).optional(),
  writers: z.array(imdbapiNameSchema).optional(),
  stars: z.array(imdbapiNameSchema).optional(),
});

export const imdbapiTitleSearchSchema = z.object({
  id: z.string(),
  primaryTitle: z.string(),
  primaryImage: imdbapiImageSchema.nullable().optional(),
  startYear: z.number().optional(),
});

/* ---------- Box Office ---------- */

export const imdbapiMonetarySchema = z.object({
  amount: z.string().optional(),
  currency: z.string().optional(),
});

export const imdbapiBoxOfficeResponseSchema = z.object({
  domesticGross: imdbapiMonetarySchema.nullable().optional(),
  worldwideGross: imdbapiMonetarySchema.nullable().optional(),
  productionBudget: imdbapiMonetarySchema.nullable().optional(),
});

/* ---------- API Response ---------- */

export const imdbapiTitlesResponseSchema = z.object({
  titles: z.array(imdbapiTitleSearchSchema),
});
