import { unstable_cache } from "next/cache";
import { AnalyzerResponse } from "../types/analyzer";
import { BomRegionalRevenue } from "../types/bom";
import { TmdbMovie } from "../types/tmdb";
import { fetchReviews } from "./tmdbapi";
import { fetchRegionalRevenue } from "./bom";
import { runReviewChain, runAnalysisChain } from "../analyzer/chains";
import {
  stringifyReviews,
  stringifyRegionalRevenue,
  describePerformance,
  systemPrompt,
} from "../analyzer/utils";

const generateAnalysis = async (
  movie: TmdbMovie,
): Promise<AnalyzerResponse> => {
  const [reviews, regionalRows] = await Promise.all([
    fetchReviews(movie.id),
    movie.imdb_id
      ? fetchRegionalRevenue(movie.imdb_id).catch((err) => {
          console.error("Failed to fetch regional revenue for analysis:", err);
          return [] as BomRegionalRevenue[];
        })
      : Promise.resolve([] as BomRegionalRevenue[]),
  ]);
  const reviewsStr = stringifyReviews(reviews);
  const regionalRevenue = stringifyRegionalRevenue(regionalRows);
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
    regionalRevenue,
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
