import type { Result } from "@/lib/utils";

export type VaasFormats = "json" | "csv" | "yaml" | "xml" | "toml";
export type VaasRequest = {
  token: string;
  teamId: string;
  projectId: string;
  env: "production" | "preview" | "all";
  from: Date;
  to: Date;
  tz: string;
  filter: any;
  format: VaasFormats;
};

export function vaasRequestValidator(
  request: VaasRequest,
): Result<VaasRequest> {
  if (!request.teamId.startsWith("team_")) {
    return { ok: false, error: "Invalid teamId. It must start with 'team_'." };
  }
  if (!request.projectId.startsWith("prj_")) {
    return {
      ok: false,
      error: "Invalid projectId. It must start with 'prj_'.",
    };
  }
  return { ok: true, value: request };
}

export async function vaas(request: VaasRequest): Promise<
  Result<{
    data: string;
    type: VaasFormats;
  }>
> {
  const validRequest = vaasRequestValidator(request);
  if (!validRequest.ok) {
    return { ok: false, error: validRequest.error };
  }

  const url: string =
    `https://vercel.com/api/web-analytics/timeseries` +
    `?teamId=${request.teamId}` +
    `&projectId=${request.projectId}` +
    (request.env === "all" ? "" : `&environment=${request.env}`) +
    `&filter=${encodeURI(request.filter)}` +
    `&from=${request.from.toISOString()}` +
    `&to=${request.to.toISOString()}` +
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

  // JSON response is shaped this way if successful, check for errors is done above
  const raw: { data: { key: string; total: number; devices: number }[] } =
    jsonResponse;

  switch (request.format) {
    case "json":
      return {
        ok: true,
        value: { data: JSON.stringify(raw.data, null, 2), type: "json" },
      };
    case "csv":
      const csv: string =
        "key,total,devices\n" +
        raw.data.map((d) => `${d.key},${d.total},${d.devices}`).join("\n");
      return { ok: true, value: { data: csv, type: "csv" } };
    case "yaml":
      const yaml: string = raw.data
        .map(
          (d) =>
            `  - key: ${d.key}\n    total: ${d.total}\n    devices: ${d.devices}`,
        )
        .join("\n");
      return { ok: true, value: { data: `dataset:\n${yaml}`, type: "yaml" } };
    case "xml":
      const xml: string = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>${raw.data
        .map(
          (d) =>
            `\n  <data>\n    <key>${d.key}</key>\n    <total>${d.total}</total>\n    <devices>${d.devices}</devices>\n  </data>`,
        )
        .join("")}\n</dataset>`;
      return { ok: true, value: { data: xml, type: "xml" } };
    case "toml":
      const toml: string = `[[data]]\n${raw.data
        .map(
          (d) =>
            `  key = "${d.key}"\n  total = ${d.total}\n  devices = ${d.devices}`,
        )
        .join("\n\n[[data]]\n")}`;
      return { ok: true, value: { data: toml, type: "toml" } };
  }

  // This should never happen but Types are in build step only, this gives runtime safety and a message to the UI
  return {
    ok: false,
    error: `Invalid format. Must be JSON, CSV, YAML, XML, or TOML but received ${(request.format as String).toUpperCase()}.`,
  };
}
