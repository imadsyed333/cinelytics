import { fetchMovie } from "@/lib/api/imdbapi";
import { ImdbapiTitle } from "@/lib/types/imdbapi";

type paramsType = { titleId: string };

const MoviePage = async ({ params }: { params: paramsType }) => {
  const id = params.titleId;

  const movie: ImdbapiTitle = await fetchMovie(id);

  return (
    <div className="flex h-screen justify-center items-center text-black">
      <div className="flex flex-row h-100">
        <img src={movie?.primaryImage?.url} />
        <div className="text-3xl ml-2">{movie?.primaryTitle}</div>
        <div className="text-2xl mt-4">
          {movie?.rating?.aggregateRating
            ? `Rating: ${movie.rating.aggregateRating} (${movie.rating.voteCount} votes)`
            : "No rating available"}
        </div>
        <div className="text-xl mt-4">{movie?.plot}</div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate Analysis
      </button>
    </div>
  );
};

export default MoviePage;
