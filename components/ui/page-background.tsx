import { cn } from "@/lib/utils";

type PageBackgroundProps = {
  className?: string;
};

const PageBackground = ({ className }: PageBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.3),_transparent_60%)]",
        className,
      )}
    />
  );
};

export default PageBackground;
