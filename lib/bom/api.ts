import * as cheerio from "cheerio";
import { bomRegionalRevenueSchema } from "./schemas";
import { BomRegionalRevenue } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const parseMoney = (text: string): number =>
  Number(text.replace(/[^0-9.-]/g, ""));

const pushParsed = (
  results: BomRegionalRevenue[],
  country: string,
  moneyText: string,
) => {
  const parsed = bomRegionalRevenueSchema.safeParse({
    country: country.trim(),
    revenue: parseMoney(moneyText),
  });
  if (parsed.success) {
    results.push(parsed.data);
  }
};

const parseByRegionTables = ($: cheerio.CheerioAPI): BomRegionalRevenue[] => {
  const results: BomRegionalRevenue[] = [];
  const heading = $("h3").filter((_, el) => $(el).text().trim() === "By Region");
  if (!heading.length) return results;

  let el = heading.first().next();
  while (el.length && el.is("table")) {
    el.find("tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 3) return;

      const country = $(cells[0]).text();
      const moneyText =
        $(cells[2]).find("span.money").first().text() || $(cells[2]).text();
      pushParsed(results, country, moneyText);
    });
    el = el.next();
  }

  return results;
};

const parseAreaGrossTables = ($: cheerio.CheerioAPI): BomRegionalRevenue[] => {
  const results: BomRegionalRevenue[] = [];

  $("table").each((_, table) => {
    const headers = $(table)
      .find("tr")
      .first()
      .find("th")
      .map((__, th) => $(th).text().trim())
      .get();

    if (!headers.includes("Area") || !headers.includes("Gross")) return;

    const grossIndex = headers.indexOf("Gross");

    $(table)
      .find("tr")
      .each((__, row) => {
        const cells = $(row).find("td");
        if (cells.length <= grossIndex) return;

        const country = $(cells[0]).text();
        const grossCell = $(cells[grossIndex]);
        const moneyText =
          grossCell.find("span.money").first().text() || grossCell.text();
        pushParsed(results, country, moneyText);
      });
  });

  return results;
};

export const fetchRegionalRevenue = async (
  imdb_id: string,
): Promise<BomRegionalRevenue[]> => {
  const res = await fetch(`https://www.boxofficemojo.com/title/${imdb_id}/`, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Box Office Mojo error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const byRegion = parseByRegionTables($);
  if (byRegion.length) {
    return byRegion;
  }

  return parseAreaGrossTables($);
};
