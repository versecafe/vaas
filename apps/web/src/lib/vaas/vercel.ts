"use server";

import type { Result } from "@/lib/utils";
import { StringDecoder } from "string_decoder";

export type Team = {
  name: string;
  id: string;
  url: string;
  projects: { name: string; id: string }[];
};

export async function getVercelConfig(token: string): Promise<Result<Team[]>> {
  const allTeams: Result<Team[]> = await getTeams(token);
  if (!allTeams.ok) {
    return { ok: false, error: allTeams.error };
  }

  const teamsAndProjects: Team[] = await Promise.all(
    allTeams.value.map(async (team) => {
      const projects = await getProjects({ token, teamId: team.id });
      if (!projects.ok) {
        return { ...team, projects: [] };
      }
      return { ...team, projects: projects.value };
    }),
  );

  const teams = teamsAndProjects.filter((team) => team.projects.length > 0);

  if (teams.length === 0) {
    return { ok: false, error: "No projects with Web Analytics Data found" };
  }

  return { ok: true, value: teams };
}

async function getTeams(token: string): Promise<Result<Team[]>> {
  // fetch data from Vercel
  const teamsResponse: Response = await fetch(
    "https://api.vercel.com/v2/teams",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  // parse data
  const teamsData: { teams: { id: string; name: string; slug: string }[] } =
    await teamsResponse.json();

  if (teamsData.teams == undefined) {
    return { ok: false, error: "Invalid token" };
  }

  let teams: Team[] = teamsData.teams.map((team) => ({
    name: team.name,
    id: team.id,
    url: `https://vercel.com/${team.slug}`,
    projects: [],
  }));

  return { ok: true, value: teams };
}

/** Returns the id and name of all projects with Web Analytics Data*/
async function getProjects({
  token,
  teamId,
}: {
  token: string;
  teamId: string;
}): Promise<Result<{ name: string; id: string }[]>> {
  const projectsData: Response = await fetch(
    `https://api.vercel.com/v9/projects?teamId=${teamId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  try {
    const projectsJson = await projectsData.json();

    if (projectsJson.projects) {
      let projects: { name: string; id: string }[] = projectsJson.projects
        .filter(
          (project: {
            webAnalytics: { hasData: boolean };
            name: string;
            id: string;
          }) => project.webAnalytics && project.webAnalytics.hasData,
        )
        .map((project: { name: string; id: string }) => {
          return {
            name: project.name,
            id: project.id,
          };
        });
      return { ok: true, value: projects };
    } else {
      return { ok: true, value: [] };
    }
  } catch (e) {
    return { ok: false, error: e as string };
  }
}
