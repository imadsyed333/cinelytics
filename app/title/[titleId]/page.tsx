"use client";

import { fetchMovie } from "@/lib/api/imdbapi";
import { ImdbapiTitle } from "@/lib/types/imdbapi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MoviePage = () => {
  const params = useParams<{ titleId: string }>();
  const id = params.titleId;

  const [movie, setMovie] = useState<ImdbapiTitle>();

  useEffect(() => {
    if (id) {
      fetchMovie(id)
        .then((res) => setMovie(res))
        .catch((err) => console.error(err));
    }
  }, [id]);

  return (
    <div className="flex h-screen justify-center items-center text-black">
      <div className="flex flex-row h-100">
        <img src={movie?.primaryImage?.url} />
        <div className="text-3xl ml-2">{movie?.primaryTitle}</div>
      </div>
    </div>
  );
};

export default MoviePage;
