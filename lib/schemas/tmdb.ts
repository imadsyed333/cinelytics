import z from "zod";

export const tmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string().nullable(),
  budget: z.number().nullable(),
  revenue: z.number().nullable(),
  runtime: z.number().nullable(),
  genres: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .optional(),
  overview: z.string().nullable(),
  poster_path: z.string().nullable(),
  vote_average: z.number().nullable(),
  vote_count: z.number().nullable(),
});

export const tmdbMovieSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string().nullable(),
  poster_path: z.string().nullable(),
});
