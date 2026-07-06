import z from "zod";
import {
  tmdbMovieSchema,
  tmdbMovieSearchResultSchema,
  tmdbMovieReviewSchema,
} from "../schemas/tmdb";

export type TmdbMovie = z.infer<typeof tmdbMovieSchema>;

export type TmdbMovieSearchResult = z.infer<typeof tmdbMovieSearchResultSchema>;

export type TmdbMovieReview = z.infer<typeof tmdbMovieReviewSchema>;
