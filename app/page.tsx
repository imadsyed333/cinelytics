import SearchBox from "@/components/search/searchbox";
import PageBackground from "@/components/layout/page-background";
import PosterMosaic from "@/components/search/poster-mosaic";
import { fetchTrendingMovies } from "@/lib/tmdb/api";
import { TmdbMovieSearchResult } from "@/lib/tmdb/types";

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
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Cinelytics
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Analytics without the theatrics
        </p>

        <div className="mt-8 w-full max-w-xl">
          <SearchBox size="lg" />
        </div>
      </main>
    </div>
  );
}
