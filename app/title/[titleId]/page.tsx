import AnalysisView from "@/components/ui/AnalysisView";
import { fetchMovie } from "@/lib/api/tmdbapi";
import { TmdbMovie } from "@/lib/types/tmdb";
import { Suspense } from "react";
import Image from "next/image";
import { Banknote, CalendarDays, Star, TrendingUp, Users } from "lucide-react";

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
        <section className="flex gap-6 items-start">
          <div
            className="flex-shrink-0 relative overflow-hidden rounded-lg border border-border/60 bg-card/60"
            style={{ width: "200px" }}
          >
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

          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {movie?.title}
            </h1>

            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {movie?.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-semibold text-foreground">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Votes</p>
                  <p className="text-sm font-semibold text-foreground">
                    {movie.vote_count
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(movie.vote_count)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Release Date</p>
                  <p className="text-sm font-semibold text-foreground">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Banknote className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-sm font-semibold text-foreground">
                    {movie.budget
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(movie.budget)
                      : "Unreported"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-semibold text-foreground">
                    {movie.revenue
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(movie.revenue)
                      : "Unreported"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
                    Kowalski is thinking...
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
