import Image from "next/image";

const TmdbAttribution = () => (
  <footer className="shrink-0 border-t border-border/40 bg-background/70 px-4 py-3">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
      <a
        href="https://www.themoviedb.org"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
        aria-label="The Movie Database"
      >
        <Image
          src="/tmdb-logo.svg"
          alt="The Movie Database"
          width={123}
          height={16}
          className="h-4 w-auto"
          unoptimized
        />
      </a>
      <p className="max-w-md text-center text-[11px] leading-snug text-muted-foreground sm:max-w-none sm:text-left sm:text-xs">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  </footer>
);

export default TmdbAttribution;

