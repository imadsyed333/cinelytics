import { fetchMovie } from "@/lib/api/tmdbapi";
import { TmdbMovie } from "@/lib/types/tmdb";

const MoviePage = async ({
  params,
}: {
  params: Promise<{ titleId: string }>;
}) => {
  const { titleId } = await params;

  const movie: TmdbMovie = await fetchMovie(titleId);

  return (
    <div className="flex h-screen justify-center items-center text-black">
      <div className="flex flex-row h-100">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.png"
          }
          height={"300px"}
          width={"auto"}
          className="mr-2"
          alt={movie?.title || "Image not found"}
        />
        <div className="text-3xl ml-2">{movie?.title}</div>
        <div className="text-2xl mt-4">
          {movie?.vote_average
            ? `Rating: ${movie.vote_average} (${movie.vote_count} votes)`
            : "No rating available"}
        </div>
        <div className="text-xl mt-4">{movie?.overview}</div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate Analysis
      </button>
    </div>
  );
};

export default MoviePage;
