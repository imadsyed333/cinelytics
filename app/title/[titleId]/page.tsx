import AnalysisView from "@/components/ui/AnalysisView";
import BackButton from "@/components/ui/back-button";
import MovieStats from "@/components/ui/movie-stats";
import OverviewText from "@/components/ui/overview-text";
import RegionalRevenueView from "@/components/ui/RegionalRevenueView";
import { fetchMovie } from "@/lib/api/tmdbapi";
import { TmdbMovie } from "@/lib/types/tmdb";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Image from "next/image";

const formatRuntime = (minutes?: number) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours && remaining) return `${hours}h ${remaining}m`;
  if (hours) return `${hours}h`;
  return `${remaining}m`;
};

const movieMetaLine = (movie: TmdbMovie) =>
  [
    movie.release_date ? new Date(movie.release_date).getFullYear() : null,
    formatRuntime(movie.runtime),
    movie.genres?.map((genre) => genre.name).join(", ") || null,
  ]
    .filter(Boolean)
    .join(" · ");

const MoviePage = async ({
  params,
}: {
  params: Promise<{ titleId: string }>;
}) => {
  const { titleId } = await params;

  const movie: TmdbMovie = await fetchMovie(titleId);
  const meta = movieMetaLine(movie);

  return (
    <div className="min-h-svh bg-background text-foreground lg:h-svh lg:overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.3),_transparent_60%)]"
      />

      <div className="mx-auto flex min-h-svh max-w-7xl flex-col px-4 py-4 lg:h-svh lg:py-5">
        <header className="flex shrink-0 items-start gap-3 sm:items-center sm:gap-4">
          <BackButton />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight sm:truncate sm:text-3xl lg:text-2xl">
              {movie?.title}
            </h1>
            {meta ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                {meta}
              </p>
            ) : null}
          </div>
        </header>

        <section className="mt-4 shrink-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative w-32 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-card/60 sm:w-36 lg:w-40">
              <div className="aspect-[2/3] w-full">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://community.flowlab.io/uploads/default/original/3X/7/1/71d132125a96d98283289be7ddef4fff4baa6d14.jpeg"
                  }
                  height={225}
                  width={150}
                  className="h-full w-full object-cover"
                  alt={movie?.title || "Image not found"}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <OverviewText text={movie?.overview ?? ""} />
            </div>
          </div>

          <MovieStats movie={movie} />
        </section>

        <div
          className={cn(
            "mt-4 flex flex-1 flex-col gap-4 lg:grid lg:min-h-0 lg:overflow-hidden",
            movie.imdb_id && "lg:grid-cols-2",
          )}
        >
          <div className="order-2 lg:order-none lg:min-h-0 lg:overflow-y-auto">
            {movie.revenue && movie.budget ? (
              <Suspense
                fallback={
                  <div className="h-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
                    Kowalski is thinking...
                  </div>
                }
              >
                <AnalysisView movie={movie} />
              </Suspense>
            ) : (
              <div className="h-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
                Kowalski cannot analysis because budget and/or revenue not
                available :(
              </div>
            )}
          </div>

          {movie.imdb_id ? (
            <div className="order-1 lg:order-none lg:min-h-0 lg:overflow-hidden">
              <Suspense
                fallback={
                  <div className="h-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
                    Loading regional revenue...
                  </div>
                }
              >
                <RegionalRevenueView imdbId={movie.imdb_id} />
              </Suspense>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
