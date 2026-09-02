import SearchBox from "@/components/ui/searchbox";
import PageBackground from "@/components/ui/page-background";
import PosterMosaic from "@/components/ui/poster-mosaic";
import { fetchTrendingMovies } from "@/lib/api/tmdbapi";
import { TmdbMovieSearchResult } from "@/lib/types/tmdb";
import { Globe2, Sparkles, Star } from "lucide-react";

const capabilities = [
  {
    title: "Box-office stats",
    description:
      "Rating, budget, revenue, and vote counts at a glance — the same pills you see on a title page.",
    icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
    iconWrapClassName: "bg-amber-500/10",
  },
  {
    title: "Kowalski analysis",
    description:
      "A concise breakdown of why a title over- or under-performed, written by our AI analyst.",
    icon: <Sparkles className="h-4 w-4 text-primary" />,
    iconWrapClassName: "bg-primary/10",
  },
  {
    title: "Regional revenue",
    description:
      "See where a film earned across territories on an interactive map.",
    icon: <Globe2 className="h-4 w-4 text-primary" />,
    iconWrapClassName: "bg-primary/10",
  },
];

export default async function Home() {
  let trending: TmdbMovieSearchResult[] = [];

  try {
    trending = await fetchTrendingMovies();
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <PosterMosaic titles={trending} />
      <PageBackground className="z-[1]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-14 text-center">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          Cinelytics
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Find insights for any movie
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search a title to get a concise breakdown powered by our AI analyst,
          Kowalski.
        </p>

        <div className="mt-8 w-full max-w-xl">
          <SearchBox size="lg" />
        </div>

        <div className="mt-14 grid w-full gap-3 text-left sm:grid-cols-3 sm:gap-4">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="rounded-2xl border border-border/60 bg-card/70 p-4"
            >
              <div
                className={`mb-3 inline-flex rounded-lg p-2 ${capability.iconWrapClassName}`}
              >
                {capability.icon}
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                {capability.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
