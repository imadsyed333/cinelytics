"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "@vnedyalk0v/react19-simple-maps";
import { scaleThreshold } from "d3-scale";
import { bomCountryToIsoNumeric, bomDisplayLabel } from "@/lib/bom/countryIso";
import geography from "@/lib/bom/countries-110m.json";
import { BomRegionalRevenue } from "@/lib/bom/types";

const SCALE_BREAKS = [25_000_000, 100_000_000, 250_000_000, 500_000_000] as const;
const SCALE_LABELS = ["$0", "$25M", "$100M", "$250M", "$500M+"] as const;

/** Fallbacks matching :root in globals.css if CSS vars are unavailable. */
const FALLBACK_REVENUE = [
  "oklch(0.82 0.08 200)",
  "oklch(0.70 0.12 220)",
  "oklch(0.58 0.14 240)",
  "oklch(0.46 0.16 255)",
  "oklch(0.32 0.16 264)",
];

const FALLBACK_COLORS = {
  empty: "oklch(0.96 0.015 240)",
  revenue: FALLBACK_REVENUE,
  stroke: "oklch(0.7 0.04 250)",
  hoverEmpty: "oklch(0.9 0.04 250)",
};

type MapColors = {
  empty: string;
  revenue: string[];
  stroke: string;
  hoverEmpty: string;
};

type RegionalRevenueMapProps = {
  data: BomRegionalRevenue[];
};

type TerritoryValue = {
  label: string;
  revenue: number;
};

const formatRevenue = (revenue: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(revenue);

const geoId = (geography: { id?: string | number }): string =>
  String(geography.id ?? "");

/** Resolve a CSS color (including oklch vars) to rgb() for SVG fills. */
const resolveCssColor = (value: string, fallback: string): string => {
  if (typeof document === "undefined") return fallback;
  const el = document.createElement("span");
  el.style.color = value || fallback;
  document.body.appendChild(el);
  const resolved = getComputedStyle(el).color;
  document.body.removeChild(el);
  return resolved || fallback;
};

const readThemeMapColors = (): MapColors => {
  if (typeof document === "undefined") return FALLBACK_COLORS;

  const styles = getComputedStyle(document.documentElement);
  const muted = styles.getPropertyValue("--muted").trim();
  const mutedForeground = styles.getPropertyValue("--muted-foreground").trim();

  const revenue = FALLBACK_REVENUE.map((fallback, index) => {
    const token = styles.getPropertyValue(`--map-revenue-${index + 1}`).trim();
    return resolveCssColor(token || fallback, fallback);
  });

  return {
    empty: resolveCssColor(
      `color-mix(in oklch, ${muted || FALLBACK_COLORS.empty} 35%, white)`,
      FALLBACK_COLORS.empty,
    ),
    revenue,
    stroke: resolveCssColor(
      `color-mix(in oklch, ${mutedForeground || FALLBACK_COLORS.stroke} 45%, ${muted || FALLBACK_COLORS.empty})`,
      FALLBACK_COLORS.stroke,
    ),
    hoverEmpty: resolveCssColor(
      `color-mix(in oklch, ${muted || FALLBACK_COLORS.empty} 55%, white)`,
      FALLBACK_COLORS.hoverEmpty,
    ),
  };
};

type TooltipState = {
  x: number;
  y: number;
  label: string;
  revenue: number | null;
};

const RegionalRevenueMap = ({ data }: RegionalRevenueMapProps) => {
  const [colors, setColors] = useState<MapColors>(FALLBACK_COLORS);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const pointerMode = useRef<"mouse" | "touch">("mouse");

  useEffect(() => {
    setColors(readThemeMapColors());
  }, []);

  useEffect(() => {
    if (!tooltip || pointerMode.current !== "touch") return;

    const dismiss = () => setTooltip(null);
    document.addEventListener("touchstart", dismiss);
    return () => document.removeEventListener("touchstart", dismiss);
  }, [tooltip]);

  const byIso = useMemo(() => {
    const map = new Map<string, TerritoryValue>();

    for (const row of data) {
      if (!(row.revenue > 0)) continue;
      const label = bomDisplayLabel(row.country);
      for (const iso of bomCountryToIsoNumeric(row.country)) {
        const existing = map.get(iso);
        if (!existing || row.revenue > existing.revenue) {
          map.set(iso, { label, revenue: row.revenue });
        }
      }
    }

    return map;
  }, [data]);

  const colorScale = useMemo(
    () =>
      scaleThreshold<number, string>()
        .domain([...SCALE_BREAKS])
        .range([...colors.revenue]),
    [colors.revenue],
  );

  const showTooltip = (
    x: number,
    y: number,
    label: string,
    revenue: number | null,
  ) => {
    setTooltip({ x, y, label, revenue });
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 max-h-56 sm:max-h-72 lg:max-h-none">
        <ComposableMap
          projectionConfig={{ scale: 147 }}
          width={800}
          height={420}
          className="h-full w-full"
        >
          <Geographies geography={geography}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
              const id = geoId(geo);
              const value = byIso.get(id);
              const fill = value ? colorScale(value.revenue) : colors.empty;
              const key =
                id ||
                (typeof geo.properties?.name === "string"
                  ? geo.properties.name
                  : `geo-${index}`);
              const countryName =
                typeof geo.properties?.name === "string"
                  ? geo.properties.name
                  : key;
              const label = value?.label ?? countryName;
              const revenue = value?.revenue ?? null;

              return (
                <Geography
                  key={key}
                  geography={geo}
                  stroke={colors.stroke}
                  strokeWidth={0.75}
                  style={{
                    default: { fill, outline: "none" },
                    hover: {
                      outline: "none",
                      fill: value ? fill : colors.hoverEmpty,
                      cursor: "pointer",
                    },
                    pressed: { fill, outline: "none" },
                  }}
                  onMouseEnter={(event) => {
                    if (pointerMode.current === "touch") return;
                    showTooltip(event.clientX, event.clientY, label, revenue);
                  }}
                  onMouseLeave={() => {
                    if (pointerMode.current === "touch") return;
                    setTooltip(null);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    showTooltip(event.clientX, event.clientY, label, revenue);
                  }}
                  onTouchStart={(event) => {
                    pointerMode.current = "touch";
                    event.stopPropagation();
                    const touch = event.touches[0];
                    if (!touch) return;
                    showTooltip(touch.clientX, touch.clientY, label, revenue);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      </div>

      <div className="mt-2 flex shrink-0 flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex overflow-hidden rounded-full">
          {colors.revenue.map((fill, index) => (
            <div
              key={SCALE_LABELS[index]}
              className="h-2 flex-1"
              style={{ background: fill }}
            />
          ))}
        </div>
        <div className="flex">
          {SCALE_LABELS.map((label) => (
            <span key={label} className="flex-1 text-center first:text-left last:text-right">
              {label}
            </span>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-border/60 bg-card px-3 py-2 text-xs shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <p className="font-medium text-foreground">{tooltip.label}</p>
          <p className="text-muted-foreground">
            {tooltip.revenue == null
              ? "Unreported"
              : formatRevenue(tooltip.revenue)}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionalRevenueMap;
