import type { Result } from "@/lib/utils";

export type VsasFormats = "json" | "yaml";
export type VsasRequest = {
  token: string;
  project: string;
  team: string;
  device: "desktop" | "mobile";
  env: "production" | "preview" | "all";
  from: Date;
  to: Date;
  tz: string;
  country?: string;
  route?: string;
  format: VsasFormats;
};

type SpeedInsightScale = { p75: number; p90: number; p95: number; p99: number };
type SpeedInsightDistribution = {
  good: number;
  improvable: number;
  poor: number;
};
type SpeedInsightOverview = {
  CLS: SpeedInsightScale & SpeedInsightDistribution;
  FCP: SpeedInsightScale & SpeedInsightDistribution;
  FID: SpeedInsightScale & SpeedInsightDistribution;
  INP: SpeedInsightScale & SpeedInsightDistribution;
  LCP: SpeedInsightScale & SpeedInsightDistribution;
  RES: SpeedInsightScale;
  TTFB: SpeedInsightScale & SpeedInsightDistribution;
};
type SpeedInsight = {
  date: Date;
  CLS: SpeedInsightScale & { datapoints: number };
  FCP: SpeedInsightScale & { datapoints: number };
  FID: SpeedInsightScale & { datapoints: number };
  INP: SpeedInsightScale & { datapoints: number };
  LCP: SpeedInsightScale & { datapoints: number };
  RES: SpeedInsightScale & { datapoints: number };
  TTFB: SpeedInsightScale & { datapoints: number };
};

export async function vsas(request: VsasRequest): Promise<
  Result<{
    data: string;
    type: VsasFormats;
  }>
> {
  const url: string =
    `https://vercel.com/api/v0/speed-insights/timeseries` +
    `?slug=${request.team}` +
    `&project=${request.project}` +
    (request.env === "all" ? "" : `&environment=${request.env}`) +
    `&from=${request.from.toISOString()}` +
    `&to=${request.to.toISOString()}` +
    `&device=${request.device}` +
    (request.country === undefined ? "" : `&country=${request.country}`) +
    (request.route === undefined ? "" : `&route=${request.route}`) +
    `&tz=${request.tz.replace(/\//g, "%2F")}`;

  const response: Response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${request.token}`,
    },
  });

  if (response.status === 500) {
    return {
      ok: false,
      error:
        "Unkown Vercel server error occurred. This can occur if you have an invalid Time Zone",
    };
  }

  const jsonResponse = await response.json();
  if (jsonResponse.error) {
    return { ok: false, error: jsonResponse.error.message };
  }

  const raw: { overview: SpeedInsightOverview; timeseries: SpeedInsight[] } =
    jsonResponse;

  switch (request.format) {
    case "json":
      return {
        ok: true,
        value: { data: JSON.stringify(raw, null, 2), type: "json" },
      };
    case "yaml":
      return {
        ok: true,
        value: {
          data: JSON.stringify(raw, null, 2)
            .replace(/[\{\}\[\]",]/g, "")
            .replace(/\n  /g, "\n")
            .trim()
            .replace(/\n\s*\n/g, "\n")
            .replace(/  date:/g, "- date:"),
          type: "yaml",
        },
      };
  }

  // This should never happen but Types are in build step only, this gives runtime safety and a message to the UI
  return {
    ok: false,
    error: `Invalid format. Must be JSON or YAML but received ${(request.format as String).toUpperCase()}.`,
  };
}
