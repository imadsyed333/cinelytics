import { AnalyzerResponse } from "../types/analyzer";
import { TmdbMovie } from "../types/tmdb";
import { fetchReviews } from "./tmdbapi";
import { runReviewChain, runAnalysisChain } from "../analyzer/chains";
import {
  stringifyReviews,
  describePerformance,
  systemPrompt,
} from "../analyzer/utils";

export const fetchAnalysis = async (
  movie: TmdbMovie,
): Promise<AnalyzerResponse> => {
  const reviews = await fetchReviews(movie.id);
  const reviewsStr = stringifyReviews(reviews);
  const performance = describePerformance(movie.revenue, movie.budget);

  const sentiment = await runReviewChain(reviewsStr);

  return runAnalysisChain({
    systemPrompt,
    title: movie.title,
    release_date: movie.release_date,
    budget: movie.budget,
    revenue: movie.revenue,
    rating: movie.vote_average,
    overview: movie.overview,
    performance,
    sentiment,
  });
};
