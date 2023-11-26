import { octokit } from "../../octokit";

export const getPullRequestChecks = async (
  commits: string[],
  options?: { skip: boolean }
) =>
  !options?.skip
    ? Promise.allSettled(
        commits.map((item) =>
          octokit.rest.checks.listForRef({
            owner: process.env.GITHUB_OWNER!,
            repo: process.env.GITHUB_REPO!,
            per_page: 100,
            page: 1,
            ref: item,
          })
        )
      )
    : [];
