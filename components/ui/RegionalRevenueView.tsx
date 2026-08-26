import RegionalRevenueMap from "@/components/ui/RegionalRevenueMap";
import { fetchRegionalRevenue } from "@/lib/api/bom";
import { BomRegionalRevenue } from "@/lib/types/bom";

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
      <section className="rounded-2xl border border-border/60 bg-card/70 p-5">
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
    <section className="rounded-2xl border border-border/60 bg-card/70 p-5">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
        Regional Revenue
      </h3>
      <div className="mt-3">
        <RegionalRevenueMap data={rows} />
      </div>
    </section>
  );
};

export default RegionalRevenueView;
