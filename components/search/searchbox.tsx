import Form from "next/form";
import { cn } from "@/lib/utils";

type SearchBoxProps = {
  defaultValue?: string;
  size?: "default" | "lg";
};

const SearchBox = ({ defaultValue, size = "default" }: SearchBoxProps) => {
  const isLarge = size === "lg";

  return (
    <Form action={"/search"} className="w-full">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50",
          isLarge ? "px-4 py-3" : "px-3 py-2",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-muted-foreground",
            isLarge ? "h-5 w-5" : "h-4 w-4",
          )}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          name="query"
          defaultValue={defaultValue}
          placeholder="Search for a movie..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none",
            isLarge ? "text-base" : "text-sm",
          )}
        />
        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            isLarge ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm",
          )}
        >
          Search
        </button>
      </div>
    </Form>
  );
};

export default SearchBox;
