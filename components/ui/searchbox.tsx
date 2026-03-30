import Form from "next/form";

const SearchBox = () => {
  return (
    <Form action={"/search"} className="w-full">
      <div className="flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          name="query"
          placeholder="Search for a movie..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          Search
        </button>
      </div>
    </Form>
  );
};

export default SearchBox;
