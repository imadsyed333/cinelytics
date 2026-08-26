import { fetchRegionalRevenue } from "@/lib/api/bom";
import { BomRegionalRevenue } from "@/lib/types/bom";

type RegionalRevenueViewProps = {
  imdbId: string;
};

const formatRevenue = (revenue: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(revenue);

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

  const sorted = [...rows].sort((a, b) => b.revenue - a.revenue);

  return (
    <section className="rounded-2xl border border-border/60 bg-card/70 p-5">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
        Regional Revenue
      </h3>
      <div className="mt-3 max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card/95 text-left text-muted-foreground">
            <tr>
              <th className="pb-2 pr-4 font-medium">Country</th>
              <th className="pb-2 text-right font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sorted.map((row) => (
              <tr key={row.country}>
                <td className="py-2 pr-4 text-foreground/90">{row.country}</td>
                <td className="py-2 text-right font-semibold text-foreground">
                  {formatRevenue(row.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RegionalRevenueView;
