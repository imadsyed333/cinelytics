import { Clapperboard, Film, TrendingUp, Video } from "lucide-react";

const COLS = 10;
const ROWS = 8;
const CELL_COUNT = COLS * ROWS;
const ICONS = [Video, TrendingUp, Clapperboard, Film] as const;

const jitter = (index: number, span: number) =>
  ((index * 37 + 11) % (span * 2 + 1)) - span;

const IconTile = () => (
  <div
    className="grid h-full w-1/2 shrink-0 overflow-visible"
    style={{
      gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
    }}
  >
    {Array.from({ length: CELL_COUNT }, (_, index) => {
      const row = Math.floor(index / COLS);
      const Icon = ICONS[(index + row) % ICONS.length];
      const offsetX = jitter(index, 6);
      const offsetY = jitter(index + 3, 8);
      const rotate = jitter(index + 7, 14);

      return (
        <div
          key={index}
          className="flex items-center justify-center"
          style={{
            transform: row % 2 === 1 ? "translateX(50%)" : undefined,
          }}
        >
          <Icon
            className="size-8 sm:size-9"
            strokeWidth={1.25}
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`,
            }}
          />
        </div>
      );
    })}
  </div>
);

const IconPatternBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-muted-foreground opacity-[0.1]"
    >
      <div className="flex h-full w-[200%] animate-icon-scroll">
        <IconTile />
        <IconTile />
      </div>
    </div>
  );
};

export default IconPatternBackground;
