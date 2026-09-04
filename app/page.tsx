import SearchBox from "@/components/search/searchbox";
import { Video } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen text-foreground">
      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-14 text-center">
        <Video className="mb-4 size-14 text-white sm:size-16" strokeWidth={1.5} />
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Cinelytics
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Analytics without the theatrics
        </p>

        <div className="mt-8 w-full max-w-xl">
          <SearchBox size="lg" />
        </div>
      </main>
    </div>
  );
}
