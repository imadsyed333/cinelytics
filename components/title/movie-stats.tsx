import { TmdbMovie } from "@/lib/tmdb/types";
import { Banknote, CalendarDays, Star, TrendingUp, Users } from "lucide-react";
import { ReactNode } from "react";

type MovieStatsProps = {
  movie: TmdbMovie;
};

type StatItem = {
  label: string;
  value: string;
  icon: ReactNode;
  iconWrapClassName: string;
};

const formatCompactNumber = (value: number) =>
  Intl.NumberFormat("en-US", { notation: "compact" }).format(value);

const formatCompactCurrency = (value: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const MovieStats = ({ movie }: MovieStatsProps) => {
  const stats: StatItem[] = [
    {
      label: "Rating",
      value: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
      icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
      iconWrapClassName: "bg-amber-500/10",
    },
    {
      label: "Votes",
      value: movie.vote_count ? formatCompactNumber(movie.vote_count) : "N/A",
      icon: <Users className="h-4 w-4 text-primary" />,
      iconWrapClassName: "bg-primary/10",
    },
    {
      label: "Release Date",
      value: movie.release_date
        ? new Date(movie.release_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Unknown",
      icon: <CalendarDays className="h-4 w-4 text-primary" />,
      iconWrapClassName: "bg-primary/10",
    },
    {
      label: "Budget",
      value: movie.budget ? formatCompactCurrency(movie.budget) : "Unreported",
      icon: <Banknote className="h-4 w-4 text-primary" />,
      iconWrapClassName: "bg-primary/10",
    },
    {
      label: "Revenue",
      value: movie.revenue ? formatCompactCurrency(movie.revenue) : "Unreported",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      iconWrapClassName: "bg-primary/10",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
        >
          <div className={`shrink-0 rounded-lg p-2 ${stat.iconWrapClassName}`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieStats;
