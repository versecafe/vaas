"use server";

import { vaas } from "@/lib/vaas/core";

export async function callVaas({
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
}) {
  return await vaas({
    token,
    teamId,
    projectId,
    env,
    from,
    to,
    tz,
    filter,
  });
}
