export async function vaas({
  token,
  teamId,
  projectId,
  env,
  from,
  to,
  tz,
  filter,
}: {
  token: string;
  teamId: string;
  projectId: string;
  env: "production" | "preview" | "all";
  from: Date;
  to: Date;
  tz: string;
  filter: any;
}): Promise<{
  ok?: { key: string; views: number; visitors: number }[];
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

  const data: { data: { key: string; total: number; devices: number }[] } =
    await response.json();

  const processedJson: { key: string; views: number; visitors: number }[] =
    data.data.map(({ key, total, devices }) => ({
      key,
      views: total,
      visitors: devices,
    }));

  return { ok: processedJson };
}
