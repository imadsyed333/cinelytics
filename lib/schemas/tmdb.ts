import z from "zod";

export const tmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  budget: z.number(),
  revenue: z.number(),
  runtime: z.number(),
  genres: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .optional(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const tmdbMovieSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  poster_path: z.string().nullable(),
});
