import { octokit } from "../../octokit";

export const getPullRequestCommits = async (
  pullRequestNumbers: number[],
  options?: { skip: boolean }
) =>
  !options?.skip
    ? pullRequestNumbers.map((number) =>
        octokit.rest.pulls.listCommits({
          owner: process.env.GITHUB_OWNER!,
          repo: process.env.GITHUB_REPO!,
          pull_number: number,
          per_page: 100,
          page: 1,
        })
      )
    : [];
