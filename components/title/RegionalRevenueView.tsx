import { MapError } from "@/components/title/map-panel-state";
import RegionalRevenueMap from "@/components/title/RegionalRevenueMap";
import { fetchRegionalRevenue } from "@/lib/bom/api";
import { BomRegionalRevenue } from "@/lib/bom/types";

type RegionalRevenueViewProps = {
  imdbId: string;
};

const RegionalRevenueView = async ({ imdbId }: RegionalRevenueViewProps) => {
  let rows: BomRegionalRevenue[];
  try {
    rows = await fetchRegionalRevenue(imdbId);
  } catch (err) {
    console.error("Failed to fetch regional revenue:", err);
    return <MapError variant="signalLost" />;
  }

  if (rows.length === 0) {
    return <MapError variant="uncharted" />;
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-border/60 bg-card/70 p-4">
      <h3 className="shrink-0 text-sm font-semibold tracking-wide text-muted-foreground">
        Regional Revenue
      </h3>
      <div className="mt-3 min-h-0 flex-1">
        <RegionalRevenueMap data={rows} />
      </div>
    </section>
  );
};

export default RegionalRevenueView;
