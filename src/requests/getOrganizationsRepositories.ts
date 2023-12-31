import { getMultipleValuesInput } from "../common/utils";
import { octokit } from "../octokit/octokit";

export const getOrganizationsRepositories = async () => {
  const organizations = getMultipleValuesInput("ORGANIZATIONS");
  const ownersRepos = [];
  for (let i = 0; i < organizations.length; i++) {
    const organizationRepositories = await octokit.paginate(
      octokit.rest.repos.listForOrg,
      { org: organizations[i], type: "all", sort: "pushed", direction: "desc" }
    );

    const repos = organizationRepositories.map((el) => [
      el.owner.login,
      el.name,
    ]);
    ownersRepos.push(...repos);
  }
  return ownersRepos.filter((el) => el && el[0] && el[1]) || [];
};
