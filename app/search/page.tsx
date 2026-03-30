import SearchTitleCard from "@/components/ui/searchtitlecard";
import { fetchMovies } from "@/lib/api/tmdbapi";

const SearchResultsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string } | undefined>;
}) => {
  const { query } = (await searchParams) || { query: "" };
  const titles = await fetchMovies(query || "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight">Search results</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            for <span className="font-medium text-foreground">{query}</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {titles.map((searchTitle, key) => (
            <SearchTitleCard key={key} searchTitle={searchTitle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
