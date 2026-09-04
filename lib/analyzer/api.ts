import { unstable_cache } from "next/cache";
import { AnalyzerResponse } from "./types";
import { TmdbMovie } from "../tmdb/types";
import { fetchReviews } from "../tmdb/api";
import { runReviewChain, runAnalysisChain } from "./chains";
import {
  stringifyReviews,
  describePerformance,
  systemPrompt,
} from "./utils";

const generateAnalysis = async (
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

export const fetchAnalysis = (
  movie: TmdbMovie,
): Promise<AnalyzerResponse> =>
  unstable_cache(
    () => generateAnalysis(movie),
    ["analysis", String(movie.id)],
    {
      revalidate: false,
      tags: ["analysis", `analysis-${movie.id}`],
    },
  )();
