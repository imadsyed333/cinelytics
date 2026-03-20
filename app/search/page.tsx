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
    <div className="flex flex-col min-h-screen justify-center items-center">
      {titles.map((searchTitle, key) => (
        <SearchTitleCard key={key} searchTitle={searchTitle} />
      ))}
    </div>
  );
};

export default SearchResultsPage;
