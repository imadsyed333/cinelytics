"use client";
import SearchTitleCard from "@/components/ui/searchtitlecard";
import { fetchMovies } from "@/lib/api/imdbapi";
import { ImdbapiTitleSearch } from "@/lib/types/imdbapi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchResultsPage = () => {
  const params = useSearchParams();
  const query = params.get("query");

  const [movies, setMovies] = useState<ImdbapiTitleSearch[]>([]);

  useEffect(() => {
    if (query) {
      fetchMovies(query)
        .then((res) => setMovies(res.titles))
        .catch((err) => console.error(err));
    }
  }, [query]);
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      {movies.map((searchTitle, key) => (
        <SearchTitleCard key={key} searchTitle={searchTitle} />
      ))}
    </div>
  );
};

export default SearchResultsPage;
