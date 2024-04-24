"use server";

export type Team = {
  name: string;
  id: string;
  url: string;
  projects: { name: string; id: string }[];
};

export async function getVercelConfig(
  token: string,
): Promise<{ ok?: Team[]; error?: string }> {
  console.log("Fetching teams...");
  const allTeams = await getTeams(token);
  if (allTeams.error) {
    console.log(allTeams.error);
    return { error: allTeams.error };
  }

  console.log("Teams fetched successfully!");

  const teamsAndProjects: Team[] = await Promise.all(
    allTeams.ok!.map(async (team) => {
      const projects = await getProjects({ token, teamId: team.id });
      return { ...team, projects: projects.ok! };
    }),
  );

  const teams = teamsAndProjects.filter((team) => team.projects.length > 0);

  if (teams.length === 0) {
    return { error: "No projects with Web Analytics Data found" };
  }

  return { ok: teams };
}

async function getTeams(
  token: string,
): Promise<{ ok?: Team[]; error?: string }> {
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
    return { error: "Invalid token" };
  }

  let teams: Team[] = teamsData.teams.map((team) => ({
    name: team.name,
    id: team.id,
    url: `https://vercel.com/${team.slug}`,
    projects: [],
  }));

  return { ok: teams };
}

/** Returns the id and name of all projects with Web Analytics Data*/
async function getProjects({
  token,
  teamId,
}: {
  token: string;
  teamId: string;
}): Promise<{ ok?: { name: string; id: string }[]; error?: string }> {
  const projectsData: Response = await fetch(
    `https://api.vercel.com/v9/projects?teamId=${teamId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

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
    return { ok: projects };
  } else {
    return { ok: [] };
  }
}
