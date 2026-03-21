import { fetchAnalysis } from "@/lib/api/analyzer";
import { TmdbMovie } from "@/lib/types/tmdb";
import React from "react";

type AnalysisViewProps = {
  movie: TmdbMovie;
};

const AnalysisView = async ({ movie }: AnalysisViewProps) => {
  const { analysis } = await fetchAnalysis(
    movie.title,
    movie.budget,
    movie.revenue,
    movie.release_date,
    movie.overview,
  ).catch((error) => {
    console.error("Error fetching analysis:", error);
    return {
      analysis: "Sorry, an error occurred while fetching the analysis.",
    };
  });
  return <div className="text-xl mt-4">{analysis}</div>;
};

export default AnalysisView;
