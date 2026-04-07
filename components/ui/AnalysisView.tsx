import { fetchAnalysis } from "@/lib/api/analyzer";
import { TmdbMovie } from "@/lib/types/tmdb";

type AnalysisViewProps = {
  movie: TmdbMovie;
};

const AnalysisView = async ({ movie }: AnalysisViewProps) => {
  const { analysis } = await fetchAnalysis(movie.id).catch((err) => {
    console.error("Failed to fetch analysis:", err);
    return {
      analysis: "Could not connect to Kowalski. Please try again later.",
    };
  });
  return (
    <section className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
        Analysis
      </h2>
      <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">
        {analysis}
      </p>
    </section>
  );
};

export default AnalysisView;
