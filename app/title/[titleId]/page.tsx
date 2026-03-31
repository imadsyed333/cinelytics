import AnalysisView from "@/components/ui/AnalysisView";
import { fetchMovie } from "@/lib/api/tmdbapi";
import { TmdbMovie } from "@/lib/types/tmdb";
import { Suspense } from "react";
import Image from "next/image";

const MoviePage = async ({
  params,
}: {
  params: Promise<{ titleId: string }>;
}) => {
  const { titleId } = await params;

  const movie: TmdbMovie = await fetchMovie(titleId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.3),_transparent_60%)]"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="grid gap-6 md:grid-cols-[150px,1fr] md:items-start">
          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60">
            <div className="aspect-[2/3] w-full">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/placeholder.png"
                }
                height={225}
                width={150}
                className="h-full w-full object-cover"
                alt={movie?.title || "Image not found"}
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {movie?.title}
            </h1>

            <div className="mt-4 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground ring-1 ring-border/60">
              {movie?.vote_average
                ? `Rating: ${movie.vote_average} (${movie.vote_count} votes)`
                : "No rating available"}
            </div>

            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {movie?.overview}
            </p>

            <div className="mt-7">
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
                    Analyzing...
                  </div>
                }
              >
                <AnalysisView movie={movie} />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoviePage;
