import { fetchAnalysis } from "@/lib/api/analyzer";
import { TmdbMovie } from "@/lib/types/tmdb";

type AnalysisViewProps = {
  movie: TmdbMovie;
};

const normalizeText = (value: string) =>
  value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

const splitParagraphs = (value: string) => {
  const normalized = normalizeText(value);
  if (!normalized) return [];
  return normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
};

const renderParagraphs = (value: string, className = "") => {
  const paragraphs = splitParagraphs(value);
  if (paragraphs.length === 0) {
    return null;
  }

  return paragraphs.map((paragraph, index) => (
    <p
      key={`${paragraph.slice(0, 24)}-${index}`}
      className={`leading-relaxed text-foreground/90 ${className}`.trim()}
    >
      {paragraph}
    </p>
  ));
};

const cleanReason = (reason: string) =>
  normalizeText(reason)
    .replace(/^[-*•]\s+/, "")
    .replace(/^\d+[.)]\s+/, "");

const AnalysisView = async ({ movie }: AnalysisViewProps) => {
  const { performance_summary, reasons, final_thoughts } = await fetchAnalysis(
    movie.id,
  ).catch((err) => {
    console.error("Failed to fetch analysis:", err);
    return {
      performance_summary:
        "Could not connect to Kowalski. Please try again later.",
      reasons: [],
      final_thoughts: "",
    };
  });
  return (
    <section className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
        Analysis
      </h2>
      <div className="mt-4 space-y-6">
        <div className="space-y-3 rounded-xl border border-border/50 bg-background/40 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
            Performance Summary
          </h3>
          {renderParagraphs(performance_summary) ?? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              No summary is available right now.
            </p>
          )}
        </div>

        {reasons.length > 0 && (
          <div className="space-y-3 rounded-xl border border-border/50 bg-background/40 p-4">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
              Reasons
            </h3>
            <ol className="space-y-3 pl-5 marker:text-muted-foreground list-decimal">
              {reasons.map((reason, index) => {
                const cleanedReason = cleanReason(reason);
                return (
                  <li key={`${cleanedReason.slice(0, 24)}-${index}`}>
                    <div className="space-y-2">{renderParagraphs(cleanedReason)}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {normalizeText(final_thoughts) && (
          <div className="space-y-3 rounded-xl border border-border/50 bg-background/40 p-4">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
              Final Thoughts
            </h3>
            <div className="space-y-2">{renderParagraphs(final_thoughts)}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisView;
