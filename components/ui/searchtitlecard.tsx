import { TmdbMovieSearchResult } from "@/lib/types/tmdb";
import Link from "next/link";

type SearchTitleCardProps = {
  searchTitle: TmdbMovieSearchResult;
};

const SearchTitleCard = ({ searchTitle }: SearchTitleCardProps) => {
  const { title, poster_path, release_date, id } = searchTitle;
  return (
    <div className="flex border border-gray-300 h-50 w-100 p-2 m-1 rounded-md">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/placeholder.png"
        }
        height={"300px"}
        width={"auto"}
        className="mr-2"
      />
      <div className="flex flex-col">
        <div className="flex flex-row items-baseline">
          <Link href={`/title/${id}`} className="text-blue-500 text-2xl mr-1">
            {title}
          </Link>
          <div>
            ({release_date ? new Date(release_date).getFullYear() : "N/A"})
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTitleCard;
