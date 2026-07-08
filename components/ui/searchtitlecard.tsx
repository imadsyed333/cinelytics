import { TmdbMovieSearchResult } from "@/lib/types/tmdb";
import Link from "next/link";
import Image from "next/image";

type SearchTitleCardProps = {
  searchTitle: TmdbMovieSearchResult;
};

const SearchTitleCard = ({ searchTitle }: SearchTitleCardProps) => {
  const { title, poster_path, release_date, id } = searchTitle;
  return (
    <article className="group overflow-hidden rounded-xl border border-border/60 bg-card/60 transition hover:-translate-y-0.5 hover:bg-card">
      <div className="flex gap-3 p-3">
        <div className="relative h-[120px] w-[80px] flex-none overflow-hidden rounded-lg bg-muted">
          <Image
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://community.flowlab.io/uploads/default/original/3X/7/1/71d132125a96d98283289be7ddef4fff4baa6d14.jpeg"
            }
            alt={title}
            height={180}
            width={120}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/title/${id}`}
            className="block truncate text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
          >
            {title}
          </Link>

          <div className="mt-1 text-sm text-muted-foreground">
            ({release_date ? new Date(release_date).getFullYear() : "N/A"})
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchTitleCard;
