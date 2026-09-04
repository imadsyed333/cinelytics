import SearchTitleCard from "@/components/search/searchtitlecard";
import { fetchMovies } from "@/lib/tmdb/api";
import BackButton from "@/components/layout/back-button";
import SearchBox from "@/components/search/searchbox";

const SearchResultsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string } | undefined>;
}) => {
  const { query } = (await searchParams) || { query: "" };
  const titles = query ? await fetchMovies(query) : [];

  return (
    <div className="relative min-h-full text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-7">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <BackButton />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Search results
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                for{" "}
                <span className="font-medium text-foreground">
                  {query || "all titles"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 max-w-xl">
            <SearchBox defaultValue={query} />
          </div>
        </header>

        {titles.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
            {query ? (
              <>
                No titles found for{" "}
                <span className="font-medium text-foreground">{query}</span>.
                Try a different search.
              </>
            ) : (
              <>No titles found. Enter a movie title to get started.</>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {titles.map((searchTitle) => (
              <SearchTitleCard key={searchTitle.id} searchTitle={searchTitle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
