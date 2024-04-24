import type { Result } from "@/lib/utils";

export type VaasFormats = "json" | "csv" | "yaml" | "xml" | "toml";

export async function vaas({
  token,
  teamId,
  projectId,
  env,
  from,
  to,
  tz,
  filter,
  format,
}: {
  token: string;
  teamId: string;
  projectId: string;
  env: "production" | "preview" | "all";
  from: Date;
  to: Date;
  tz: string;
  filter: any;
  format: VaasFormats;
}): Promise<
  Result<{
    json?: { key: string; total: number; devices: number }[];
    csv?: string;
    yaml?: string;
    xml?: string;
    toml?: string;
  }>
> {
  if (!teamId.startsWith("team_")) {
    return { ok: false, error: "Invalid teamId. It must start with 'team_'." };
  }
  if (!projectId.startsWith("prj_")) {
    return {
      ok: false,
      error: "Invalid projectId. It must start with 'prj_'.",
    };
  }

  const url: string =
    `https://vercel.com/api/web-analytics/timeseries` +
    `?teamId=${teamId}` +
    `&projectId=${projectId}` +
    (env === "all" ? "" : `&environment=${env}`) +
    `&filter=${encodeURI(filter)}` +
    `&from=${from.toISOString()}` +
    `&to=${to.toISOString()}` +
    `&tz=${tz.replace(/\//g, "%2F")}`;

  const response: Response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
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

  // JSON response is shaped this way if successful, check for errors is done above
  const raw: { data: { key: string; total: number; devices: number }[] } =
    jsonResponse;

  switch (format) {
    case "json":
      return { ok: true, value: { json: raw.data } };
    case "csv":
      const csv: string =
        "key,total,devices\n" +
        raw.data.map((d) => `${d.key},${d.total},${d.devices}`).join("\n");
      return { ok: true, value: { csv } };
    case "yaml":
      const yaml: string = raw.data
        .map(
          (d) =>
            `  - key: ${d.key}\n    total: ${d.total}\n    devices: ${d.devices}`,
        )
        .join("\n");
      return { ok: true, value: { yaml: `dataset:\n${yaml}` } };
    case "xml":
      const xml: string = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>${raw.data
        .map(
          (d) =>
            `\n  <data>\n    <key>${d.key}</key>\n    <total>${d.total}</total>\n    <devices>${d.devices}</devices>\n  </data>`,
        )
        .join("")}\n</dataset>`;
      return { ok: true, value: { xml } };
    case "toml":
      const toml: string = `[[data]]\n${raw.data
        .map(
          (d) =>
            `  key = "${d.key}"\n  total = ${d.total}\n  devices = ${d.devices}`,
        )
        .join("\n\n[[data]]\n")}`;
      return { ok: true, value: { toml } };
  }

  // This should never happen but Types are in build step only, this gives runtime safety and a message to the UI
  return {
    ok: false,
    error: `Invalid format. Must be JSON, CSV, YAML, XML, or TOML but received ${(format as String).toUpperCase()}.`,
  };
}
