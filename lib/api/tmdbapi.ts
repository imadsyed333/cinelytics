import { tmdbMovieSchema, tmdbMovieSearchResultSchema } from "../schemas/tmdb";

export const fetchMovies = async (query: string) => {
  const res = await fetch(
    `${process.env.API_URL}/search/movie?query=${query}&api_key=${process.env.API_KEY}`,
    {
      next: { revalidate: 60 },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }

  const json = await res.json();

  const parsed = tmdbMovieSearchResultSchema.array().safeParse(json.results);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid TMDB API response");
  }

  return parsed.data;
};

export const fetchMovie = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/movie/${id}`, {
    next: { revalidate: 60 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }

  const json = await res.json();

  const parsed = tmdbMovieSchema.safeParse(json);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid TMDB API response");
  }

  return parsed.data;
};
