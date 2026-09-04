"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BrainCircuit,
  ClipboardX,
  FolderOpen,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ASIDES = [
  "crunching numbers…",
  "reading the reviews…",
  "staring at the map…",
] as const;

const TICKER_MS = 2400;

const PANEL_SHELL =
  "flex h-full min-h-64 flex-col rounded-2xl border border-border/60 bg-card/70 p-4";

const ScanRings = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex size-20 items-center justify-center",
      className,
    )}
  >
    <span className="absolute inset-0 rounded-full border border-primary/45 animate-scan-ring" />
    <span className="absolute inset-0 rounded-full border border-primary/30 animate-scan-ring [animation-delay:0.8s]" />
    <span className="absolute inset-0 rounded-full border border-primary/20 animate-scan-ring [animation-delay:1.6s]" />
    <div className="relative z-10 rounded-full bg-primary/15 p-3">{children}</div>
  </div>
);

const DossierLine = ({
  widthClass,
  delayClass,
}: {
  widthClass: string;
  delayClass?: string;
}) => (
  <div
    className={cn(
      "h-2 rounded-full bg-muted animate-dossier-shimmer",
      widthClass,
      delayClass,
    )}
  />
);

const DossierBlock = ({
  label,
  lines,
}: {
  label: string;
  lines: { widthClass: string; delayClass?: string }[];
}) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold tracking-wide text-muted-foreground/80">
      {label}
    </p>
    <div className="space-y-1.5">
      {lines.map((line) => (
        <DossierLine key={`${label}-${line.widthClass}`} {...line} />
      ))}
    </div>
  </div>
);

export const AnalysisBriefing = () => {
  const [asideIndex, setAsideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAsideIndex((current) => (current + 1) % ASIDES.length);
    }, TICKER_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={PANEL_SHELL}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <ScanRings>
          <BrainCircuit className="size-8 text-primary" strokeWidth={1.5} />
        </ScanRings>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">
            Kowalski is thinking...
          </h3>
          <p
            key={ASIDES[asideIndex]}
            className="font-mono text-xs text-muted-foreground animate-ticker-fade"
          >
            {ASIDES[asideIndex]}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
        <DossierBlock
          label="Performance Summary"
          lines={[
            { widthClass: "w-full" },
            { widthClass: "w-5/6", delayClass: "[animation-delay:200ms]" },
            { widthClass: "w-2/3", delayClass: "[animation-delay:400ms]" },
          ]}
        />
        <DossierBlock
          label="Reasons"
          lines={[
            { widthClass: "w-11/12", delayClass: "[animation-delay:150ms]" },
            { widthClass: "w-3/4", delayClass: "[animation-delay:350ms]" },
          ]}
        />
        <DossierBlock
          label="Final Thoughts"
          lines={[
            { widthClass: "w-4/5", delayClass: "[animation-delay:250ms]" },
            { widthClass: "w-1/2", delayClass: "[animation-delay:450ms]" },
          ]}
        />
      </div>
    </section>
  );
};

type AnalysisErrorVariant = "incomplete" | "offline";

const ERROR_COPY: Record<
  AnalysisErrorVariant,
  { headline: string; detail: string; graphic: ReactNode }
> = {
  incomplete: {
    headline: "Kowalski cannot analysis",
    detail: "Budget and/or revenue not available :(",
    graphic: (
      <div className="relative flex size-20 items-center justify-center">
        <div className="absolute inset-x-4 top-5 h-12 rounded-md border border-dashed border-border/80 bg-muted/40" />
        <div className="absolute left-6 top-3 size-10 rounded-md border border-border/70 bg-card/90" />
        <div className="relative z-10 rounded-full bg-muted/70 p-3">
          <FolderOpen className="size-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <ClipboardX
          className="absolute -right-1 -bottom-0.5 size-5 text-destructive"
          strokeWidth={1.75}
        />
      </div>
    ),
  },
  offline: {
    headline: "Could not connect to Kowalski",
    detail: "Please try again later.",
    graphic: (
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-1 rounded-full border border-destructive/25" />
        <span className="absolute inset-4 rounded-full border border-destructive/15" />
        <div className="relative z-10 rounded-full bg-destructive/10 p-3">
          <WifiOff className="size-8 text-destructive" strokeWidth={1.5} />
        </div>
      </div>
    ),
  },
};

export const AnalysisError = ({
  variant,
}: {
  variant: AnalysisErrorVariant;
}) => {
  const { headline, detail, graphic } = ERROR_COPY[variant];

  return (
    <section className={PANEL_SHELL}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {graphic}
        <div className="max-w-xs space-y-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">
            {headline}
          </h3>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
    </section>
  );
};
