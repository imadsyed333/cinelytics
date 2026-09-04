import RegionalRevenueMap from "@/components/title/RegionalRevenueMap";
import { fetchRegionalRevenue } from "@/lib/bom/api";
import { BomRegionalRevenue } from "@/lib/bom/types";

type RegionalRevenueViewProps = {
  imdbId: string;
};

const RegionalRevenueView = async ({ imdbId }: RegionalRevenueViewProps) => {
  const rows: BomRegionalRevenue[] = await fetchRegionalRevenue(imdbId).catch(
    (err) => {
      console.error("Failed to fetch regional revenue:", err);
      return [];
    },
  );

  if (rows.length === 0) {
    return (
      <section className="flex h-full min-h-0 flex-col rounded-2xl border border-border/60 bg-card/70 p-4">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
          Regional Revenue
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Regional revenue unavailable
        </p>
      </section>
    );
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
