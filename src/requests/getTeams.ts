import { commonHeaders } from "./constants";
import { octokit } from "../octokit";

export const getTeams = async (orgs: string[]) => {
  const teams = await Promise.allSettled(
    orgs.map((org) =>
      octokit.paginate(octokit.rest.teams.list, {
        headers: commonHeaders,
        org,
        per_page: 100,
      })
    )
  );

  const checkedTeams = teams
  .map((team) => {
    if (team.status === "rejected") {
      console.error(`Error while fetching teams: ${team.reason}`);
      return null;
    }
    return team.value;
  })
  .reduce(
    (acc: { slug: string; org: string; name: string }[], element, index) =>
      element
    ? [
      ...(acc ? acc : []),
      ...element.map((el) => ({
        slug: el.slug,
        org: orgs[index],
        name: el.name,
      })),
    ]
    : acc,
    []
  );
  
  if (!checkedTeams) {
    return {};
  }

  const members = await Promise.allSettled(
    checkedTeams.map(async (team) => {
      if (!team) return null;
      const members = await octokit.paginate(
        octokit.rest.teams.listMembersInOrg,
        {
          headers: commonHeaders,
          org: team.org,
          team_slug: team.slug,
          per_page: 100,
        }
      );
      return { team: team.name, members: members.map((el) => el.login) };
    })
  );

  return members
    .map((res) => (res.status === "fulfilled" ? res.value : null))
    .filter((el) => el)
    .reduce<Record<string, string[]>>((acc, element) => {
      element?.members.forEach((member) => {
        acc[member] = [...(acc[member] || []), element.team];
      });
      return acc;
    }, {});
};
