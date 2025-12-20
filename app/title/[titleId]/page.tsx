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
      {JSON.stringify(movie)}
    </div>
  );
};

export default MoviePage;
