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
}): Promise<{
  ok?: {
    json?: { key: string; total: number; devices: number }[];
    csv?: string;
    yaml?: string;
    xml?: string;
    toml?: string;
  };
  error?: string;
}> {
  if (!teamId.startsWith("team_")) {
    return { error: "Invalid teamId. It must start with 'team_'." };
  }
  if (!projectId.startsWith("prj_")) {
    return { error: "Invalid projectId. It must start with 'prj_'." };
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

  const raw: { data: { key: string; total: number; devices: number }[] } =
    await response.json();

  switch (format) {
    case "json":
      return { ok: { json: raw.data } };
    case "csv":
      const csv: string =
        "key,total,devices\n" +
        raw.data.map((d) => `${d.key},${d.total},${d.devices}`).join("\n");
      return { ok: { csv } };
    case "yaml":
      const yaml: string = raw.data
        .map(
          (d) =>
            `  - key: ${d.key}\n    total: ${d.total}\n    devices: ${d.devices}`,
        )
        .join("\n");
      return { ok: { yaml: `dataset:\n${yaml}` } };
    case "xml":
      const xml: string = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>${raw.data
        .map(
          (d) =>
            `\n  <data>\n    <key>${d.key}</key>\n    <total>${d.total}</total>\n    <devices>${d.devices}</devices>\n  </data>`,
        )
        .join("")}\n</dataset>`;
      return { ok: { xml } };
    case "toml":
      const toml: string = `[[data]]\n${raw.data
        .map(
          (d) =>
            `  key = "${d.key}"\n  total = ${d.total}\n  devices = ${d.devices}`,
        )
        .join("\n\n[[data]]\n")}`;
      return { ok: { toml } };
  }

  return {
    error: "Invalid format. It must be 'json', 'csv', 'yaml', 'xml', or 'toml'",
  };
}
