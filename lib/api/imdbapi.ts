import {
  imdbapiTitleSchema,
  imdbapiTitlesResponseSchema,
} from "@/lib/schemas/imdbapi";
import z from "zod";

export const fetchMovies = async (query: string) => {
  const res = await fetch(
    `https://api.imdbapi.dev/search/titles?query=${query}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error(`IMDb API error: ${res.status}`);
  }

  const json = await res.json();

  const parsed = imdbapiTitlesResponseSchema.safeParse(json);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    console.error(errors);
    throw new Error("Invalid IMDb API response");
  }

  return parsed.data;
};

export const fetchMovie = async (titleId: string) => {
  const res = await fetch(`https://api.imdbapi.dev/titles/${titleId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`IMDb API error: ${res.status}`);
  }
  const json = await res.json();

  const parsed = imdbapiTitleSchema.safeParse(json);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    console.error(errors);
    throw new Error("Invalid IMDb API response");
  }

  return parsed.data;
};
