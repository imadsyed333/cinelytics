import {
  imdbapiTitleSchema,
  imdbapiTitlesResponseSchema,
} from "@/lib/schemas/imdbapi";

export const fetchMovies = async (query: string) => {
  const res = await fetch(
    `https://api.imdbapi.dev/search/titles?query=${query}&limit=5`,
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
    console.error(parsed.error);
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
    console.error(parsed.error);
    throw new Error("Invalid IMDb API response");
  }

  return parsed.data;
};
