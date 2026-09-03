import Image from "next/image";
import { TmdbMovieSearchResult } from "@/lib/tmdb/types";

type PosterMosaicProps = {
  titles: TmdbMovieSearchResult[];
};

const TILE_COUNT = 32;

const PosterMosaic = ({ titles }: PosterMosaicProps) => {
  const withPosters = titles.filter((title) => title.poster_path);
  const tiles = Array.from({ length: TILE_COUNT }, (_, index) => {
    const title = withPosters[index % withPosters.length];
    return title ? { ...title, tileKey: `${title.id}-${index}` } : null;
  }).filter((tile): tile is NonNullable<typeof tile> => tile !== null);

  const backdrop = titles.find((title) => title.backdrop_path);

  if (tiles.length === 0 && !backdrop) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {backdrop?.backdrop_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w1280${backdrop.backdrop_path}`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 blur-xl scale-110"
        />
      ) : null}

      {tiles.length > 0 ? (
        <div className="absolute inset-x-0 top-0 grid grid-cols-4 gap-2 p-2 opacity-70 sm:grid-cols-6 lg:grid-cols-8">
          {tiles.map((tile, index) => (
            <div
              key={tile.tileKey}
              className="relative aspect-[2/3] overflow-hidden rounded-md"
              style={{
                transform: `translateY(${(index % 3) * 12 - 8}px)`,
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w185${tile.poster_path}`}
                alt=""
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/55 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.12_0.03_265_/_0.55)_10%,_transparent_65%)]" />
    </div>
  );
};

export default PosterMosaic;
