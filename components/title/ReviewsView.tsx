import ReviewCard from "@/components/title/review-card";
import { fetchReviews } from "@/lib/tmdb/api";
import { TmdbMovie } from "@/lib/tmdb/types";

type ReviewsViewProps = {
  movie: TmdbMovie;
};

const ReviewsView = async ({ movie }: ReviewsViewProps) => {
  const reviews = await fetchReviews(movie.id)
    .then((all) => all.slice(0, 5))
    .catch((err) => {
      console.error("Failed to fetch reviews:", err);
      return [];
    });

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70">
      <h3 className="shrink-0 border-b border-border/50 px-4 py-3 text-sm font-semibold tracking-wide text-muted-foreground">
        Reviews
      </h3>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {reviews.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            No reviews available.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard
                  author={review.author}
                  content={review.content.trim()}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ReviewsView;
