"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "@vnedyalk0v/react19-simple-maps";
import { scaleLinear } from "d3-scale";
import { bomCountryToIsoNumeric, bomDisplayLabel } from "@/lib/bom/countryIso";
import geography from "@/lib/bom/countries-110m.json";
import { BomRegionalRevenue } from "@/lib/bom/types";

const SCALE_MIN = 0;
const SCALE_MAX = 1_000_000_000;

/** Fallbacks matching :root in globals.css if CSS vars are unavailable. */
const FALLBACK_COLORS = {
  empty: "oklch(0.96 0.015 240)",
  low: "oklch(0.65 0.1 250)",
  high: "oklch(0.35 0.12 264)",
  stroke: "oklch(0.7 0.04 250)",
  hoverEmpty: "oklch(0.9 0.04 250)",
};

type MapColors = typeof FALLBACK_COLORS;

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

/** Resolve a CSS color (including oklch vars) to rgb() for d3 interpolation. */
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
  const ring = styles.getPropertyValue("--ring").trim();
  const primary = styles.getPropertyValue("--primary").trim();
  const mutedForeground = styles.getPropertyValue("--muted-foreground").trim();

  return {
    empty: resolveCssColor(
      `color-mix(in oklch, ${muted || FALLBACK_COLORS.empty} 35%, white)`,
      FALLBACK_COLORS.empty,
    ),
    low: resolveCssColor(ring, FALLBACK_COLORS.low),
    high: resolveCssColor(primary, FALLBACK_COLORS.high),
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
      scaleLinear<string>()
        .domain([SCALE_MIN, SCALE_MAX])
        .range([colors.low, colors.high])
        .clamp(true),
    [colors.low, colors.high],
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

      <div className="mt-2 flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        <span>{formatRevenue(SCALE_MIN)}</span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            background: `linear-gradient(to right, ${colors.low}, ${colors.high})`,
          }}
        />
        <span>{formatRevenue(SCALE_MAX)}</span>
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
