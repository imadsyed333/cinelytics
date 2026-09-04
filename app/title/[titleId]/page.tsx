import AnalysisView from "@/components/title/AnalysisView";
import BackButton from "@/components/layout/back-button";
import MovieStats from "@/components/title/movie-stats";
import OverviewText from "@/components/title/overview-text";
import ReviewsView from "@/components/title/ReviewsView";
import { fetchMovie } from "@/lib/tmdb/api";
import { TmdbMovie } from "@/lib/tmdb/types";
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
    <div className="flex min-h-full flex-1 flex-col text-foreground lg:h-full lg:min-h-0 lg:overflow-hidden">
      <div className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col px-4 py-4 lg:overflow-hidden lg:py-5">
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

        <div className="mt-4 flex min-h-0 flex-col gap-4 lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden">
          <div className="flex min-h-0 flex-col lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden">
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
              <div className="h-full overflow-y-auto rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
                Kowalski cannot analysis because budget and/or revenue not
                available :(
              </div>
            )}
          </div>
          <div className="flex min-h-0 flex-col lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden">
            <Suspense
              fallback={
                <div className="h-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
                  Loading reviews...
                </div>
              }
            >
              <ReviewsView movie={movie} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
