import { Compass, MapPinOff, SignalZero } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const PANEL_SHELL =
  "flex h-full min-h-64 flex-col rounded-2xl border border-border/60 bg-card/70 p-4";

const PINGS = [
  { cx: 82, cy: 52, delay: "0s" },
  { cx: 198, cy: 48, delay: "0.7s" },
  { cx: 286, cy: 54, delay: "1.3s" },
  { cx: 114, cy: 128, delay: "1.9s" },
  { cx: 318, cy: 136, delay: "0.4s" },
] as const;

const WorldSilhouette = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 400 200"
    className={cn("h-full w-full", className)}
    aria-hidden="true"
  >
    <g className="stroke-border/40" fill="none" strokeWidth="0.6">
      <path d="M0 50h400M0 100h400M0 150h400" />
      <path d="M80 0v200M160 0v200M240 0v200M320 0v200" />
    </g>
    <g className="fill-primary/40">
      <path d="M55 30c30-18 70-12 83 12 4 16-10 26-6 40-14 6-32-4-44 4-10 12-18 22-30 14C48 78 42 52 55 30Z" />
      <path d="M150 18c12-6 22 4 14 14-10 2-18-6-14-14Z" />
      <path d="M108 95c14-3 28 7 24 23-4 24-14 44-24 52-10-12-12-38-8-58 2-10 4-16 8-17Z" />
      <path d="M188 32c14-6 30 0 28 14-6 8-18 6-24 12-8-6-12-18-4-26Z" />
      <path d="M190 62c20-4 38 6 40 26-2 24-16 50-32 60-14-8-22-36-18-60 2-16 4-24 10-26Z" />
      <path d="M230 28c38-12 80-6 98 14 8 16-8 30-20 36-16-8-38-4-50 8-14-8-30-22-32-38-0-12 2-18 4-20Z" />
      <path d="M300 118c22-6 48 2 46 20-8 12-28 14-42 6-8-8-10-20-4-26Z" />
    </g>
  </svg>
);

const SurveyGlobe = () => (
  <div className="relative mx-auto aspect-[2/1] w-full max-w-[280px] overflow-hidden rounded-xl border border-border/50 bg-muted/25">
    <WorldSilhouette />
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative size-[140%] max-w-none">
        <div
          className="absolute inset-0 animate-radar-sweep rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, var(--map-revenue-3) 55%, transparent) 38deg, transparent 78deg)",
          }}
        />
      </div>
    </div>
    <svg
      viewBox="0 0 400 200"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {PINGS.map((ping) => (
        <circle
          key={`${ping.cx}-${ping.cy}`}
          cx={ping.cx}
          cy={ping.cy}
          r="7"
          className="fill-[var(--map-revenue-4)] animate-ping-travel"
          style={{ animationDelay: ping.delay, transformOrigin: `${ping.cx}px ${ping.cy}px` }}
        />
      ))}
    </svg>
  </div>
);

const LegendShimmer = () => (
  <div className="mt-2 flex w-full max-w-xs flex-col gap-1 self-center">
    <div className="flex overflow-hidden rounded-full">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="h-2 flex-1 animate-dossier-shimmer"
          style={{
            background: `var(--map-revenue-${index + 1})`,
            animationDelay: `${index * 120}ms`,
          }}
        />
      ))}
    </div>
    <div className="flex text-[10px] text-muted-foreground/80">
      <span className="flex-1 text-left">$0</span>
      <span className="flex-1 text-center">$100M</span>
      <span className="flex-1 text-right">$500M+</span>
    </div>
  </div>
);

export const MapSurvey = () => (
  <section className={PANEL_SHELL}>
    <h3 className="shrink-0 text-sm font-semibold tracking-wide text-muted-foreground">
      Regional Revenue
    </h3>
    <div className="mt-3 flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
      <SurveyGlobe />
      <p className="text-sm text-muted-foreground">
        Surveying box office territories…
      </p>
      <LegendShimmer />
    </div>
  </section>
);

type MapErrorVariant = "uncharted" | "signalLost";

const ERROR_COPY: Record<
  MapErrorVariant,
  { headline: string; detail: string; graphic: ReactNode }
> = {
  uncharted: {
    headline: "These waters aren’t on the chart.",
    detail: "No territorial breakdown showed up for this title.",
    graphic: (
      <div className="relative w-full max-w-[220px] overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/20 p-3">
        <WorldSilhouette className="opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-card/40" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
          <MapPinOff className="size-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
    ),
  },
  signalLost: {
    headline: "The survey team lost the signal.",
    detail: "Territorial grosses couldn’t be retrieved.",
    graphic: (
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-2 rounded-full border border-destructive/20" />
        <SignalZero
          className="absolute -right-0.5 top-1 size-5 text-destructive/80"
          strokeWidth={1.75}
        />
        <div className="relative z-10 rounded-full bg-destructive/10 p-3.5">
          <Compass
            className="size-9 text-destructive animate-compass-wobble"
            strokeWidth={1.5}
          />
        </div>
      </div>
    ),
  },
};

export const MapError = ({ variant }: { variant: MapErrorVariant }) => {
  const { headline, detail, graphic } = ERROR_COPY[variant];

  return (
    <section className={PANEL_SHELL}>
      <h3 className="shrink-0 text-sm font-semibold tracking-wide text-muted-foreground">
        Regional Revenue
      </h3>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 text-center">
        {graphic}
        <div className="max-w-xs space-y-1">
          <p className="text-sm font-medium text-foreground">{headline}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
    </section>
  );
};
