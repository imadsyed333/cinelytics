import { fetchAnalysis } from "@/lib/api/analyzer";
import { TmdbMovie } from "@/lib/types/tmdb";
import { unstable_cache } from "next/cache";

type AnalysisViewProps = {
  movie: TmdbMovie;
};

const AnalysisView = async ({ movie }: AnalysisViewProps) => {
  const analysis = unstable_cache(
    () =>
      fetchAnalysis(
        movie.title,
        movie.budget,
        movie.revenue,
        movie.release_date,
        movie.overview,
      ),
    [movie.id.toString()],
  );
  return (
    <section className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
        Analysis
      </h2>
      <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">
        {analysis()
          .then((data) => data.analysis)
          .catch(
            () => "Could not connect to Kowalski. Please try again later.",
          )}
      </p>
    </section>
  );
};

export default AnalysisView;
