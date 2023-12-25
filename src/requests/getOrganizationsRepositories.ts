import { getMultipleValuesInput } from "../common/utils";
import { octokit } from "../octokit/octokit";

export const getOrganizationsRepositories = async () => {
  const organizations = getMultipleValuesInput("ORGANIZATIONS");
  const ownersRepos = [];
  for (let i = 0; i < organizations.length; i++) {
    const organizationRepositories = await octokit.rest.repos.listForOrg({
      org: organizations[i],
      type: "all",
      sort: "pushed",
      direction: "desc",
      page: 1,
      per_page: 100,
    });

    const repos = organizationRepositories.data.map((el) => [
      el.owner.login,
      el.name,
    ]);
    ownersRepos.push(...repos);
  }
  return ownersRepos.filter((el) => el && el[0] && el[1]) || [];
};
