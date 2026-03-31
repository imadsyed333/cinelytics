import SearchBox from "@/components/ui/searchbox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.3),_transparent_60%)]"
      />

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find insights for any movie
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search a title to get a concise breakdown powered by our AI analyst,
          Kowalski.
        </p>

        <div className="mt-8 w-full max-w-xl">
          <SearchBox />
        </div>
      </main>
    </div>
  );
}
