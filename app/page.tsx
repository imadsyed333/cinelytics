import SearchBox from "@/components/ui/searchbox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(6,53,108,0.35),_transparent_60%)]"
      />

      <header className="w-full border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 ring-1 ring-border/60" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Cinelytics
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Analytics, without the theatrics
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find insights for any movie
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search a title to get a concise breakdown powered by our analyzer.
        </p>

        <div className="mt-8 w-full max-w-xl">
          <SearchBox />
        </div>
      </main>
    </div>
  );
}
