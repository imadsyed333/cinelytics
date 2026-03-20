import z from "zod";
import { tmdbMovieSchema, tmdbMovieSearchResultSchema } from "../schemas/tmdb";

export type TmdbMovie = z.infer<typeof tmdbMovieSchema>;

export type TmdbMovieSearchResult = z.infer<typeof tmdbMovieSearchResultSchema>;
