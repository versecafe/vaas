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
  format: "json" | "csv" | "yaml";
}): Promise<{
  ok?: {
    json?: { key: string; total: number; devices: number }[];
    csv?: string;
    yaml?: string;
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
      const csv: string = raw.data
        .map((d) => `${d.key},${d.total},${d.devices}`)
        .join("\n");
      console.log("csv", csv);
      return { ok: { csv } };
    case "yaml":
      const yaml: string = raw.data
        .map(
          (d) =>
            `  - key: ${d.key}\n    total: ${d.total}\n    devices: ${d.devices}`,
        )
        .join("\n");
      return { ok: { yaml: `data:\n${yaml}` } };
  }

  return { error: "Invalid format. It must be 'json', 'csv', or 'yaml'." };
}
