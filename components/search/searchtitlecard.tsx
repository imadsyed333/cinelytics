import { TmdbMovieSearchResult } from "@/lib/tmdb/types";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

type SearchTitleCardProps = {
  searchTitle: TmdbMovieSearchResult;
};

const SearchTitleCard = ({ searchTitle }: SearchTitleCardProps) => {
  const { title, poster_path, release_date, id, overview, vote_average } =
    searchTitle;
  const year = release_date ? new Date(release_date).getFullYear() : "N/A";
  const rating = vote_average ? vote_average.toFixed(1) : "N/A";

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition hover:-translate-y-0.5 hover:bg-card">
      <Link href={`/title/${id}`} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-card/60 sm:w-28">
          <div className="aspect-[2/3] w-full">
            <Image
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : "https://community.flowlab.io/uploads/default/original/3X/7/1/71d132125a96d98283289be7ddef4fff4baa6d14.jpeg"
              }
              alt={title}
              height={252}
              width={168}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {title}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{year}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          </div>

          {overview ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/90">
              {overview}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No overview available.
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default SearchTitleCard;
